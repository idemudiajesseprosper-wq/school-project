"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ─── Icons (inline SVG to avoid extra deps) ─────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Unlock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Activity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: Icons.Grid, href: "/admin" },
    { label: "Students", icon: Icons.Users, href: "/admin/students", active: true },
    { label: "Activity", icon: Icons.Activity, href: "/admin/activity" },
    { label: "Settings", icon: Icons.Settings, href: "/admin/settings" },
  ];

  return (
    <aside style={{
      width: "240px",
      minWidth: "240px",
      background: "#0a0a0a",
      borderRight: "1px solid #1a1a1a",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "900", color: "white",
            fontFamily: "'Playfair Display', serif",
          }}>W</div>
          <div>
            <p style={{ color: "white", fontWeight: "700", fontSize: "13px", lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>
              Winners' Foundation
            </p>
            <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p style={{ color: "#333", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 12px 12px" }}>
          Management
        </p>
        {navItems.map((item) => (
          <a key={item.label} href={item.href} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "11px 12px", borderRadius: "10px", marginBottom: "2px",
            color: item.active ? "white" : "#555",
            background: item.active ? "#1a1a1a" : "transparent",
            textDecoration: "none", fontSize: "14px", fontWeight: item.active ? "600" : "400",
            transition: "all 0.15s",
            borderLeft: item.active ? "3px solid #2563EB" : "3px solid transparent",
          }}>
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

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
        <a href="/admin/logout" style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "11px 12px", borderRadius: "10px",
          color: "#555", textDecoration: "none", fontSize: "14px",
          transition: "all 0.15s",
        }}>
          <Icons.LogOut />
          Sign Out
        </a>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { filterStudents(); }, [search, students, filterStatus]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setStudents(data.students);
      else toast.error(data.message);
    } catch { toast.error("Failed to load students"); }
    setLoading(false);
  };

  const filterStudents = () => {
    let data = [...students];
    if (search) {
      data = data.filter(s =>
        s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus === "online") data = data.filter(s => s.isOnline);
    if (filterStatus === "suspended") data = data.filter(s => s.isSuspended);
    if (filterStatus === "verified") data = data.filter(s => s.isVerified);
    setFiltered(data);
  };

  const toggleSuspend = async (studentId, suspended) => {
    try {
      setActionLoading(studentId);
      const res = await fetch(`/api/admin/students/${studentId}/suspend`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(suspended ? "Student unsuspended" : "Student suspended");
        setStudents(prev => prev.map(s => s._id === studentId ? { ...s, isSuspended: !s.isSuspended } : s));
      } else toast.error(data.message);
    } catch { toast.error("Action failed"); }
    finally { setActionLoading(""); }
  };

  const deleteStudent = async (studentId) => {
    if (!confirm("Delete this student permanently?")) return;
    try {
      setActionLoading(studentId);
      const res = await fetch(`/api/admin/students/${studentId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Student deleted successfully");
        setStudents(prev => prev.filter(s => s._id !== studentId));
      } else toast.error(data.message);
    } catch { toast.error("Delete failed"); }
    finally { setActionLoading(""); }
  };

  const stats = [
    { label: "Total Students", value: students.length, color: "#2563EB", bg: "#eff6ff" },
    { label: "Online Now", value: students.filter(s => s.isOnline).length, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Verified", value: students.filter(s => s.isVerified).length, color: "#9333ea", bg: "#faf5ff" },
    { label: "Suspended", value: students.filter(s => s.isSuspended).length, color: "#dc2626", bg: "#fef2f2" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb", fontFamily: "Lato, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0 !important; }
        .student-row:hover { background: #f1f5fd !important; }
        .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .action-btn { transition: all 0.15s ease; }
        .filter-chip:hover { background: #e8edf8 !important; }
        aside a:hover { color: #aaa !important; background: #111 !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>

        {/* Top bar */}
        <div style={{
          background: "white", borderBottom: "1px solid #e8edf3",
          padding: "18px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "13px" }}>
            <span>Admin</span>
            <Icons.ChevronRight />
            <span style={{ color: "#111", fontWeight: "600" }}>Student Management</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#2563EB", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "700",
            }}>A</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>Admin</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>Super Admin</p>
            </div>
          </div>
        </div>

        {/* Page body */}
        <div style={{ padding: "32px", flex: 1 }}>

          {/* Page title */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2563EB", marginBottom: "8px" }}>
              Administration
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "34px", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.15 }}>
              Student Management
            </h1>
            <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "15px" }}>
              Monitor, manage and control registered student accounts.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "white", borderRadius: "16px",
                padding: "20px 24px", border: "1px solid #e8edf3",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "14px",
                }}>
                  <span style={{ color: s.color, fontSize: "18px", fontWeight: "900" }}>
                    {s.value}
                  </span>
                </div>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search + filter bar */}
          <div style={{
            background: "white", borderRadius: "16px", border: "1px solid #e8edf3",
            padding: "16px 20px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {/* Search input */}
            <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px 11px 44px",
                  border: "1px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "14px", outline: "none", color: "#111",
                  background: "#f9fafb",
                }}
              />
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { key: "all", label: "All" },
                { key: "online", label: "Online" },
                { key: "verified", label: "Verified" },
                { key: "suspended", label: "Suspended" },
              ].map(f => (
                <button
                  key={f.key}
                  className="filter-chip"
                  onClick={() => setFilterStatus(f.key)}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
                    fontWeight: "600", border: "1px solid",
                    cursor: "pointer", transition: "all 0.15s",
                    borderColor: filterStatus === f.key ? "#2563EB" : "#e5e7eb",
                    background: filterStatus === f.key ? "#eff6ff" : "white",
                    color: filterStatus === f.key ? "#2563EB" : "#6b7280",
                  }}
                >{f.label}</button>
              ))}
            </div>

            <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "auto", whiteSpace: "nowrap" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #e8edf3", overflow: "hidden",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "#f8f9fb", borderBottom: "2px solid #e8edf3" }}>
                    {["Student", "Role", "Status", "Online", "Login Count", "Last Login", "Joined", "Actions"].map(h => (
                      <th key={h} style={{
                        padding: "14px 20px", textAlign: "left",
                        fontSize: "11px", fontWeight: "700", color: "#6b7280",
                        textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!loading && filtered.map((student, i) => (
                    <tr
                      key={student._id}
                      className="student-row"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: "white", transition: "background 0.15s",
                      }}
                    >
                      {/* Student */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: "42px", height: "42px", borderRadius: "12px",
                            background: `hsl(${(student.fullName?.charCodeAt(0) || 65) * 13 % 360}, 65%, 20%)`,
                            color: `hsl(${(student.fullName?.charCodeAt(0) || 65) * 13 % 360}, 65%, 75%)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "800", fontSize: "16px", flexShrink: 0,
                            fontFamily: "'Playfair Display', serif",
                          }}>
                            {student.fullName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: "700", color: "#0a0a0a", fontSize: "14px" }}>
                              {student.fullName}
                            </p>
                            <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "2px" }}>
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          fontSize: "12px", fontWeight: "700", color: "#374151",
                          background: "#f3f4f6", padding: "4px 10px", borderRadius: "6px",
                          textTransform: "capitalize",
                        }}>{student.role}</span>
                      </td>

                      {/* Verified / Suspension combined */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <StatusDot
                            on={student.isVerified}
                            onLabel="Verified" offLabel="Unverified"
                            onColor="#16a34a" offColor="#d97706"
                          />
                          {student.isSuspended && (
                            <StatusDot on={false} onLabel="" offLabel="Suspended" offColor="#dc2626" />
                          )}
                        </div>
                      </td>

                      {/* Online */}
                      <td style={{ padding: "16px 20px" }}>
                        <StatusDot
                          on={student.isOnline}
                          onLabel="Online" offLabel="Offline"
                          onColor="#16a34a" offColor="#9ca3af"
                        />
                      </td>

                      {/* Login Count */}
                      <td style={{ padding: "16px 20px", fontWeight: "700", color: "#111", fontSize: "15px" }}>
                        {student.loginCount || 0}
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: "16px 20px", color: "#6b7280", fontSize: "13px", whiteSpace: "nowrap" }}>
                        {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : (
                          <span style={{ color: "#d1d5db" }}>Never</span>
                        )}
                      </td>

                      {/* Joined */}
                      <td style={{ padding: "16px 20px", color: "#6b7280", fontSize: "13px", whiteSpace: "nowrap" }}>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <ActionBtn
                            onClick={() => window.location.href = `/admin/students/${student._id}`}
                            color="#111" label="View" icon={<Icons.Eye />}
                          />
                          <ActionBtn
                            onClick={() => toggleSuspend(student._id, student.isSuspended)}
                            disabled={actionLoading === student._id}
                            color={student.isSuspended ? "#16a34a" : "#d97706"}
                            label={actionLoading === student._id ? "…" : student.isSuspended ? "Unsuspend" : "Suspend"}
                            icon={student.isSuspended ? <Icons.Unlock /> : <Icons.Lock />}
                          />
                          <ActionBtn
                            onClick={() => deleteStudent(student._id)}
                            disabled={actionLoading === student._id}
                            color="#dc2626"
                            label={actionLoading === student._id ? "…" : "Delete"}
                            icon={<Icons.Trash />}
                            iconOnly
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: "80px 20px", textAlign: "center" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "20px",
                  background: "#f3f4f6", margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px",
                }}>🎓</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "900", color: "#111", marginBottom: "8px" }}>
                  No Students Found
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  {search ? "Try adjusting your search or filters." : "No students registered yet."}
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ padding: "80px 20px", textAlign: "center" }}>
                <div style={{
                  width: "44px", height: "44px",
                  border: "3px solid #e5e7eb", borderTopColor: "#2563EB",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#9ca3af", fontSize: "15px" }}>Loading students...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function StatusDot({ on, onLabel, offLabel, onColor, offColor }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: on ? onColor : offColor }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: on ? onColor : offColor, flexShrink: 0 }} />
      {on ? onLabel : offLabel}
    </span>
  );
}

function ActionBtn({ onClick, disabled, color, label, icon, iconOnly }) {
  return (
    <button
      className="action-btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: iconOnly ? "8px" : "8px 14px",
        borderRadius: "9px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: color + "18", color,
        fontSize: "12px", fontWeight: "700",
        opacity: disabled ? 0.5 : 1,
      }}
      title={label}
    >
      {icon}
      {!iconOnly && label}
    </button>
  );
}