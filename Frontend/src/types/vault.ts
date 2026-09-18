export type VaultCategory = 'login' | 'card' | 'note'
export interface VaultEntry { 
    id: string; 
    title: string; 
    username: string; 
    password: string; 
    category: VaultCategory; 
    updatedAt: string 
}

export interface VaultRequest {
    title: string;
    username: string;
    encryptedPassword: string;
    website?: string;
}

export interface VaultResponse {
    id: number;
    title: string;
    username: string;
    encryptedPassword: string;
    website?: string;
}