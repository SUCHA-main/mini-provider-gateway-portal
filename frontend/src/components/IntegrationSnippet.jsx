import React from 'react';

function CopyBlock({ label, code }) {
  function copy() { navigator.clipboard.writeText(code); alert('Copied!'); }
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="snippet-label">{label}</div>
        <button className="copy-btn" onClick={copy}>Copy</button>
      </div>
      <pre className="snippet">{code}</pre>
    </div>
  );
}

export default function IntegrationSnippet() {
  const host = window.location.hostname;
  const baseUrl = `http://${host}:3100`;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Integration Guide</h2>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>OpenAI-Compatible Environment Variables</h3>
        <CopyBlock label=".env" code={`OPENAI_BASE_URL=${baseUrl}/v1
OPENAI_API_KEY=<your_consumer_key>
OPENAI_MODEL=<model_name>`} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>curl Example</h3>
        <CopyBlock label="curl" code={`curl ${baseUrl}/v1/chat/completions \\
  -H "Authorization: Bearer <your_consumer_key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen2.5:3b",
    "messages": [{"role": "user", "content": "hello"}]
  }'`} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>JavaScript / Node.js</h3>
        <CopyBlock label="code" code={`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${baseUrl}/v1',
  apiKey: '<your_consumer_key>',
});

const res = await client.chat.completions.create({
  model: 'qwen2.5:3b',
  messages: [{ role: 'user', content: 'hello' }],
});
console.log(res.choices[0].message.content);`} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Python</h3>
        <CopyBlock label="code" code={`from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}/v1",
    api_key="<your_consumer_key>",
)

res = client.chat.completions.create(
    model="qwen2.5:3b",
    messages=[{"role": "user", "content": "hello"}],
)
print(res.choices[0].message.content)`} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>ai-wechat-digest-mvp Integration</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Configure ai-wechat-digest-mvp to use this gateway as its AI provider:
        </p>
        <CopyBlock label=".env" code={`AI_PROVIDER=openai_compatible
OPENAI_BASE_URL=${baseUrl}/v1
OPENAI_API_KEY=<consumer_key_from_this_portal>
OPENAI_MODEL=mimo-v2.5-pro`} />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Do not modify ai-wechat-digest-mvp repository directly. Only update its environment variables.
        </p>
      </div>
    </div>
  );
}
