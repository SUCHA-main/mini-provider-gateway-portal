import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'providers', label: 'Providers' },
  { key: 'consumers', label: 'Consumers' },
  { key: 'logs', label: 'Logs' },
  { key: 'integration', label: 'Integration' },
];

export default function Layout({ page, setPage, health, token, saveToken, children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">MPG Portal</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: 6 }}>
            <span className={`health-badge ${health ? 'ok' : 'err'}`} />
            {health ? 'Backend OK' : 'Backend Down'}
          </div>
          <input
            className="token-input"
            type="password"
            placeholder="Admin Token"
            value={token}
            onChange={(e) => saveToken(e.target.value)}
          />
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
