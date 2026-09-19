import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type {
  AuthContextType,
  User,
} from '../types/auth';

import {
  loginUser,
  registerUser,
} from '../services/authService';

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

const TOKEN_KEY = 'kishi_token';
const USER_KEY = 'kishi_user';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  /*
   * ---------------------------------------------------------
   * TOKEN
   * ---------------------------------------------------------
   */
  const [token, setToken] =
    useState<string | null>(() => {
      return localStorage.getItem(
        TOKEN_KEY
      );
    });

  /*
   * ---------------------------------------------------------
   * USER
   * ---------------------------------------------------------
   */
  const [user, setUser] =
    useState<User | null>(() => {
      const saved =
        localStorage.getItem(USER_KEY);

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }

      return null;
    });

  const isAuthenticated =
    Boolean(token);

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   *
   * Clears both React state and localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );
  };

  /*
   * ---------------------------------------------------------
   * HANDLE UNAUTHORIZED API RESPONSES
   * ---------------------------------------------------------
   *
   * api.ts dispatches this event whenever the backend
   * responds with HTTP 401.
   *
   * This usually means:
   * - JWT expired
   * - JWT invalid
   * - JWT rejected
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(
      'kishi:unauthorized',
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        'kishi:unauthorized',
        handleUnauthorized
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * LOGIN
   * ---------------------------------------------------------
   */
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const response =
      await loginUser(
        email,
        password
      );

    const authToken =
      response.token;

    /*
     * The backend must return a JWT.
     */
    if (!authToken) {
      throw new Error(
        'Login succeeded but no authentication token was returned.'
      );
    }

    const loggedInUser: User = {
      id: email,
      name:
        email.split('@')[0] ||
        'User',
      email,
    };

    /*
     * Update React state.
     */
    setToken(authToken);
    setUser(loggedInUser);

    /*
     * Persist authentication across
     * browser refreshes.
     */
    localStorage.setItem(
      TOKEN_KEY,
      authToken
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(loggedInUser)
    );

    return true;
  };

  /*
   * ---------------------------------------------------------
   * REGISTER
   * ---------------------------------------------------------
   *
   * Registration does not currently return
   * a JWT from the backend.
   *
   * Therefore:
   *
   * register → login
   */
  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    await registerUser(
      email,
      password
    );

    await login(
      email,
      password
    );

    return true;
  };

  /*
   * ---------------------------------------------------------
   * GOOGLE LOGIN
   * ---------------------------------------------------------
   *
   * TEMPORARY MOCK.
   *
   * This is NOT real Google authentication yet.
   */
  const loginWithGoogle =
    async (): Promise<boolean> => {
      const googleUser: User = {
        id:
          'google_' +
          Math.random()
            .toString(36)
            .substring(2, 9),

        name: 'Google User',

        email:
          'user@gmail.com',
      };

      const mockToken =
        'mock_google_jwt_' +
        Math.random()
          .toString(36)
          .substring(2, 9);

      setUser(googleUser);
      setToken(mockToken);

      localStorage.setItem(
        TOKEN_KEY,
        mockToken
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(googleUser)
      );

      return true;
    };

  /*
   * ---------------------------------------------------------
   * PASSKEY LOGIN
   * ---------------------------------------------------------
   *
   * TEMPORARY MOCK.
   *
   * This is NOT real WebAuthn yet.
   */
  const loginWithPasskey =
    async (): Promise<boolean> => {
      const passkeyUser: User = {
        id:
          'passkey_' +
          Math.random()
            .toString(36)
            .substring(2, 9),

        name: 'Passkey User',

        email:
          'passkey@kishi.vault',
      };

      const mockToken =
        'mock_passkey_jwt_' +
        Math.random()
          .toString(36)
          .substring(2, 9);

      setUser(passkeyUser);
      setToken(mockToken);

      localStorage.setItem(
        TOKEN_KEY,
        mockToken
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(passkeyUser)
      );

      return true;
    };

  /*
   * ---------------------------------------------------------
   * SSO LOGIN
   * ---------------------------------------------------------
   *
   * TEMPORARY MOCK.
   *
   * This is NOT real SSO yet.
   */
  const loginWithSso =
    async (): Promise<boolean> => {
      const ssoUser: User = {
        id:
          'sso_' +
          Math.random()
            .toString(36)
            .substring(2, 9),

        name:
          'Enterprise SSO User',

        email:
          'enterprise@company.com',
      };

      const mockToken =
        'mock_sso_jwt_' +
        Math.random()
          .toString(36)
          .substring(2, 9);

      setUser(ssoUser);
      setToken(mockToken);

      localStorage.setItem(
        TOKEN_KEY,
        mockToken
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(ssoUser)
      );

      return true;
    };

  /*
   * ---------------------------------------------------------
   * PROVIDER
   * ---------------------------------------------------------
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider'
    );
  }

  return context;
}