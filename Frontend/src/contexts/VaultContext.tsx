import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import type {
  VaultEntry,
  VaultRequest,
  VaultResponse,
} from '../types/vault';

import { useAuthContext } from './AuthContext';
import { useVaultCrypto } from './VaultCryptoContext';

import {
  getVaultEntries,
  createVaultEntry,
  updateVaultEntry,
  deleteVaultEntry,
} from '../services/vaultService';

import {
  encryptVaultData,
  decryptVaultData,
} from '../crypto/vaultCrypto';

interface VaultContextValue {
  entries: VaultEntry[];
  isLoading: boolean;
  error: string | null;

  refreshEntries: () => Promise<void>;

  verifyMasterPassword: (
    password: string
  ) => Promise<boolean>;

  addEntry: (
    entry: Omit<VaultEntry, 'id'>
  ) => Promise<VaultEntry>;

  editEntry: (
    id: string,
    entry: Partial<VaultEntry>
  ) => Promise<VaultEntry>;

  removeEntry: (
    id: string
  ) => Promise<void>;
}

const VaultContext =
  createContext<VaultContextValue | undefined>(undefined);

export function VaultProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    token,
    isAuthenticated,
  } = useAuthContext();

  const {
    masterPassword,
    isUnlocked,
  } = useVaultCrypto();

  const [entries, setEntries] =
    useState<VaultEntry[]>([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * DECRYPT VAULT ENTRIES
   * ---------------------------------------------------------
   *
   * Takes encrypted entries received from the backend
   * and decrypts their passwords in the browser.
   *
   * The backend never receives the master password.
   */
  const decryptEntries = useCallback(
    async (
      backendEntries: VaultResponse[],
      key: string
    ): Promise<VaultEntry[]> => {
      const decryptedList: VaultEntry[] = [];

      for (const item of backendEntries) {
        let plaintextPassword: string;

        try {
          plaintextPassword =
            await decryptVaultData(
              item.encryptedPassword,
              key
            );
        } catch {
          plaintextPassword =
            '[Decryption Failed]';
        }

        decryptedList.push({
          id: String(item.id),
          title: item.title,
          username: item.username,
          password: plaintextPassword,
          website: item.website || '',
          category: 'login',
          updatedAt: 'Recently',
        });
      }

      return decryptedList;
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * REFRESH VAULT
   * ---------------------------------------------------------
   *
   * Gets encrypted entries from the backend and decrypts
   * them locally using the master password.
   */
  const refreshEntries = useCallback(
    async () => {
      if (
        !token ||
        !masterPassword ||
        !isUnlocked
      ) {
        return;
      }

      await Promise.resolve();

      setIsLoading(true);
      setError(null);

      try {
        // Get encrypted entries from backend
        const backendResponses =
          await getVaultEntries(token);

        // Decrypt them in the browser
        const decrypted =
          await decryptEntries(
            backendResponses,
            masterPassword
          );

        setEntries(decrypted);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load vault entries';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      token,
      masterPassword,
      isUnlocked,
      decryptEntries,
    ]
  );

  /*
   * ---------------------------------------------------------
   * VERIFY MASTER PASSWORD
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We do NOT send the master password to the backend.
   *
   * Instead:
   *
   *     master password
   *            ↓
   *          PBKDF2
   *            ↓
   *        AES-256 key
   *            ↓
   *      AES-GCM decrypt
   *            ↓
   *       success/failure
   *
   * If the password is wrong, AES-GCM authentication fails.
   */
  const verifyMasterPassword = async (
    password: string
  ): Promise<boolean> => {
    if (!token) {
      throw new Error(
        'Not authenticated'
      );
    }

    try {
      // Get encrypted vault entries
      const backendEntries =
        await getVaultEntries(token);

      /*
       * TEMPORARY EMPTY-VAULT BEHAVIOR
       *
       * If there are no vault entries,
       * there is currently nothing we can
       * decrypt to verify the password.
       *
       * We will replace this later with a
       * dedicated encrypted vault verifier.
       */
      if (backendEntries.length === 0) {
        return true;
      }

      /*
       * Try decrypting the first real
       * encrypted vault password.
       *
       * Correct password:
       *     decrypt succeeds
       *
       * Wrong password:
       *     decryptVaultData throws
       */
      await decryptVaultData(
        backendEntries[0].encryptedPassword,
        password
      );

      return true;
    } catch {
      return false;
    }
  };

  /*
   * ---------------------------------------------------------
   * LOAD VAULT WHEN UNLOCKED
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (
      isUnlocked &&
      masterPassword &&
      isAuthenticated &&
      token
    ) {
      const refreshTimeout = window.setTimeout(() => {
        void refreshEntries();
      }, 0);

      return () => {
        window.clearTimeout(refreshTimeout);
        setEntries([]);
      };
    }
  }, [
    isUnlocked,
    masterPassword,
    isAuthenticated,
    token,
    refreshEntries,
  ]);

  /*
   * ---------------------------------------------------------
   * ADD VAULT ENTRY
   * ---------------------------------------------------------
   */
  const addEntry = async (
    entry: Omit<VaultEntry, 'id'>
  ): Promise<VaultEntry> => {
    if (!token) {
      throw new Error(
        'Not authenticated'
      );
    }

    if (!masterPassword) {
      throw new Error(
        'Vault is locked'
      );
    }

    /*
     * Encrypt the password BEFORE
     * sending anything to the backend.
     */
    const encryptedPassword =
      await encryptVaultData(
        entry.password,
        masterPassword
      );

    const requestPayload: VaultRequest = {
      title: entry.title,
      username: entry.username,
      encryptedPassword,
      website: entry.website || '',
    };

    /*
     * Send only the encrypted password
     * to the backend.
     */
    const saved =
      await createVaultEntry(
        requestPayload,
        token
      );

    /*
     * Keep the plaintext password only
     * in frontend memory.
     */
    const newVaultEntry: VaultEntry = {
      id: String(saved.id),
      title: saved.title,
      username: saved.username,
      password: entry.password,
      website: saved.website || '',
      category: 'login',
      updatedAt: 'Just now',
    };

    setEntries((previous) => [
      newVaultEntry,
      ...previous,
    ]);

    return newVaultEntry;
  };

  /*
   * ---------------------------------------------------------
   * EDIT VAULT ENTRY
   * ---------------------------------------------------------
   */
  const editEntry = async (
    id: string,
    updatedData: Partial<VaultEntry>
  ): Promise<VaultEntry> => {
    if (!token) {
      throw new Error(
        'Not authenticated'
      );
    }

    if (!masterPassword) {
      throw new Error(
        'Vault is locked'
      );
    }

    const existing =
      entries.find(
        (entry) => entry.id === id
      );

    if (!existing) {
      throw new Error(
        'Entry not found'
      );
    }

    const newTitle =
      updatedData.title ??
      existing.title;

    const newUsername =
      updatedData.username ??
      existing.username;

    const newPassword =
      updatedData.password ??
      existing.password;

    const newWebsite =
      updatedData.website ??
      existing.website ??
      '';

    /*
     * Encrypt the updated password
     * before sending it to the backend.
     */
    const encryptedPassword =
      await encryptVaultData(
        newPassword,
        masterPassword
      );

    const requestPayload: VaultRequest = {
      title: newTitle,
      username: newUsername,
      encryptedPassword,
      website: newWebsite,
    };

    const saved =
      await updateVaultEntry(
        id,
        requestPayload,
        token
      );

    const updatedEntry: VaultEntry = {
      id: String(saved.id),
      title: saved.title,
      username: saved.username,
      password: newPassword,
      website: saved.website || '',
      category: 'login',
      updatedAt: 'Just now',
    };

    setEntries((previous) =>
      previous.map((entry) =>
        entry.id === id
          ? updatedEntry
          : entry
      )
    );

    return updatedEntry;
  };

  /*
   * ---------------------------------------------------------
   * DELETE VAULT ENTRY
   * ---------------------------------------------------------
   */
  const removeEntry = async (
    id: string
  ): Promise<void> => {
    if (!token) {
      throw new Error(
        'Not authenticated'
      );
    }

    await deleteVaultEntry(
      id,
      token
    );

    setEntries((previous) =>
      previous.filter(
        (entry) => entry.id !== id
      )
    );
  };

  /*
   * ---------------------------------------------------------
   * ONLY SHOW ENTRIES WHEN VAULT IS UNLOCKED
   * ---------------------------------------------------------
   */
  const visibleEntries =
    isUnlocked && masterPassword
      ? entries
      : [];

  return (
    <VaultContext.Provider
      value={{
        entries: visibleEntries,
        isLoading,
        error,
        refreshEntries,
        verifyMasterPassword,
        addEntry,
        editEntry,
        removeEntry,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVaultContext() {
  const context =
    useContext(VaultContext);

  if (!context) {
    throw new Error(
      'useVaultContext must be used within VaultProvider'
    );
  }

  return context;
}