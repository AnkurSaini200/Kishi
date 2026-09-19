import type { VaultEntry } from '../../types/vault';
import { PasswordField } from './PasswordField';
import { useClipboard } from '../../hooks/useClipboard';

interface VaultCardProps {
  entry: VaultEntry;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (id: string, title: string) => void;
  onToast: (msg: string) => void;
}

export function VaultCard({ entry, onEdit, onDelete, onToast }: VaultCardProps) {
  const { copyToClipboard: copyUsername } = useClipboard();

  const handleCopyUsername = async () => {
    await copyUsername(entry.username, false);
    onToast(`Username copied: ${entry.username}`);
  };

  const displayWebsite = entry.website ? entry.website.replace(/^https?:\/\//, '') : '';
  const websiteHref = entry.website
    ? entry.website.startsWith('http')
      ? entry.website
      : `https://${entry.website}`
    : null;

  return (
    <div className="win98-sunken p-2.5 bg-white text-black text-left flex flex-col justify-between">
      <div>
        {/* Header: Title and Actions */}
        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-neutral-200">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs">🔑</span>
            <span className="font-bold text-[11px] truncate text-black">
              {entry.title}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(entry)}
              className="win98-btn !px-1.5 !py-0.5 text-[10px]"
              title="Edit Entry"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(entry.id, entry.title)}
              className="win98-btn !px-1.5 !py-0.5 text-[10px] text-red-800"
              title="Delete Entry"
            >
              Del
            </button>
          </div>
        </div>

        {/* Username Row */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-neutral-600 text-[10px] uppercase font-semibold">User:</span>
          <div className="flex items-center gap-1 max-w-[70%]">
            <span className="font-mono text-[11px] truncate text-black select-all">
              {entry.username}
            </span>
            <button
              type="button"
              onClick={handleCopyUsername}
              className="win98-btn !px-1 !py-0 text-[9px]"
              title="Copy Username"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Website Row */}
        {displayWebsite && (
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-neutral-600 text-[10px] uppercase font-semibold">URL:</span>
            <a
              href={websiteHref || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#000080] hover:underline truncate max-w-[70%]"
            >
              {displayWebsite}
            </a>
          </div>
        )}

        {/* Password Row */}
        <div className="mt-2">
          <PasswordField
            value={entry.password}
            onCopySuccess={onToast}
          />
        </div>
      </div>
    </div>
  );
}
