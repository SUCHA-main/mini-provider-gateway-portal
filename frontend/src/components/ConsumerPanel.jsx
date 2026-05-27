import React, { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function ConsumerPanel() {
  const [consumers, setConsumers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setConsumers(await api.consumers.list()); } catch (e) { alert(e.message); } finally { setLoading(false); }
  }

  async function create() {
    try {
      const result = await api.consumers.create({ name });
      setNewKey(result.api_key);
      setShowForm(false);
      setName('');
      load();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this consumer?')) return;
    try { await api.consumers.remove(id); load(); } catch (e) { alert(e.message); }
  }

  async function rotate(id) {
    if (!confirm('Rotate key? Old key will be invalidated.')) return;
    try {
      const result = await api.consumers.rotateKey(id);
      setNewKey(result.api_key);
      load();
    } catch (e) { alert(e.message); }
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey);
    alert('Copied!');
  }

  if (loading) return <div className="loading">Loading consumers...</div>;

  return (
    <div>
      <div className="card-header">
        <h2>Consumers</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Consumer</button>
      </div>

      {consumers.length === 0 && <div className="empty">No consumers configured</div>}

      {consumers.map((c) => (
        <div key={c.id} className="consumer-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{c.name}</strong>
            <span className={`badge ${c.enabled ? 'badge-success' : 'badge-warning'}`}>{c.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="consumer-meta">
            <span>Key Prefix: {c.key_prefix}****</span>
            <span>Rate Limit: {c.rate_limit_per_min}/min</span>
            <span>Last Used: {c.last_used_at || 'Never'}</span>
          </div>
          <div className="actions">
            <button className="btn btn-outline btn-sm" onClick={() => rotate(c.id)}>Rotate Key</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Delete</button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Add Consumer</div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={create} disabled={!name.trim()}>Create</button>
            </div>
          </div>
        </div>
      )}

      {newKey && (
        <div className="modal-overlay" onClick={() => setNewKey(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Consumer API Key</div>
            <div className="key-warning">This key is shown only once. Copy it now.</div>
            <div className="key-display">{newKey}</div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={copyKey}>Copy</button>
              <button className="btn btn-outline" onClick={() => setNewKey(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
