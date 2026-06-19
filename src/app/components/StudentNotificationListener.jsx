"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const LAST_NOTICE_KEY = "student:last-notification-id";
const PROMPT_KEY = "student:notification-permission-prompted";
const POLL_INTERVAL_MS = 30_000;

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

async function registerNotificationWorker() {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register(
      "/student-notifications-sw.js",
    );
    return registration;
  } catch {
    return null;
  }
}

async function showPhoneNotification(notice) {
  if (!canUseBrowserNotifications() || Notification.permission !== "granted") {
    return;
  }

  const options = {
    body: notice.message,
    icon: "/icon.png?v=2",
    badge: "/apple-icon.png?v=2",
    tag: `student-notice-${notice._id}`,
    data: { url: "/student/notifications" },
  };

  const registration = await registerNotificationWorker();

  if (registration?.showNotification) {
    await registration.showNotification(notice.title, options);
    return;
  }

  new Notification(notice.title, options);
}

function promptForPermission() {
  if (!canUseBrowserNotifications() || Notification.permission !== "default") {
    return;
  }

  const alreadyPrompted = localStorage.getItem(PROMPT_KEY);
  if (alreadyPrompted) return;

  localStorage.setItem(PROMPT_KEY, "1");

  toast((t) => (
    <div style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 600 }}>Enable phone alerts?</span>
      <span style={{ fontSize: 13, color: "#64748b" }}>
        Get pop-up alerts when teachers post assignments or announcements.
      </span>
      <button
        type="button"
        onClick={async () => {
          await Notification.requestPermission();
          toast.dismiss(t.id);
        }}
        style={{
          border: "none",
          borderRadius: 8,
          background: "#f59e0b",
          color: "white",
          cursor: "pointer",
          fontWeight: 700,
          padding: "8px 10px",
        }}
      >
        Enable alerts
      </button>
    </div>
  ));
}

export default function StudentNotificationListener() {
  const pathname = usePathname();
  const isStudentRoute = pathname?.startsWith("/student");
  const latestRequestRef = useRef(0);

  useEffect(() => {
    if (!isStudentRoute) return;

    let cancelled = false;
    let intervalId;

    async function checkForNewNotice({ notify = true } = {}) {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      try {
        const res = await fetch("/api/student/notifications?limit=1", {
          cache: "no-store",
        });
        const json = await res.json();
        const latestNotice = json.success ? json.notices?.[0] : null;

        if (
          cancelled ||
          requestId !== latestRequestRef.current ||
          !latestNotice
        ) {
          return;
        }

        const lastSeenId = localStorage.getItem(LAST_NOTICE_KEY);
        localStorage.setItem(LAST_NOTICE_KEY, latestNotice._id);

        if (!notify || !lastSeenId || lastSeenId === latestNotice._id) {
          return;
        }

        toast.success(latestNotice.title);
        await showPhoneNotification(latestNotice);
      } catch {
        // Polling should stay quiet if the student is offline or signed out.
      }
    }

    promptForPermission();
    checkForNewNotice({ notify: false });
    intervalId = window.setInterval(checkForNewNotice, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isStudentRoute]);

  return null;
}
