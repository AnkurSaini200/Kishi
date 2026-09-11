import type { VaultEntry } from '../../types/vault'
export function VaultCard({ entry }: { entry: VaultEntry }) { return <article className="vault-card"><h3>{entry.title}</h3><p className="muted">{entry.username}</p><div className="card-meta"><span>{entry.category}</span><span>{entry.updatedAt}</span></div></article> }
