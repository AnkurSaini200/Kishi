export async function deriveKey(secret: string) { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret)) }
