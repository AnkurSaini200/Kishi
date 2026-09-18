import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

interface VaultCryptoContextType {
    masterPassword: string | null;
    unlock: (password: string) => void;
    lock: () => void;
    isUnlocked: boolean;
}

const VaultCryptoContext =
    createContext<VaultCryptoContextType | undefined>(
        undefined
    );

interface VaultCryptoProviderProps {
    children: ReactNode;
}

export function VaultCryptoProvider({
    children
}: VaultCryptoProviderProps) {

    const [masterPassword, setMasterPassword] =
        useState<string | null>(null);

    function unlock(password: string) {
        setMasterPassword(password);
    }

    function lock() {
        setMasterPassword(null);
    }

    return (
        <VaultCryptoContext.Provider
            value={{
                masterPassword,
                unlock,
                lock,
                isUnlocked: masterPassword !== null
            }}
        >
            {children}
        </VaultCryptoContext.Provider>
    );
}

export function useVaultCrypto() {

    const context = useContext(VaultCryptoContext);

    if (!context) {
        throw new Error(
            "useVaultCrypto must be used inside VaultCryptoProvider"
        );
    }

    return context;
}