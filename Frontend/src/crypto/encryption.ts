import type { EncryptedValue } from './types'
export function encrypt(value: string): EncryptedValue { return { ciphertext: btoa(value), iv: '', salt: '' } }
export function decrypt(value: EncryptedValue): string { return atob(value.ciphertext) }
