import type { VaultRequest, VaultResponse } from "../types/vault";

const API_URL = "http://localhost:8080/api/vault";

export async function createVaultEntry(
    entry: VaultRequest,
    token: string
): Promise<VaultResponse> {

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(entry)
    });

    if (!response.ok) {
        throw new Error("Failed to create vault entry");
    }

    return response.json();
}