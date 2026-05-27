import React, { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => { load(); }, [status]);

  async function load() {
    try {
      const params = { limit: 50 };
      if (status) params.status = status;
      setLogs(await api.logs(params));
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  }

  function toggleExpand(id) {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  }

  if (loading) return <div className="loading">Loading logs...</div>;

  return (
    <div>
      <div className="card-header">
        <h2>Call Logs</h2>
        <div>
          <select className="form-select" style={{ width: 140, display: 'inline-block' }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={load}>Refresh</button>
        </div>
      </div>

      {logs.length === 0 && <div className="empty">No logs found</div>}

      {logs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Consumer</th>
                <th>Provider</th>
                <th>Model</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Tokens</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <React.Fragment key={l.id}>
                  <tr style={{ cursor: l.error_message ? 'pointer' : 'default' }} onClick={() => l.error_message && toggleExpand(l.id)}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{l.request_id.slice(0, 8)}</td>
                    <td>{l.consumer_id || '-'}</td>
                    <td>{l.provider_id || '-'}</td>
                    <td>{l.model || '-'}</td>
                    <td><span className={`badge ${l.status === 'success' ? 'badge-success' : 'badge-error'}`}>{l.status}</span></td>
                    <td>{l.latency_ms ? `${l.latency_ms}ms` : '-'}</td>
                    <td>{l.total_tokens || '-'}</td>
                    <td style={{ fontSize: 12 }}>{l.created_at}</td>
                  </tr>
                  {expanded.has(l.id) && l.error_message && (
                    <tr>
                      <td colSpan="8"><div className="error-detail">{l.error_message}</div></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
