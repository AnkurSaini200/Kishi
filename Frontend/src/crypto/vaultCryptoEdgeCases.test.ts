import { describe, expect, it } from 'vitest'

import {
    encryptVaultData,
    decryptVaultData,
} from './vaultCrypto'

describe('Vault encryption edge cases', () => {

    it('should encrypt and decrypt an empty string', async () => {
        const plaintext = ''
        const masterPassword = 'master-password'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        const decrypted = await decryptVaultData(
            encrypted,
            masterPassword
        )

        expect(decrypted).toBe(plaintext)
    })

    it('should correctly handle Unicode characters', async () => {
        const plaintext = 'पासवर्ड 🔐 日本語 café'
        const masterPassword = 'मास्टर🔑password'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        const decrypted = await decryptVaultData(
            encrypted,
            masterPassword
        )

        expect(decrypted).toBe(plaintext)
    })

    it('should correctly handle long plaintext', async () => {
        const plaintext = 'A'.repeat(10000)
        const masterPassword = 'master-password'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        const decrypted = await decryptVaultData(
            encrypted,
            masterPassword
        )

        expect(decrypted).toBe(plaintext)
    })

    it('should produce different ciphertext with different master passwords', async () => {
        const plaintext = 'same secret'

        const encrypted1 = await encryptVaultData(
            plaintext,
            'password-one'
        )

        const encrypted2 = await encryptVaultData(
            plaintext,
            'password-two'
        )

        expect(encrypted1).not.toBe(encrypted2)
    })

    it('should fail when encrypted data is corrupted', async () => {
        const plaintext = 'important secret'
        const masterPassword = 'master-password'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        const payload = JSON.parse(encrypted)

        payload.ciphertext = payload.ciphertext.slice(0, -2) + 'XX'

        const corruptedData = JSON.stringify(payload)

        await expect(
            decryptVaultData(
                corruptedData,
                masterPassword
            )
        ).rejects.toThrow()
    })
})