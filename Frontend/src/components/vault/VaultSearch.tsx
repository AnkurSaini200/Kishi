import { Input } from '../common/Input'
export function VaultSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Input aria-label="Search vault" placeholder="Search your vault" value={value} onChange={(event) => onChange(event.target.value)} /> }
