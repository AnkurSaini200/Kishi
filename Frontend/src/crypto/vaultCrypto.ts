import type { EncryptedVaultPayload } from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const PBKDF2_ITERATIONS = 600_000;
export const KEY_LENGTH = 256;

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer as ArrayBuffer;
}

export async function deriveKey(
  masterPassword: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(encoder.encode(masterPassword)),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypts plaintext data using PBKDF2-SHA-256 key derivation and AES-256-GCM encryption.
 * Returns a serialized JSON string containing all parameters necessary for decryption.
 */
export async function encryptVaultData(
  data: string,
  masterPassword: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(masterPassword, salt);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(encoder.encode(data))
  );

  const encryptedBytes = new Uint8Array(encrypted);

  const payload: EncryptedVaultPayload = {
    version: 1,
    algorithm: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(encryptedBytes),
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts an encrypted vault payload using the master password.
 * Throws an error if the password is wrong or ciphertext has been tampered with.
 */
export async function decryptVaultData(
  encryptedData: string,
  masterPassword: string
): Promise<string> {
  try {
    const payload: EncryptedVaultPayload = JSON.parse(encryptedData);

    const salt = base64ToBytes(payload.salt);
    const iv = base64ToBytes(payload.iv);
    const ciphertext = base64ToBytes(payload.ciphertext);

    const key = await deriveKey(masterPassword, salt);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: toArrayBuffer(iv),
      },
      key,
      toArrayBuffer(ciphertext)
    );

    return decoder.decode(decrypted);
  } catch (err) {
    throw new Error(
      'Failed to decrypt vault data: invalid master password or corrupted payload',
      { cause: err }
    );
  }
}