import { randomUUID } from 'node:crypto';

export function generateRequestId() {
  return randomUUID();
}
