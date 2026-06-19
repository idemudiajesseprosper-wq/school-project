"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Grid: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  BookOpen: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  LogOut: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  User: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.86-1.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  BookMark: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Save: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
};

const CLASSES = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
];

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  fontSize: "15px",
  color: "#0a0a0a",
  background: "#f9fafb",
  outline: "none",
  fontFamily: "Lato, sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};
const disabledInputStyle = {
  ...inputStyle,
  background: "#f3f4f6",
  color: "#9ca3af",
  cursor: "not-allowed",
};

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "8px",
        }}
      >
        <Icon />
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  const navItems = [
    { label: "Dashboard", icon: Icons.Grid, href: "/student", active: true },
    {
      label: "Assignments",
      icon: Icons.BookOpen,
      href: "/student/assignments",
    },
    { label: "Results", icon: Icons.BookMark, href: "/student/results" },
    { label: "Timetable", icon: Icons.Clock, href: "/student/timetable" },
    {
      label: "Notifications",
      icon: Icons.Bell,
      href: "/student/notifications",
    },
  ];
  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        background: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1a1a1a" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.PNG"
            alt="Logo"
            style={{
              width: "38px",
              height: "38px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "900",
              color: "white",
              fontFamily: "'Playfair Display', serif",
              flexShrink: 0,
            }}
          >
            W
          </div>
          <div>
            <p
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "13px",
                lineHeight: 1.2,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Winners' Foundation
            </p>
            <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>
              Student Portal
            </p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p
          style={{
            color: "#333",
            fontSize: "10px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "8px 12px 12px",
          }}
        >
          My Portal
        </p>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 12px",
              borderRadius: "10px",
              marginBottom: "2px",
              color: item.active ? "white" : "#555",
              background: item.active ? "#1a1a1a" : "transparent",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: item.active ? "600" : "400",
              borderLeft: item.active
                ? "3px solid #2563EB"
                : "3px solid transparent",
            }}
          >
            <item.icon />
            {item.label}
            {item.active && (
              <span style={{ marginLeft: "auto" }}>
                <Icons.ChevronRight />
              </span>
            )}
          </a>
        ))}
      </nav>
      <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 12px",
            borderRadius: "10px",
            width: "100%",
            color: "#ef4444",
            background: "transparent",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "Lato, sans-serif",
          }}
        >
          <Icons.LogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, onLogout }) {
  const navItems = [
    { label: "Dashboard", icon: Icons.Grid, href: "/student", active: true },
    {
      label: "Assignments",
      icon: Icons.BookOpen,
      href: "/student/assignments",
    },
    { label: "Results", icon: Icons.BookMark, href: "/student/results" },
    { label: "Timetable", icon: Icons.Clock, href: "/student/timetable" },
    {
      label: "Notifications",
      icon: Icons.Bell,
      href: "/student/notifications",
    },
  ];
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 40,
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          background: "#0a0a0a",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.2s ease",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "900",
                color: "white",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              W
            </div>
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "13px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Winners' Foundation
              </p>
              <p style={{ color: "#555", fontSize: "11px" }}>Student Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <Icons.X />
          </button>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 12px",
                borderRadius: "10px",
                marginBottom: "4px",
                color: item.active ? "white" : "#777",
                background: item.active ? "#1a1a1a" : "transparent",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: item.active ? "600" : "400",
                borderLeft: item.active
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
              }}
            >
              <item.icon />
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "13px 12px",
              borderRadius: "10px",
              width: "100%",
              color: "#ef4444",
              background: "transparent",
              border: "none",
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "Lato, sans-serif",
            }}
          >
            <Icons.LogOut />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    studentClass: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setForm({
          fullName: data.user.fullName || "",
          phoneNumber: data.user.phoneNumber || "",
          studentClass: data.user.studentClass || "",
          avatar: data.user.avatar || "",
        });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Logout failed");
      toast.success("Logged out");
      router.push("/login/student");
    } catch {
      toast.error("Logout failed");
    }
  };

  const saveProfile = async () => {
    if (!form.fullName.trim()) return toast.error("Full name is required");
    try {
      setSaving(true);
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated");
        setUser((prev) => ({ ...prev, ...form }));
        setEditing(false);
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadPassport = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Passport must be an image");
    try {
      setUploadingAvatar(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "school-portal/students/passports");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (!data.success)
        return toast.error(data.error || "Passport upload failed");
      setForm((prev) => ({ ...prev, avatar: data.url }));
      toast.success("Passport uploaded");
    } catch {
      toast.error("Passport upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const changePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    )
      return toast.error("All fields are required");
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return toast.error("New passwords do not match");
    if (passwordForm.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    try {
      setSaving(true);
      const res = await fetch("/api/student/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed");
        setChangingPassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      studentClass: user.studentClass || "",
      avatar: user.avatar || "",
    });
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const hue = ((user?.fullName?.charCodeAt(0) || 65) * 13) % 360;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fb",
          fontFamily: "Lato, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563EB",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#9ca3af" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8f9fb",
        fontFamily: "Lato, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { margin: 0 !important; padding: 0 !important; }
        /* Hide public navbar on this page */
        body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
        aside a:hover { color: #aaa !important; background: #111 !important; }
        input:focus, select:focus { border-color: #2563EB !important; background: white !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

        /* ── Responsive ── */
        .desktop-sidebar { display: flex !important; }
        .mobile-topbar-menu-btn { display: none !important; }
        .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .form-grid { grid-template-columns: 1fr 1fr !important; }
        .pw-grid { grid-template-columns: 1fr 1fr !important; }
        .mobile-bottom-nav { display: none !important; }
        .main-padding { padding: 32px !important; }
        .page-title { font-size: 34px !important; }
        .topbar-padding { padding: 18px 32px !important; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar-menu-btn { display: flex !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .pw-grid { grid-template-columns: 1fr !important; }
          .pw-full { grid-column: 1 !important; }
          .mobile-bottom-nav { display: flex !important; }
          .main-padding { padding: 20px 16px 100px !important; }
          .page-title { font-size: 26px !important; }
          .topbar-padding { padding: 14px 16px !important; }
          .profile-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .profile-actions { width: 100% !important; }
          .profile-actions button { flex: 1 !important; justify-content: center !important; }
          .pw-submit { width: 100% !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
        <Sidebar onLogout={logout} />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={logout}
      />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          isolation: "isolate",
        }}
      >
        {/* Top bar */}
        <div
          className="topbar-padding"
          style={{
            background: "white",
            borderBottom: "1px solid #e8edf3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Mobile menu button */}
            <button
              className="mobile-topbar-menu-btn"
              onClick={() => setDrawerOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#111",
                padding: "2px",
                alignItems: "center",
              }}
            >
              <Icons.Menu />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#9ca3af",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#111", fontWeight: "600" }}>
                Dashboard
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: `hsl(${hue}, 60%, 18%)`,
                color: `hsl(${hue}, 60%, 72%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "800",
                fontFamily: "'Playfair Display', serif",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || "Student"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#111",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "160px",
                }}
              >
                {user?.fullName}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "160px",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="main-padding" style={{ flex: 1 }}>
          {/* Greeting */}
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2563EB",
                marginBottom: "8px",
              }}
            >
              Student Portal
            </p>
            <h1
              className="page-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: "900",
                color: "#0a0a0a",
                lineHeight: 1.15,
              }}
            >
              Welcome back, {user?.fullName?.split(" ")[0]}.
            </h1>
            <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "15px" }}>
              Manage your profile, assignments, grades, and class timetable.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "14px",
              }}
            >
              <a
                href="/student/assignments"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#2563EB",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "800",
                  textDecoration: "none",
                }}
              >
                <Icons.BookOpen />
                Assignments & Grades
              </a>
              <a
                href="/student/results"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#16a34a",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "800",
                  textDecoration: "none",
                }}
              >
                <Icons.BookMark />
                View Results
              </a>
              <a
                href="/student/timetable"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#111827",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "800",
                  textDecoration: "none",
                }}
              >
                <Icons.Clock />
                Class Timetable
              </a>
            </div>
          </div>

          {/* Status cards */}
          <div
            className="stats-grid"
            style={{ display: "grid", gap: "14px", marginBottom: "24px" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "18px 20px",
                border: `1px solid ${user?.isVerified ? "#bbf7d0" : "#fde68a"}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  flexShrink: 0,
                  background: user?.isVerified ? "#f0fdf4" : "#fffbeb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: user?.isVerified ? "#16a34a" : "#d97706",
                }}
              >
                {user?.isVerified ? (
                  <Icons.CheckCircle />
                ) : (
                  <Icons.AlertCircle />
                )}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  Email Status
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: user?.isVerified ? "#16a34a" : "#d97706",
                  }}
                >
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "18px 20px",
                border: "1px solid #e8edf3",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563EB",
                  flexShrink: 0,
                }}
              >
                <Icons.BookMark />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  Class
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#0a0a0a",
                  }}
                >
                  {user?.studentClass || "Not set"}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "18px 20px",
                border: "1px solid #e8edf3",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#ecfdf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16a34a",
                  flexShrink: 0,
                }}
              >
                <Icons.BookMark />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  Student ID
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#0a0a0a",
                  }}
                >
                  {user?.admissionNumber || "Not assigned"}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "18px 20px",
                border: "1px solid #e8edf3",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#f5f3ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9333ea",
                  flexShrink: 0,
                }}
              >
                <Icons.Phone />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  Phone
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#0a0a0a",
                  }}
                >
                  {user?.phoneNumber || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile card */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              border: "1px solid #e8edf3",
              padding: "24px",
              marginBottom: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="profile-header-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                paddingBottom: "20px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `hsl(${hue}, 60%, 18%)`,
                    color: `hsl(${hue}, 60%, 72%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "900",
                    fontFamily: "'Playfair Display', serif",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {form.avatar || user?.avatar ? (
                    <img
                      src={form.avatar || user.avatar}
                      alt={user?.fullName || "Student"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px",
                      fontWeight: "900",
                      color: "#0a0a0a",
                    }}
                  >
                    My Profile
                  </h2>
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      marginTop: "2px",
                    }}
                  >
                    {editing
                      ? "Edit your details below"
                      : "View and manage your information"}
                  </p>
                </div>
              </div>
              <div
                className="profile-actions"
                style={{ display: "flex", gap: "10px" }}
              >
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#eff6ff",
                      color: "#2563EB",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontFamily: "Lato, sans-serif",
                      width: "100%",
                    }}
                  >
                    <Icons.Edit />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        padding: "10px 16px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#f3f4f6",
                        color: "#6b7280",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontFamily: "Lato, sans-serif",
                        flex: 1,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1,
                        fontFamily: "Lato, sans-serif",
                        flex: 1,
                      }}
                    >
                      <Icons.Save />
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="form-grid" style={{ display: "grid", gap: "14px" }}>
              <Field label="Passport Photo" icon={Icons.User}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: editing ? "#f9fafb" : "#f3f4f6",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "14px",
                      background: `hsl(${hue}, 60%, 18%)`,
                      color: `hsl(${hue}, 60%, 72%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {form.avatar || user?.avatar ? (
                      <img
                        src={form.avatar || user.avatar}
                        alt={user?.fullName || "Student"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: "#111",
                        marginBottom: "4px",
                      }}
                    >
                      {form.avatar || user?.avatar
                        ? "Passport uploaded"
                        : "No passport uploaded"}
                    </p>
                    {editing && (
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: uploadingAvatar ? "#e5e7eb" : "#eff6ff",
                          color: "#2563EB",
                          fontSize: "12px",
                          fontWeight: "800",
                          cursor: uploadingAvatar ? "not-allowed" : "pointer",
                        }}
                      >
                        {uploadingAvatar ? "Uploading..." : "Upload passport"}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingAvatar}
                          onChange={(e) => uploadPassport(e.target.files?.[0])}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </Field>
              <Field label="Full Name" icon={Icons.User}>
                <input
                  style={editing ? inputStyle : disabledInputStyle}
                  disabled={!editing}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                />
              </Field>
              <Field label="Email Address" icon={Icons.Mail}>
                <input
                  style={disabledInputStyle}
                  disabled
                  value={user?.email || ""}
                />
              </Field>
              <Field label="Phone Number" icon={Icons.Phone}>
                <input
                  style={editing ? inputStyle : disabledInputStyle}
                  disabled={!editing}
                  placeholder="e.g. 08012345678"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                />
              </Field>
              <Field label="Student ID" icon={Icons.BookMark}>
                <input
                  style={disabledInputStyle}
                  disabled
                  value={user?.admissionNumber || "Not assigned"}
                />
              </Field>
              <Field label="Class" icon={Icons.BookMark}>
                {editing ? (
                  <select
                    style={{ ...inputStyle, appearance: "none" }}
                    value={form.studentClass}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, studentClass: e.target.value }))
                    }
                  >
                    <option value="">Select class...</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    style={disabledInputStyle}
                    disabled
                    value={user?.studentClass || "Not set"}
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Change Password card */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              border: "1px solid #e8edf3",
              padding: "24px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: changingPassword ? "24px" : "0",
                paddingBottom: changingPassword ? "20px" : "0",
                borderBottom: changingPassword ? "1px solid #f1f5f9" : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626",
                    flexShrink: 0,
                  }}
                >
                  <Icons.Lock />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#0a0a0a",
                    }}
                  >
                    Change Password
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      marginTop: "2px",
                    }}
                  >
                    Update your account password
                  </p>
                </div>
              </div>
              {!changingPassword ? (
                <button
                  onClick={() => setChangingPassword(true)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "Lato, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  Change
                </button>
              ) : (
                <button
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            {changingPassword && (
              <div className="pw-grid" style={{ display: "grid", gap: "14px" }}>
                <div className="pw-full" style={{ gridColumn: "1 / -1" }}>
                  <Field label="Current Password" icon={Icons.Lock}>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        style={{ ...inputStyle, paddingRight: "44px" }}
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => setShowCurrentPw((p) => !p)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9ca3af",
                          padding: 0,
                        }}
                      >
                        {showCurrentPw ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </Field>
                </div>
                <Field label="New Password" icon={Icons.Lock}>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPw ? "text" : "password"}
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      placeholder="Min. 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => setShowNewPw((p) => !p)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                        padding: 0,
                      }}
                    >
                      {showNewPw ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm New Password" icon={Icons.Lock}>
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </Field>
                <div
                  className="pw-full"
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="pw-submit"
                    onClick={changePassword}
                    disabled={saving}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#dc2626",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.7 : 1,
                      fontFamily: "Lato, sans-serif",
                    }}
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom navigation */}
        <nav
          className="mobile-bottom-nav"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "white",
            borderTop: "1px solid #e8edf3",
            zIndex: 30,
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px 0 max(10px, env(safe-area-inset-bottom))",
          }}
        >
          {[
            { label: "Home", icon: Icons.Grid, href: "/student", active: true },
            {
              label: "Work",
              icon: Icons.BookOpen,
              href: "/student/assignments",
            },
            {
              label: "Results",
              icon: Icons.BookMark,
              href: "/student/results",
            },
            {
              label: "Timetable",
              icon: Icons.Clock,
              href: "/student/timetable",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: item.active ? "#2563EB" : "#9ca3af",
                fontSize: "10px",
                fontWeight: item.active ? "700" : "500",
                padding: "0 12px",
              }}
            >
              <item.icon />
              {item.label}
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}
