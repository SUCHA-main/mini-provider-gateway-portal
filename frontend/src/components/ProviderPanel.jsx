import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import TestProviderDialog from './TestProviderDialog.jsx';

const EMPTY = { name: '', type: 'openai_compatible', base_url: '', api_key: '', default_model: '', enabled: true, timeout_ms: 60000 };

export default function ProviderPanel() {
  const [providers, setProviders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setProviders(await api.providers.list()); } catch (e) { alert(e.message); } finally { setLoading(false); }
  }

  function openNew() { setForm(EMPTY); setEditing(null); setShowForm(true); }
  function openEdit(p) { setForm({ name: p.name, type: p.type, base_url: p.base_url, api_key: '', default_model: p.default_model || '', enabled: !!p.enabled, timeout_ms: p.timeout_ms || 60000 }); setEditing(p.id); setShowForm(true); }

  async function save() {
    try {
      const data = { ...form };
      if (!data.api_key) delete data.api_key;
      if (editing) {
        await api.providers.update(editing, data);
      } else {
        await api.providers.create(data);
      }
      setShowForm(false);
      load();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this provider?')) return;
    try { await api.providers.remove(id); load(); } catch (e) { alert(e.message); }
  }

  if (loading) return <div className="loading">Loading providers...</div>;

  return (
    <div>
      <div className="card-header">
        <h2>Providers</h2>
        <button className="btn btn-primary" onClick={openNew}>+ Add Provider</button>
      </div>

      {providers.length === 0 && <div className="empty">No providers configured</div>}

      {providers.map((p) => (
        <div key={p.id} className="provider-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{p.name}</strong>
            <span className={`badge ${p.enabled ? 'badge-success' : 'badge-warning'}`}>{p.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="provider-meta">
            <span>Type: {p.type}</span>
            <span>Model: {p.default_model || '-'}</span>
            <span>URL: {p.base_url}</span>
            <span>Key: {p.api_key_masked || 'N/A'}</span>
          </div>
          <div className="actions">
            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
            <button className="btn btn-outline btn-sm" onClick={() => setTestingId(p.id)}>Test</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editing ? 'Edit Provider' : 'Add Provider'}</div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="openai_compatible">OpenAI Compatible</option>
                <option value="ollama">Ollama</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Base URL</label>
              <input className="form-input" value={form.base_url} onChange={(e) => setForm({ ...form, base_url: e.target.value })} placeholder="https://api.example.com/v1" />
            </div>
            <div className="form-group">
              <label className="form-label">API Key {editing && '(leave blank to keep current)'}</label>
              <input className="form-input" type="password" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} placeholder="sk-..." />
            </div>
            <div className="form-group">
              <label className="form-label">Default Model</label>
              <input className="form-input" value={form.default_model} onChange={(e) => setForm({ ...form, default_model: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Timeout (ms)</label>
              <input className="form-input" type="number" value={form.timeout_ms} onChange={(e) => setForm({ ...form, timeout_ms: parseInt(e.target.value, 10) })} />
            </div>
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                Enabled
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}

      {testingId && <TestProviderDialog providerId={testingId} onClose={() => setTestingId(null)} />}
    </div>
  );
}
