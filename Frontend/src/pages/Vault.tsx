import { useState } from 'react'
import { useVault } from '../hooks/useVault'
import { Button } from '../components/common/Button'
import { VaultList } from '../components/vault/VaultList'
import { VaultSearch } from '../components/vault/VaultSearch'
export function Vault() { const { entries } = useVault(); const [query, setQuery] = useState(''); const filtered = entries.filter((entry) => `${entry.title} ${entry.username}`.toLowerCase().includes(query.toLowerCase())); return <div className="page" id="vault"><div className="page-heading"><div><h2>Your vault</h2><p className="muted">{entries.length} protected entries</p></div><Button type="button">+ Add entry</Button></div><VaultSearch value={query} onChange={setQuery} /><VaultList entries={filtered} /></div> }
