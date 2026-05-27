import React, { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ providers: 0, consumers: 0, recentCalls: 0, failureRate: '0%', avgLatency: '0ms' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [providers, consumers, logs] = await Promise.all([
        api.providers.list(),
        api.consumers.list(),
        api.logs({ limit: 100 }),
      ]);
      const enabled = providers.filter((p) => p.enabled).length;
      const failures = logs.filter((l) => l.status === 'error').length;
      const rate = logs.length > 0 ? ((failures / logs.length) * 100).toFixed(1) : '0';
      const latencies = logs.filter((l) => l.latency_ms).map((l) => l.latency_ms);
      const avg = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
      setStats({
        providers: enabled,
        consumers: consumers.length,
        recentCalls: logs.length,
        failureRate: `${rate}%`,
        avgLatency: `${avg}ms`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Enabled Providers</div>
          <div className="stat-value">{stats.providers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Consumers</div>
          <div className="stat-value">{stats.consumers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recent Calls</div>
          <div className="stat-value">{stats.recentCalls}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failure Rate</div>
          <div className="stat-value">{stats.failureRate}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Latency</div>
          <div className="stat-value">{stats.avgLatency}</div>
        </div>
      </div>
    </div>
  );
}
