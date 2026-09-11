import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthContextType, User } from '../types/auth'

const defaultUser: User = {
  id: 'demo-user-1',
  name: 'Demo user',
  email: 'user@kishi.vault',
}

const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => true,
  register: async () => true,
  loginWithGoogle: async () => true,
  loginWithPasskey: async () => true,
  loginWithSso: async () => true,
  logout: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to false so login screen is showcased, allow localStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kishi_authenticated') === 'true'
  })

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kishi_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return defaultUser
      }
    }
    return isAuthenticated ? defaultUser : null
  })

  const login = async (email: string, _password?: string) => {
    // TODO: Connect with your backend authentication endpoint
    const loggedInUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0] || 'User',
      email: email,
    }
    setUser(loggedInUser)
    setIsAuthenticated(true)
    localStorage.setItem('kishi_authenticated', 'true')
    localStorage.setItem('kishi_user', JSON.stringify(loggedInUser))
    return true
  }

  const register = async (data: { email: string; name?: string; password?: string; passwordHint?: string }) => {
    // TODO: Connect with your backend registration endpoint
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: data.name?.trim() || data.email.split('@')[0] || 'User',
      email: data.email,
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('kishi_authenticated', 'true')
    localStorage.setItem('kishi_user', JSON.stringify(newUser))
    return true
  }

  const loginWithGoogle = async () => {
    // TODO: Connect with your Google OAuth / Firebase / Supabase auth flow
    const googleUser: User = {
      id: 'google_' + Math.random().toString(36).substring(2, 9),
      name: 'Google User',
      email: 'user@gmail.com',
    }
    setUser(googleUser)
    setIsAuthenticated(true)
    localStorage.setItem('kishi_authenticated', 'true')
    localStorage.setItem('kishi_user', JSON.stringify(googleUser))
    return true
  }

  const loginWithPasskey = async () => {
    // TODO: Connect with WebAuthn / Passkey registration or assertion
    const passkeyUser: User = {
      id: 'passkey_' + Math.random().toString(36).substring(2, 9),
      name: 'Passkey User',
      email: 'passkey@kishi.vault',
    }
    setUser(passkeyUser)
    setIsAuthenticated(true)
    localStorage.setItem('kishi_authenticated', 'true')
    localStorage.setItem('kishi_user', JSON.stringify(passkeyUser))
    return true
  }

  const loginWithSso = async () => {
    // TODO: Connect with SAML / OIDC Enterprise Single Sign-On
    const ssoUser: User = {
      id: 'sso_' + Math.random().toString(36).substring(2, 9),
      name: 'Enterprise SSO User',
      email: 'enterprise@company.com',
    }
    setUser(ssoUser)
    setIsAuthenticated(true)
    localStorage.setItem('kishi_authenticated', 'true')
    localStorage.setItem('kishi_user', JSON.stringify(ssoUser))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('kishi_authenticated')
    localStorage.removeItem('kishi_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginWithGoogle,
        loginWithPasskey,
        loginWithSso,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
