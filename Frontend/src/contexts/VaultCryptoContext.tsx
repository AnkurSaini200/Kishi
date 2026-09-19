import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useAutoLock } from '../hooks/useAutoLock';

export interface VaultCryptoContextType {
  masterPassword: string | null;
  unlock: (password: string) => void;
  lock: () => void;
  isUnlocked: boolean;
  autoLockTimeout: number; // in milliseconds
  setAutoLockTimeout: (timeoutMs: number) => void;
}

const VaultCryptoContext = createContext<VaultCryptoContextType | undefined>(
  undefined
);

interface VaultCryptoProviderProps {
  children: ReactNode;
}

// Default to 15 minutes (900,000 ms)
const DEFAULT_AUTO_LOCK_TIMEOUT = 15 * 60 * 1000;

export function VaultCryptoProvider({ children }: VaultCryptoProviderProps) {
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [autoLockTimeout, setAutoLockTimeoutState] = useState<number>(() => {
    const saved = localStorage.getItem('kishi_autolock_ms');
    return saved ? parseInt(saved, 10) : DEFAULT_AUTO_LOCK_TIMEOUT;
  });

  const unlock = useCallback((password: string) => {
    setMasterPassword(password);
  }, []);

  const lock = useCallback(() => {
    // Clear master password from memory immediately
    setMasterPassword(null);
  }, []);

  const setAutoLockTimeout = useCallback((timeoutMs: number) => {
    setAutoLockTimeoutState(timeoutMs);
    localStorage.setItem('kishi_autolock_ms', timeoutMs.toString());
  }, []);

  useAutoLock({
    timeout: autoLockTimeout,
    onLock: lock,
    enabled: masterPassword !== null,
  });

  return (
    <VaultCryptoContext.Provider
      value={{
        masterPassword,
        unlock,
        lock,
        isUnlocked: masterPassword !== null,
        autoLockTimeout,
        setAutoLockTimeout,
      }}
    >
      {children}
    </VaultCryptoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVaultCrypto() {
  const context = useContext(VaultCryptoContext);
  if (!context) {
    throw new Error('useVaultCrypto must be used inside VaultCryptoProvider');
  }
  return context;
}