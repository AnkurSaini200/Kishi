export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password?: string) => Promise<boolean>
  register: (data: { email: string; name?: string; password?: string; passwordHint?: string }) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  loginWithPasskey: () => Promise<boolean>
  loginWithSso: () => Promise<boolean>
  logout: () => void
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

