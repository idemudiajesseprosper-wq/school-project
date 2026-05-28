"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: "",
    supportEmail: "",
    allowRegistration: true,
    maintenanceMode: false,
    maxLoginAttempts: 5,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px",
        fontFamily: "Lato, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');
      `}</style>

      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}
        >
          Administration
        </p>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "36px",
            fontWeight: "900",
            color: "#0f172a",
          }}
        >
          System Settings
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
            fontSize: "15px",
          }}
        >
          Configure portal security, registration and administration preferences.
        </p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "28px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          maxWidth: "850px",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>School Name</label>
          <input
            type="text"
            value={settings.schoolName}
            onChange={(e) =>
              setSettings({ ...settings, schoolName: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Support Email</label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({ ...settings, supportEmail: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Maximum Login Attempts</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxLoginAttempts: Number(e.target.value),
              })
            }
            style={inputStyle}
          />
        </div>

        <div style={toggleCard}>
          <div>
            <h3 style={toggleTitle}>Allow Student Registration</h3>
            <p style={toggleText}>
              Enable or disable new student registrations.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={(e) =>
              setSettings({
                ...settings,
                allowRegistration: e.target.checked,
              })
            }
          />
        </div>

        <div style={toggleCard}>
          <div>
            <h3 style={toggleTitle}>Maintenance Mode</h3>
            <p style={toggleText}>
              Temporarily restrict access to the platform.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings({
                ...settings,
                maintenanceMode: e.target.checked,
              })
            }
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            marginTop: "26px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            border: "none",
            padding: "14px 24px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(37,99,235,0.25)",
          }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0f172a",
  fontWeight: "700",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #dbe4ee",
  background: "#f8fafc",
  fontSize: "14px",
  outline: "none",
};

const toggleCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  marginBottom: "18px",
  background: "#fafcff",
};

const toggleTitle = {
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "700",
  marginBottom: "4px",
};

const toggleText = {
  color: "#64748b",
  fontSize: "13px",
};