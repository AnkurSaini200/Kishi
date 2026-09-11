import type { User } from '../types/auth'
export async function getCurrentUser(): Promise<User | null> { return { id: 'demo', name: 'Demo user', email: 'you@example.com' } }
