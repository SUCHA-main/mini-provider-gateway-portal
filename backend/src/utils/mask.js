export function maskApiKey(key) {
  if (!key || typeof key !== 'string') return null;
  if (key.length <= 8) return '****';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}
