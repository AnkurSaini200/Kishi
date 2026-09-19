export type VaultCategory = 'login' | 'card' | 'note';

/**
 * Decrypted in-memory representation of a vault entry.
 * Plaintext passwords exist in memory only while the vault is unlocked.
 */
export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string; // In-memory decrypted password
  website?: string;
  category?: VaultCategory;
  updatedAt?: string;
}

/**
 * DTO sent to backend API: POST /api/vault and PUT /api/vault/{id}
 */
export interface VaultRequest {
  title: string;
  username: string;
  encryptedPassword: string;
  website?: string;
}

/**
 * DTO received from backend API: GET /api/vault and GET /api/vault/{id}
 */
export interface VaultResponse {
  id: number;
  title: string;
  username: string;
  encryptedPassword: string;
  website?: string;
}