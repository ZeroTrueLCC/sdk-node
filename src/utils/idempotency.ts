import { randomBytes } from 'crypto';

/**
 * Generates a unique idempotency key (UUID v4)
 */
export function generateIdempotencyKey(): string {
  const bytes = randomBytes(16);

  // Set version to 4
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  // Set variant to RFC4122
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}
