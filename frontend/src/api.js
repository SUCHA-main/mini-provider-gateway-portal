const BASE = '';

function getAdminToken() {
  return localStorage.getItem('admin_token') || '';
}

function adminHeaders() {
  return { 'Content-Type': 'application/json', 'x-admin-token': getAdminToken() };
}

async function request(path, options = {}) {
  const resp = await fetch(`${BASE}${path}`, options);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(err.error || err.error?.message || `HTTP ${resp.status}`);
  }
  return resp.json();
}

export const api = {
  health: () => request('/api/health'),
  providers: {
    list: () => request('/api/providers', { headers: adminHeaders() }),
    create: (data) => request('/api/providers', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/providers/${id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(data) }),
    remove: (id) => request(`/api/providers/${id}`, { method: 'DELETE', headers: adminHeaders() }),
    test: (id) => request(`/api/providers/${id}/test`, { method: 'POST', headers: adminHeaders() }),
  },
  consumers: {
    list: () => request('/api/consumers', { headers: adminHeaders() }),
    create: (data) => request('/api/consumers', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/consumers/${id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(data) }),
    remove: (id) => request(`/api/consumers/${id}`, { method: 'DELETE', headers: adminHeaders() }),
    rotateKey: (id) => request(`/api/consumers/${id}/rotate-key`, { method: 'POST', headers: adminHeaders() }),
  },
  logs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/logs?${qs}`, { headers: adminHeaders() });
  },
};
