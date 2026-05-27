import React, { useState } from 'react';
import { api } from '../api.js';

export default function TestProviderDialog({ providerId, onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    api.providers.test(providerId)
      .then(setResult)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [providerId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Provider Test Result</div>
        {loading && <div className="loading">Testing provider...</div>}
        {error && <div className="error-detail">{error}</div>}
        {result && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span className="badge badge-success">OK</span>
              <span style={{ marginLeft: 8 }}>Latency: {result.latency_ms}ms</span>
            </div>
            <div className="snippet-label">Response Preview:</div>
            <div className="snippet">{result.response_preview}</div>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
