"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TABS = [
  { id: "general",       label: "General",    icon: "ti-building-school" },
  { id: "security",      label: "Security",   icon: "ti-shield-lock"    },
  { id: "notifications", label: "Alerts",     icon: "ti-bell"           },
  { id: "appearance",    label: "Appearance", icon: "ti-palette"        },
  { id: "danger",        label: "Danger",     icon: "ti-alert-triangle" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab]         = useState("general");
  const [saving, setSaving]               = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const [settings, setSettings] = useState({
    schoolName: "Greenfield Academy",
    supportEmail: "support@greenfield.edu",
    schoolWebsite: "https://greenfield.edu",
    timezone: "Africa/Lagos",
    language: "en",
    academicYear: "2025/2026",
    allowRegistration: true,
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireEmailVerification: true,
    twoFactorAuth: false,
    passwordMinLength: 8,
    emailNotifications: true,
    smsNotifications: false,
    notifyOnNewStudent: true,
    notifyOnLogin: false,
    notifyOnSystemErrors: true,
    digestFrequency: "daily",
    primaryColor: "#2563eb",
    logoUrl: "",
    darkMode: false,
    compactView: false,
    showWelcomeMessage: true,
    welcomeMessage: "Welcome back to Greenfield Academy Portal.",
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res  = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) setSettings(s => ({ ...s, ...data.settings }));
    } catch {}
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const res  = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) toast.success("Settings saved");
      else toast.error(data.message || "Failed to save");
    } catch { toast.error("Failed to save settings"); }
    finally  { setSaving(false); }
  };

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className="root">
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header className="page-header">
        <div className="header-inner">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="page-title">System Settings</h1>
          </div>
          <span className={`sys-badge ${settings.maintenanceMode ? "badge-warn" : "badge-ok"}`}>
            <span className={`dot ${settings.maintenanceMode ? "dot-warn" : "dot-ok"}`} />
            {settings.maintenanceMode ? "Maintenance" : "Online"}
          </span>
        </div>

        <nav className="desktop-tabs" aria-label="Settings sections">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`dtab ${activeTab === t.id ? "dtab-active" : ""} ${t.id === "danger" ? "dtab-danger" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <i className={`ti ${t.icon}`} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── CONTENT ── */}
      <main className="content-area">
        <div className="content-card">

          {/* GENERAL */}
          {activeTab === "general" && <>
            <SectionTitle>School Information</SectionTitle>
            <div className="grid-2">
              <Field label="School Name">
                <input type="text" value={settings.schoolName} onChange={e => set("schoolName", e.target.value)} />
              </Field>
              <Field label="Academic Year">
                <input type="text" value={settings.academicYear} onChange={e => set("academicYear", e.target.value)} />
              </Field>
            </div>
            <div className="grid-2">
              <Field label="Support Email">
                <input type="email" value={settings.supportEmail} onChange={e => set("supportEmail", e.target.value)} />
              </Field>
              <Field label="School Website">
                <input type="url" value={settings.schoolWebsite} onChange={e => set("schoolWebsite", e.target.value)} />
              </Field>
            </div>
            <SectionTitle>Localization</SectionTitle>
            <div className="grid-2">
              <Field label="Timezone">
                <select value={settings.timezone} onChange={e => set("timezone", e.target.value)}>
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Africa/Accra">Africa/Accra (GMT)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  <option value="Europe/London">Europe/London (BST)</option>
                  <option value="America/New_York">America/New_York (EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PDT)</option>
                </select>
              </Field>
              <Field label="Language">
                <select value={settings.language} onChange={e => set("language", e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                </select>
              </Field>
            </div>
          </>}

          {/* SECURITY */}
          {activeTab === "security" && <>
            <SectionTitle>Access Control</SectionTitle>
            <Toggle title="Allow Student Registration" desc="Enable or disable new student self-registration."
              checked={settings.allowRegistration} onChange={v => set("allowRegistration", v)} />
            <Toggle title="Require Email Verification" desc="New accounts must verify email before accessing the portal."
              checked={settings.requireEmailVerification} onChange={v => set("requireEmailVerification", v)} />
            <Toggle title="Two-Factor Authentication" desc="Require admin accounts to use 2FA for all logins."
              checked={settings.twoFactorAuth} onChange={v => set("twoFactorAuth", v)} />
            <Toggle
              title={<>Maintenance Mode {settings.maintenanceMode && <span className="inline-badge badge-warn">Active</span>}</>}
              desc="Temporarily restricts portal access to admins only."
              checked={settings.maintenanceMode}
              onChange={v => set("maintenanceMode", v)}
              warn={settings.maintenanceMode}
            />
            <SectionTitle>Login Policy</SectionTitle>
            <div className="grid-2">
              <Field label="Max Login Attempts" hint="Account locked after this many failures.">
                <input type="number" min={1} max={20} value={settings.maxLoginAttempts}
                  onChange={e => set("maxLoginAttempts", Number(e.target.value))} />
              </Field>
              <Field label="Session Timeout (min)" hint="Inactive users are logged out automatically.">
                <input type="number" min={5} max={1440} value={settings.sessionTimeout}
                  onChange={e => set("sessionTimeout", Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Minimum Password Length">
              <input type="number" min={6} max={32} value={settings.passwordMinLength}
                onChange={e => set("passwordMinLength", Number(e.target.value))}
                style={{ maxWidth: 180 }} />
            </Field>
          </>}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && <>
            <SectionTitle>Delivery Channels</SectionTitle>
            <Toggle title="Email Notifications" desc="Send system alerts and updates via email."
              checked={settings.emailNotifications} onChange={v => set("emailNotifications", v)} />
            <Toggle title="SMS Notifications" desc="Send critical alerts via SMS (requires SMS provider)."
              checked={settings.smsNotifications} onChange={v => set("smsNotifications", v)} />
            <SectionTitle>Notification Triggers</SectionTitle>
            <Toggle title="New Student Registration" desc="Notify admins when a new student registers."
              checked={settings.notifyOnNewStudent} onChange={v => set("notifyOnNewStudent", v)} />
            <Toggle title="Admin Login Alerts" desc="Get notified on every admin login."
              checked={settings.notifyOnLogin} onChange={v => set("notifyOnLogin", v)} />
            <Toggle title="System Error Alerts" desc="Receive immediate alerts for critical system errors."
              checked={settings.notifyOnSystemErrors} onChange={v => set("notifyOnSystemErrors", v)} />
            <SectionTitle>Digest</SectionTitle>
            <Field label="Summary Digest Frequency">
              <select value={settings.digestFrequency} onChange={e => set("digestFrequency", e.target.value)}
                style={{ maxWidth: 260 }}>
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </Field>
          </>}

          {/* APPEARANCE */}
          {activeTab === "appearance" && <>
            <SectionTitle>Branding</SectionTitle>
            <Field label="Logo URL" hint="Displayed in the portal header and login screen.">
              <input type="url" value={settings.logoUrl}
                placeholder="https://yourschool.edu/logo.png"
                onChange={e => set("logoUrl", e.target.value)} />
            </Field>
            <Field label="Primary Accent Color" hint="Used for buttons, links, and interactive elements.">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={settings.primaryColor}
                  onChange={e => set("primaryColor", e.target.value)}
                  style={{ width: 44, height: 40, padding: 3, borderRadius: 8,
                    border: "1.5px solid #e2e8f0", cursor: "pointer", flexShrink: 0 }} />
                <input type="text" value={settings.primaryColor}
                  onChange={e => set("primaryColor", e.target.value)}
                  style={{ maxWidth: 140, fontFamily: "monospace", fontSize: 13 }} />
              </div>
            </Field>
            <SectionTitle>Welcome Banner</SectionTitle>
            <Toggle title="Show Welcome Banner" desc="Display a welcome message on the student dashboard."
              checked={settings.showWelcomeMessage} onChange={v => set("showWelcomeMessage", v)} />
            {settings.showWelcomeMessage && (
              <Field label="Welcome Message Text">
                <textarea value={settings.welcomeMessage} rows={3}
                  onChange={e => set("welcomeMessage", e.target.value)}
                  style={{ resize: "vertical" }} />
              </Field>
            )}
            <SectionTitle>Display</SectionTitle>
            <Toggle title="Dark Mode" desc="Enable dark theme for the admin portal."
              checked={settings.darkMode} onChange={v => set("darkMode", v)} />
            <Toggle title="Compact View" desc="Reduce spacing for a denser information layout."
              checked={settings.compactView} onChange={v => set("compactView", v)} />
          </>}

          {/* DANGER ZONE */}
          {activeTab === "danger" && <>
            <SectionTitle danger>Irreversible Actions</SectionTitle>

            <div className="danger-card">
              <div className="danger-card-icon"><i className="ti ti-logout" aria-hidden="true" /></div>
              <div className="danger-card-body">
                <h4>Clear All Sessions</h4>
                <p>Force logout all active users across the portal.</p>
                <button className="btn-danger">Clear Sessions</button>
              </div>
            </div>

            <div className="danger-card">
              <div className="danger-card-icon" style={{ color: "#1d4ed8", background: "#eff6ff" }}>
                <i className="ti ti-download" aria-hidden="true" />
              </div>
              <div className="danger-card-body">
                <h4>Export Data Archive</h4>
                <p>Download a full backup of students, grades, and settings.</p>
                <button className="btn-danger" style={{ borderColor: "#93c5fd", color: "#1d4ed8" }}>Export Archive</button>
              </div>
            </div>

            <div className="danger-card">
              <div className="danger-card-icon"><i className="ti ti-refresh" aria-hidden="true" /></div>
              <div className="danger-card-body">
                <h4>Reset to Defaults</h4>
                <p>Revert all settings to factory defaults. School data is unaffected.</p>
                <button className="btn-danger">Reset Settings</button>
              </div>
            </div>

            <div className="danger-card danger-card-critical">
              <div className="danger-card-icon danger-icon-critical"><i className="ti ti-trash" aria-hidden="true" /></div>
              <div className="danger-card-body">
                <h4 style={{ color: "#dc2626" }}>Delete Portal</h4>
                <p>
                  Permanently deletes this portal and <strong>all data</strong>. Irreversible.{" "}
                  Type <code>DELETE</code> to confirm.
                </p>
                <input
                  type="text"
                  className="delete-confirm-input"
                  placeholder='Type "DELETE" to confirm'
                  value={confirmDelete}
                  onChange={e => setConfirmDelete(e.target.value)}
                  style={{ borderColor: confirmDelete === "DELETE" ? "#ef4444" : undefined }}
                />
                <button
                  className="btn-danger btn-danger-critical"
                  disabled={confirmDelete !== "DELETE"}
                  style={{ opacity: confirmDelete === "DELETE" ? 1 : 0.4 }}
                >
                  <i className="ti ti-trash" style={{ marginRight: 6 }} aria-hidden="true" />
                  Permanently Delete
                </button>
              </div>
            </div>
          </>}

          {/* SAVE BAR */}
          {activeTab !== "danger" && (
            <div className="save-bar">
              <p className="save-hint">
                <i className="ti ti-info-circle" aria-hidden="true" />
                Changes apply after saving.
              </p>
              <button className="btn-primary" onClick={saveSettings} disabled={saving}>
                {saving
                  ? <><i className="ti ti-loader-2 spin" aria-hidden="true" /> Saving…</>
                  : <><i className="ti ti-device-floppy" aria-hidden="true" /> Save Changes</>
                }
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="mobile-tabbar" aria-label="Settings sections">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`mtab ${activeTab === t.id ? "mtab-active" : ""} ${t.id === "danger" ? "mtab-danger" : ""}`}
            onClick={() => setActiveTab(t.id)}
            aria-label={t.label}
          >
            <i className={`ti ${t.icon}`} aria-hidden="true" />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function SectionTitle({ children, danger }) {
  return (
    <p className="section-title" style={danger ? { color: "#ef4444", borderColor: "#fecaca" } : {}}>
      {children}
    </p>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function Toggle({ title, desc, checked, onChange, warn }) {
  return (
    <div className={`toggle-row ${warn ? "toggle-warn" : ""}`}>
      <div className="toggle-info">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="slider" />
      </label>
    </div>
  );
}

/* ── STYLES ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/tabler-icons.min.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.root {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: #fff;
  border-bottom: 1.5px solid #e2e8f0;
  padding: 20px 24px 0;
  position: sticky;
  top: 0;
  z-index: 20;
}
.header-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.eyebrow {
  font-size: 11px; font-weight: 700; color: #2563eb;
  text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 4px;
}
.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(22px, 5vw, 32px);
  font-weight: 400; color: #0f172a; line-height: 1.2;
}
.sys-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  flex-shrink: 0; margin-top: 4px;
}
.badge-ok   { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }
.dot { width: 7px; height: 7px; border-radius: 50%; }
.dot-ok   { background: #22c55e; }
.dot-warn { background: #f59e0b; }

.desktop-tabs {
  display: flex; gap: 2px;
  overflow-x: auto; scrollbar-width: none;
}
.desktop-tabs::-webkit-scrollbar { display: none; }
.dtab {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 14px; border: none; background: transparent;
  border-bottom: 2.5px solid transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  color: #64748b; cursor: pointer; white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1.5px;
}
.dtab:hover { color: #1e293b; }
.dtab-active { color: #2563eb; border-bottom-color: #2563eb; }
.dtab-danger:hover { color: #dc2626; }
.dtab-danger.dtab-active { color: #dc2626; border-bottom-color: #dc2626; }

.content-area {
  flex: 1; padding: 24px 16px 96px;
  max-width: 860px; width: 100%; margin: 0 auto;
}
.content-card {
  background: #fff; border-radius: 20px;
  border: 1.5px solid #e2e8f0; overflow: hidden;
}

.field { margin-bottom: 20px; padding: 0 24px; }
.field label {
  display: block; font-size: 13px; font-weight: 600;
  color: #374151; margin-bottom: 7px; letter-spacing: 0.02em;
}
.field small { display: block; font-size: 12px; color: #94a3b8; margin-top: 5px; }

input[type="text"],
input[type="email"],
input[type="url"],
input[type="number"],
input[type="password"],
select,
textarea {
  width: 100%; padding: 11px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 11px;
  font-size: 14px; color: #1e293b; background: #fff;
  font-family: inherit; outline: none; -webkit-appearance: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
input:focus, select:focus, textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

.grid-2 {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0 16px; padding: 0 24px; margin-bottom: 0;
}
.grid-2 .field { padding: 0; }

.section-title {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 24px 24px 10px;
  border-bottom: 1px solid #f1f5f9; margin-bottom: 16px;
}

.toggle-row {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; padding: 14px 20px;
  margin: 0 24px 10px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 13px; transition: border-color 0.15s;
}
.toggle-row:hover { border-color: #cbd5e1; }
.toggle-warn { border-color: #fde68a !important; background: #fffbeb; }
.toggle-info h4 { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 3px; }
.toggle-info p  { font-size: 12.5px; color: #94a3b8; line-height: 1.4; }

.switch { position: relative; display: inline-block; width: 46px; height: 26px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; border-radius: 26px; transition: 0.2s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.25); }
input:checked + .slider { background: #2563eb; }
input:checked + .slider:before { transform: translateX(20px); }

.inline-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase;
  margin-left: 8px; vertical-align: middle;
}

.danger-card {
  display: flex; gap: 14px;
  margin: 0 24px 14px; padding: 18px;
  background: #fff; border: 1.5px solid #fecaca; border-radius: 14px;
}
.danger-card-critical { border-color: #ef4444; background: #fff5f5; }
.danger-card-icon {
  width: 40px; height: 40px; background: #fee2e2; color: #dc2626;
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.danger-icon-critical { background: #fecaca; }
.danger-card-body { flex: 1; min-width: 0; }
.danger-card-body h4 { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.danger-card-body p  { font-size: 13px; color: #64748b; margin-bottom: 12px; line-height: 1.5; }
.danger-card-body code {
  background: #fee2e2; padding: 1px 6px;
  border-radius: 4px; font-size: 12px; color: #dc2626;
}
.delete-confirm-input { width: 100% !important; max-width: 260px; margin-bottom: 10px !important; }

.btn-danger {
  display: inline-flex; align-items: center;
  background: #fff; color: #dc2626; border: 1.5px solid #fca5a5;
  padding: 9px 16px; border-radius: 10px;
  font-size: 13px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-danger:hover { background: #fef2f2; border-color: #f87171; }
.btn-danger:disabled { cursor: not-allowed; }
.btn-danger-critical { width: 100%; max-width: 220px; justify-content: center; }

.save-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 16px 24px; background: #fff; border-top: 1.5px solid #e2e8f0;
  position: sticky; bottom: 0;
}
.save-hint { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94a3b8; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #2563eb; color: white; border: none;
  padding: 11px 22px; border-radius: 11px;
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-primary:hover  { background: #1d4ed8; }
.btn-primary:active { transform: scale(0.97); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.mobile-tabbar {
  display: none;
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(255,255,255,0.96);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-top: 1px solid #e2e8f0;
  padding: 6px 4px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
  z-index: 30; justify-content: space-around;
}
.mtab {
  display: flex; flex-direction: column; align-items: center;
  gap: 3px; padding: 6px 10px; border: none; background: transparent;
  font-family: inherit; font-size: 10px; font-weight: 600;
  color: #94a3b8; cursor: pointer; border-radius: 10px;
  transition: color 0.15s, background 0.15s;
  min-width: 52px; -webkit-tap-highlight-color: transparent;
}
.mtab i { font-size: 22px; }
.mtab:hover { color: #475569; }
.mtab-active { color: #2563eb; }
.mtab-danger.mtab-active { color: #dc2626; }

@media (max-width: 768px) {
  .page-header { padding: 16px 16px 0; }
  .header-inner { margin-bottom: 12px; }
  .desktop-tabs { display: none; }
  .mobile-tabbar { display: flex; }

  .content-area { padding: 16px 12px 90px; }
  .content-card { border-radius: 16px; }

  .grid-2 { grid-template-columns: 1fr; padding: 0 16px; gap: 0; }
  .field { padding: 0 16px; }
  .section-title { padding: 20px 16px 10px; }

  .toggle-row { margin: 0 16px 10px; padding: 13px 14px; }

  .danger-card { margin: 0 16px 14px; flex-direction: column; }
  .danger-card-icon { width: 36px; height: 36px; font-size: 16px; }
  .delete-confirm-input { max-width: 100% !important; }
  .btn-danger-critical { max-width: 100%; }

  .save-bar { padding: 14px 16px; }
  .save-hint { display: none; }
  .btn-primary { width: 100%; justify-content: center; }
}

@media (max-width: 380px) {
  .mtab span { display: none; }
  .mtab { min-width: 44px; padding: 6px 8px; }
}

.spin { animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
`;