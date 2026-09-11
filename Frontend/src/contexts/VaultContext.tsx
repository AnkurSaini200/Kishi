import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { VaultEntry } from '../types/vault'

const initialEntries: VaultEntry[] = [
  { id: '1', title: 'Personal email', username: 'you@example.com', password: 'not-shown', category: 'login', updatedAt: 'Today' },
  { id: '2', title: 'Cloud console', username: 'admin@example.com', password: 'not-shown', category: 'login', updatedAt: 'Yesterday' },
]
interface VaultContextValue { entries: VaultEntry[]; addEntry: (entry: VaultEntry) => void; removeEntry: (id: string) => void }
const VaultContext = createContext<VaultContextValue | undefined>(undefined)
export function VaultProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState(initialEntries)
  const value = useMemo(() => ({ entries, addEntry: (entry: VaultEntry) => setEntries((current) => [...current, entry]), removeEntry: (id: string) => setEntries((current) => current.filter((entry) => entry.id !== id)) }), [entries])
  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}
export function useVaultContext() { const context = useContext(VaultContext); if (!context) throw new Error('useVaultContext must be used within VaultProvider'); return context }
