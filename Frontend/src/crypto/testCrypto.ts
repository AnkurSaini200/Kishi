import {
    encryptVaultData,
    decryptVaultData
} from "./vaultCrypto";

async function testCrypto() {

    const original =
        "My secret GitHub password";

    const masterPassword =
        "MyMasterPassword123!";

    const encrypted =
        await encryptVaultData(
            original,
            masterPassword
        );

    console.log("Encrypted:");
    console.log(encrypted);

    const decrypted =
        await decryptVaultData(
            encrypted,
            masterPassword
        );

    console.log("Decrypted:");
    console.log(decrypted);
}

testCrypto();