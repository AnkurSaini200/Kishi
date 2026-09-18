import type { EncryptedValue } from './types'
export function encrypt(value: string): EncryptedValue { return { ciphertext: btoa(value), iv: '', salt: '' } }
export function decrypt(value: EncryptedValue): string { return atob(value.ciphertext) }

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const PBKDF2_ITERATIONS = 600_000;
const KEY_LENGTH = 256;

async function deriveKey(
    masterPassword: string,
    salt: Uint8Array
): Promise<CryptoKey> {

    const passwordKey =
        await crypto.subtle.importKey(
            "raw",
            encoder.encode(masterPassword),
            "PBKDF2",
            false,
            ["deriveKey"]
        );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: KEY_LENGTH
        },
        false,
        ["encrypt", "decrypt"]
    );
}

function bytesToBase64(bytes: Uint8Array): string {

    let binary = "";

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

export async function encryptVaultData(
    data: string,
    masterPassword: string
): Promise<string> {

    const salt = crypto.getRandomValues(
        new Uint8Array(16)
    );

    const iv = crypto.getRandomValues(
        new Uint8Array(12)
    );

    const key =
        await deriveKey(masterPassword, salt);

    const encrypted =
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            encoder.encode(data)
        );

    const encryptedBytes =
        new Uint8Array(encrypted);

    return JSON.stringify({
        version: 1,
        algorithm: "AES-256-GCM",
        kdf: "PBKDF2-SHA-256",
        iterations: PBKDF2_ITERATIONS,
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        ciphertext: bytesToBase64(encryptedBytes)
    });
}

export async function decryptVaultData(
    encryptedData: string,
    masterPassword: string
): Promise<string> {

    const payload = JSON.parse(encryptedData);

    const salt =
        base64ToBytes(payload.salt);

    const iv =
        base64ToBytes(payload.iv);

    const ciphertext =
        base64ToBytes(payload.ciphertext);

    const key =
        await deriveKey(masterPassword, salt);

    const decrypted =
        await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            ciphertext
        );

    return decoder.decode(decrypted);
}