export interface EncryptedVaultPayload {
  version: number;
  algorithm: string;
  kdf: string;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

export interface EncryptedValue {
  ciphertext: string;
  iv: string;
  salt: string;
}
