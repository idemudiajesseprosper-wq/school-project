"use client";

import { useEffect, useState } from "react";

const ActivityIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <path
      d="M3 12h4l3-8 4 16 3-8h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();

      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <p
          style={{
            color: "#2563eb",
            fontWeight: "700",
            letterSpacing: "0.15em",
            fontSize: "11px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Administration
        </p>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          Activity Monitor
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          Real-time login activity and security events.
        </p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "24px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        {loading ? (
          <p>Loading activity...</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {activities.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  paddingBottom: "18px",
                  borderBottom:
                    index !== activities.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "14px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ActivityIcon />
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {item.fullName}
                  </h3>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "5px",
                    }}
                  >
                    Logged in from {item.device}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "#f3f4f6",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        color: "#374151",
                        fontWeight: "600",
                      }}
                    >
                      {item.ip}
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(item.time).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  color: "#9ca3af",
                }}
              >
                No recent activity.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}