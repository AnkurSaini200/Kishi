export type VaultCategory = 'login' | 'card' | 'note'
export interface VaultEntry { id: string; title: string; username: string; password: string; category: VaultCategory; updatedAt: string }
