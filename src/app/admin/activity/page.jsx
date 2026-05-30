"use client";

import { useEffect, useState } from "react";

const EVENT_TYPES = {
  login:        { label: "Login",          icon: "ti-login",          bg: "#eff6ff", color: "#2563eb" },
  logout:       { label: "Logout",         icon: "ti-logout",         bg: "#f0fdf4", color: "#16a34a" },
  failed_login: { label: "Failed Login",   icon: "ti-shield-x",       bg: "#fef2f2", color: "#dc2626" },
  password:     { label: "Password Reset", icon: "ti-key",            bg: "#fefce8", color: "#ca8a04" },
  register:     { label: "Registration",   icon: "ti-user-plus",      bg: "#f5f3ff", color: "#7c3aed" },
  admin:        { label: "Admin Action",   icon: "ti-settings",       bg: "#fff7ed", color: "#ea580c" },
};

const ROLE_COLORS = {
  admin:   { bg: "#ede9fe", color: "#6d28d9" },
  student: { bg: "#dbeafe", color: "#1d4ed8" },
  teacher: { bg: "#dcfce7", color: "#15803d" },
  staff:   { bg: "#fef9c3", color: "#854d0e" },
};

const FILTERS = ["All", "Login", "Logout", "Failed Login", "Registration", "Admin Action"];

export default function ActivityPage() {
  const [activities, setActivities]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");
  const [sortDesc, setSortDesc]       = useState(true);
  const [page, setPage]               = useState(1);
  const [expandedId, setExpandedId]   = useState(null);
  const PER_PAGE = 8;

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res  = await fetch("/api/admin/activity");
      const data = await res.json();
      if (data.success) setActivities(data.activities);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  /* ── derived data ── */
  const filtered = activities
    .filter(a => {
      const matchSearch =
        !search ||
        a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        a.ip?.includes(search) ||
        a.device?.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "All" ||
        (EVENT_TYPES[a.type]?.label || "Login") === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) =>
      sortDesc
        ? new Date(b.time) - new Date(a.time)
        : new Date(a.time) - new Date(b.time)
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total:   activities.length,
    logins:  activities.filter(a => a.type === "login" || !a.type).length,
    failed:  activities.filter(a => a.type === "failed_login").length,
    unique:  new Set(activities.map(a => a.ip)).size,
  };

  const handleSearch = v => { setSearch(v); setPage(1); };
  const handleFilter = v => { setFilter(v); setPage(1); };

  /* ── helpers ── */
  const relativeTime = (iso) => {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="root">
      <style>{CSS}</style>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="header-top">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="page-title">Activity Monitor</h1>
            <p className="page-sub">Real-time login activity and security events.</p>
          </div>
          <button className="btn-refresh" onClick={fetchActivities} title="Refresh">
            <i className="ti ti-refresh" aria-hidden="true" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <i className="ti ti-activity stat-icon" style={{ color: "#2563eb" }} aria-hidden="true" />
            <div>
              <p className="stat-val">{stats.total}</p>
              <p className="stat-label">Total Events</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="ti ti-login stat-icon" style={{ color: "#16a34a" }} aria-hidden="true" />
            <div>
              <p className="stat-val">{stats.logins}</p>
              <p className="stat-label">Logins</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="ti ti-shield-x stat-icon" style={{ color: "#dc2626" }} aria-hidden="true" />
            <div>
              <p className="stat-val stat-danger">{stats.failed}</p>
              <p className="stat-label">Failed</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="ti ti-world stat-icon" style={{ color: "#7c3aed" }} aria-hidden="true" />
            <div>
              <p className="stat-val">{stats.unique}</p>
              <p className="stat-label">Unique IPs</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="search-wrap">
          <i className="ti ti-search search-icon" aria-hidden="true" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, IP, or device…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => handleSearch("")} aria-label="Clear search">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`chip ${filter === f ? "chip-active" : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          className="btn-sort"
          onClick={() => setSortDesc(d => !d)}
          title={sortDesc ? "Oldest first" : "Newest first"}
        >
          <i className={`ti ${sortDesc ? "ti-sort-descending" : "ti-sort-ascending"}`} aria-hidden="true" />
          <span>{sortDesc ? "Newest" : "Oldest"}</span>
        </button>
      </div>

      {/* ── ACTIVITY LIST ── */}
      <div className="list-card">
        {loading ? (
          <div className="empty-state">
            <i className="ti ti-loader-2 spin empty-icon" aria-hidden="true" />
            <p>Loading activity…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-inbox empty-icon" aria-hidden="true" />
            <p>No activity found.</p>
            {(search || filter !== "All") && (
              <button className="btn-clear-filters" onClick={() => { handleSearch(""); handleFilter("All"); }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {paginated.map((item, idx) => {
              const type   = EVENT_TYPES[item.type] || EVENT_TYPES.login;
              const role   = ROLE_COLORS[item.role] || ROLE_COLORS.student;
              const isOpen = expandedId === idx;

              return (
                <div
                  key={idx}
                  className={`activity-row ${isOpen ? "activity-row-open" : ""}`}
                  onClick={() => setExpandedId(isOpen ? null : idx)}
                >
                  {/* Left: icon */}
                  <div className="act-icon" style={{ background: type.bg, color: type.color }}>
                    <i className={`ti ${type.icon}`} aria-hidden="true" />
                  </div>

                  {/* Middle: info */}
                  <div className="act-body">
                    <div className="act-top">
                      <span className="act-name">{item.fullName || "Unknown User"}</span>
                      {item.role && (
                        <span className="role-badge" style={{ background: role.bg, color: role.color }}>
                          {item.role}
                        </span>
                      )}
                      <span className="event-badge" style={{ background: type.bg, color: type.color }}>
                        {type.label}
                      </span>
                    </div>
                    <p className="act-device">
                      <i className="ti ti-device-laptop" aria-hidden="true" style={{ marginRight: 4 }} />
                      {item.device || "Unknown device"}
                    </p>
                    <div className="act-meta">
                      <span className="ip-chip">
                        <i className="ti ti-network" aria-hidden="true" />
                        {item.ip || "—"}
                      </span>
                      <span className="act-time">
                        <i className="ti ti-clock" aria-hidden="true" />
                        {item.time ? relativeTime(item.time) : "—"}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="act-detail">
                        <div className="detail-row">
                          <span className="detail-key">Full timestamp</span>
                          <span className="detail-val">{item.time ? new Date(item.time).toLocaleString() : "—"}</span>
                        </div>
                        {item.email && (
                          <div className="detail-row">
                            <span className="detail-key">Email</span>
                            <span className="detail-val">{item.email}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="detail-row">
                            <span className="detail-key">Location</span>
                            <span className="detail-val">{item.location}</span>
                          </div>
                        )}
                        {item.browser && (
                          <div className="detail-row">
                            <span className="detail-key">Browser</span>
                            <span className="detail-val">{item.browser}</span>
                          </div>
                        )}
                        {item.type === "failed_login" && (
                          <div className="detail-row">
                            <span className="detail-key" style={{ color: "#dc2626" }}>Security note</span>
                            <span className="detail-val" style={{ color: "#dc2626" }}>Failed authentication attempt</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: chevron */}
                  <i className={`ti ti-chevron-down act-chevron ${isOpen ? "chevron-open" : ""}`} aria-hidden="true" />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── PAGINATION ── */}
      {!loading && filtered.length > PER_PAGE && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <i className="ti ti-chevron-left" aria-hidden="true" /> Prev
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next <i className="ti ti-chevron-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Serif+Display&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/tabler-icons.min.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.root {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'DM Sans', sans-serif;
  padding: 32px 24px 48px;
  max-width: 960px;
  margin: 0 auto;
}

/* ── HEADER ── */
.page-header {
  margin-bottom: 20px;
}
.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}
.eyebrow {
  font-size: 11px; font-weight: 700; color: #2563eb;
  text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 4px;
}
.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 400; color: #0f172a; line-height: 1.2;
}
.page-sub { font-size: 14px; color: #64748b; margin-top: 6px; }

.btn-refresh {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 10px;
  background: #fff; border: 1.5px solid #e2e8f0;
  font-family: inherit; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0; white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}
.btn-refresh:hover { background: #f8fafc; border-color: #cbd5e1; }
.btn-refresh i { font-size: 16px; }

/* ── STATS ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
}
.stat-icon { font-size: 22px; flex-shrink: 0; }
.stat-val  { font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1; }
.stat-danger { color: #dc2626; }
.stat-label { font-size: 12px; color: #94a3b8; margin-top: 3px; font-weight: 500; }

/* ── TOOLBAR ── */
.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; font-size: 16px; pointer-events: none;
}
.search-input {
  width: 100%; padding: 10px 36px 10px 38px;
  border: 1.5px solid #e2e8f0; border-radius: 11px;
  font-size: 14px; font-family: inherit; color: #1e293b;
  background: #fff; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
}
.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}
.search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer;
  font-size: 15px; display: flex; align-items: center;
  -webkit-tap-highlight-color: transparent;
}

.filter-chips {
  display: flex; gap: 6px; flex-wrap: wrap;
}
.chip {
  padding: 7px 13px; border-radius: 20px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-family: inherit; font-size: 12px; font-weight: 600; color: #64748b;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.chip:hover { background: #f8fafc; border-color: #cbd5e1; }
.chip-active { background: #eff6ff; border-color: #93c5fd; color: #2563eb; }

.btn-sort {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 14px; border-radius: 11px;
  background: #fff; border: 1.5px solid #e2e8f0;
  font-family: inherit; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s; flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.btn-sort:hover { background: #f8fafc; }

/* ── LIST ── */
.list-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 16px;
}

.activity-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.12s;
}
.activity-row:last-child { border-bottom: none; }
.activity-row:hover  { background: #f8fafc; }
.activity-row-open   { background: #f8fafc; }

.act-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; flex-shrink: 0; margin-top: 2px;
}

.act-body { flex: 1; min-width: 0; }
.act-top  {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-bottom: 4px;
}
.act-name { font-size: 14px; font-weight: 600; color: #1e293b; }

.role-badge, .event-badge {
  display: inline-flex; align-items: center;
  padding: 2px 9px; border-radius: 20px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
}

.act-device {
  font-size: 13px; color: #64748b; margin-bottom: 8px;
  display: flex; align-items: center;
}
.act-meta {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.ip-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: #f1f5f9; border-radius: 20px;
  padding: 3px 10px; font-size: 12px; font-weight: 600; color: #475569;
}
.ip-chip i { font-size: 13px; }
.act-time {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; color: #94a3b8;
}
.act-time i { font-size: 13px; }

.act-chevron {
  font-size: 16px; color: #cbd5e1; flex-shrink: 0;
  margin-top: 14px; transition: transform 0.2s;
}
.chevron-open { transform: rotate(180deg); }

/* Expanded detail */
.act-detail {
  margin-top: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  display: flex; flex-direction: column; gap: 8px;
}
.detail-row { display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; }
.detail-key  { font-size: 12px; font-weight: 600; color: #94a3b8; min-width: 110px; flex-shrink: 0; }
.detail-val  { font-size: 13px; color: #1e293b; }

/* ── EMPTY ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 60px 20px; color: #94a3b8; font-size: 14px;
}
.empty-icon { font-size: 40px; }
.btn-clear-filters {
  margin-top: 4px; padding: 7px 16px; border-radius: 8px;
  background: #eff6ff; border: none; color: #2563eb;
  font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
}

/* ── PAGINATION ── */
.pagination {
  display: flex; align-items: center; justify-content: center; gap: 16px;
}
.page-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 10px;
  background: #fff; border: 1.5px solid #e2e8f0;
  font-family: inherit; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.page-btn:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 13px; color: #64748b; font-weight: 500; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .root { padding: 20px 12px 48px; }

  .header-top { margin-bottom: 16px; }
  .btn-refresh span { display: none; }
  .btn-refresh { padding: 9px 12px; }

  .stats-row { grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card  { padding: 12px 14px; gap: 10px; }
  .stat-val   { font-size: 20px; }

  .toolbar { gap: 8px; }
  .filter-chips { width: 100%; overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none; padding-bottom: 2px; }
  .filter-chips::-webkit-scrollbar { display: none; }
  .btn-sort span { display: none; }
  .btn-sort { padding: 9px 12px; }

  .activity-row { padding: 14px 14px; gap: 12px; }
  .act-icon { width: 38px; height: 38px; font-size: 17px; }
  .act-chevron { margin-top: 10px; }

  .detail-key { min-width: 90px; }
}

@media (max-width: 400px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .stat-label { font-size: 11px; }
}

.spin { animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
`;