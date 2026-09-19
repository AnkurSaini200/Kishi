import { describe, expect, it } from 'vitest'

import {
    encryptVaultData,
    decryptVaultData,
} from './vaultCrypto'

describe('Vault encryption', () => {

    it('should encrypt plaintext into ciphertext', async () => {
        const plaintext = 'My super secret password'
        const masterPassword = 'master-password-123'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        expect(encrypted).not.toBe(plaintext)

        const payload = JSON.parse(encrypted)

        expect(payload.version).toBe(1)
        expect(payload.algorithm).toBe('AES-256-GCM')
        expect(payload.kdf).toBe('PBKDF2-SHA-256')
        expect(payload.ciphertext).toBeTruthy()
        expect(payload.iv).toBeTruthy()
        expect(payload.salt).toBeTruthy()
    })

    it('should decrypt encrypted data with the correct master password', async () => {
        const plaintext = 'My super secret password'
        const masterPassword = 'master-password-123'

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

    it('should fail to decrypt with the wrong master password', async () => {
        const plaintext = 'My super secret password'
        const correctPassword = 'correct-password'
        const wrongPassword = 'wrong-password'

        const encrypted = await encryptVaultData(
            plaintext,
            correctPassword
        )

        await expect(
            decryptVaultData(
                encrypted,
                wrongPassword
            )
        ).rejects.toThrow()
    })

    it('should produce different ciphertext for the same plaintext', async () => {
        const plaintext = 'My super secret password'
        const masterPassword = 'master-password-123'

        const encrypted1 = await encryptVaultData(
            plaintext,
            masterPassword
        )

        const encrypted2 = await encryptVaultData(
            plaintext,
            masterPassword
        )

        expect(encrypted1).not.toBe(encrypted2)
    })

    it('should not expose the plaintext inside the encrypted payload', async () => {
        const plaintext = 'My super secret password'
        const masterPassword = 'master-password-123'

        const encrypted = await encryptVaultData(
            plaintext,
            masterPassword
        )

        expect(encrypted).not.toContain(plaintext)
    })
})