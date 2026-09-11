import type { VaultEntry } from '../../types/vault'
import { VaultCard } from './VaultCard'
export function VaultList({ entries }: { entries: VaultEntry[] }) { return <div className="vault-grid">{entries.map((entry) => <VaultCard key={entry.id} entry={entry} />)}</div> }
