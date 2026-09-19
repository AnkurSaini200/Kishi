import type { User } from '../types/auth';

export async function getCurrentUser(): Promise<User | null> {
  const saved = localStorage.getItem('kishi_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export async function updateUser(user: User): Promise<User> {
  localStorage.setItem('kishi_user', JSON.stringify(user));
  return user;
}
