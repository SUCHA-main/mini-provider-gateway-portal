import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProviderPanel from './components/ProviderPanel.jsx';
import ConsumerPanel from './components/ConsumerPanel.jsx';
import LogsPanel from './components/LogsPanel.jsx';
import IntegrationSnippet from './components/IntegrationSnippet.jsx';
import { api } from './api.js';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [health, setHealth] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem('admin_token', t);
  };

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth(null));
    const interval = setInterval(() => {
      api.health().then(setHealth).catch(() => setHealth(null));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'providers': return <ProviderPanel />;
      case 'consumers': return <ConsumerPanel />;
      case 'logs': return <LogsPanel />;
      case 'integration': return <IntegrationSnippet />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout page={page} setPage={setPage} health={health} token={token} saveToken={saveToken}>
      {renderPage()}
    </Layout>
  );
}
