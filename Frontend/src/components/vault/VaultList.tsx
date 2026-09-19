import { useState } from 'react';
import type { VaultEntry } from '../../types/vault';
import { PasswordField } from './PasswordField';
import { VaultCard } from './VaultCard';
import { useClipboard } from '../../hooks/useClipboard';

interface VaultListProps {
  entries: VaultEntry[];
  searchQuery?: string;
  onAddNew: () => void;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (id: string, title: string) => void;
  onToast: (msg: string) => void;
}

export function VaultList({
  entries,
  searchQuery = '',
  onAddNew,
  onEdit,
  onDelete,
  onToast,
}: VaultListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'cards'>('details');
  const { copyToClipboard } = useClipboard();

  // Empty state: no entries at all
  if (entries.length === 0 && !searchQuery) {
    return (
      <div className="win98-sunken p-8 bg-white text-center flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-3xl mb-2">🗄️</span>
        <div className="font-bold text-[12px] text-black mb-1">
          Folder is Empty
        </div>
        <p className="text-[11px] text-neutral-600 mb-4 max-w-xs">
          There are no password credentials stored in this vault.
        </p>
        <button
          onClick={onAddNew}
          className="win98-btn win98-btn-default flex items-center gap-1.5"
        >
          <span>➕</span>
          <span>Add First Entry</span>
        </button>
      </div>
    );
  }

  // Search empty state: no matches found
  if (entries.length === 0 && searchQuery) {
    return (
      <div className="win98-sunken p-8 bg-white text-center flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-2xl mb-2">🔍</span>
        <div className="font-bold text-[12px] text-black mb-1">
          No matching items found
        </div>
        <p className="text-[11px] text-neutral-600 max-w-xs">
          No items match the search query "{searchQuery}".
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* View Mode Toggle Header */}
      <div className="flex items-center justify-between pb-1 text-[11px] select-none">
        <span className="text-neutral-700 font-semibold">
          Vault Items ({entries.length})
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('details')}
            className={`win98-btn !px-2 !py-0.5 text-[10px] ${
              viewMode === 'details' ? 'active font-bold' : ''
            }`}
            title="Details View (Windows Explorer style)"
          >
            Details
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`win98-btn !px-2 !py-0.5 text-[10px] ${
              viewMode === 'cards' ? 'active font-bold' : ''
            }`}
            title="Card Tiles View"
          >
            Tiles
          </button>
        </div>
      </div>

      {/* Details Table View */}
      {viewMode === 'details' ? (
        <div className="win98-sunken bg-white flex-1 overflow-x-auto min-h-[350px]">
          <table className="win98-table">
            <thead>
              <tr>
                <th className="win98-th w-36">Name</th>
                <th className="win98-th w-44">User Name / Email</th>
                <th className="win98-th w-48">Password</th>
                <th className="win98-th">Website URL</th>
                <th className="win98-th w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isSelected = selectedId === entry.id;
                return (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedId(entry.id)}
                    className={`win98-tr ${isSelected ? 'win98-tr-selected' : ''}`}
                  >
                    <td className="win98-td font-semibold">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>🔑</span>
                        <span className="truncate">{entry.title}</span>
                      </div>
                    </td>
                    <td className="win98-td font-mono truncate">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate select-all">{entry.username}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(entry.username, false);
                            onToast(`Username copied: ${entry.username}`);
                          }}
                          className="win98-btn !px-1 !py-0 text-[9px] shrink-0"
                          title="Copy Username"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="win98-td" onClick={(e) => e.stopPropagation()}>
                      <PasswordField
                        value={entry.password}
                        onCopySuccess={onToast}
                      />
                    </td>
                    <td className="win98-td truncate">
                      {entry.website ? (
                        <a
                          href={
                            entry.website.startsWith('http')
                              ? entry.website
                              : `https://${entry.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={isSelected ? 'text-white underline' : 'text-[#000080] hover:underline'}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {entry.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="win98-td text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(entry)}
                          className="win98-btn !px-1.5 !py-0.5 text-[10px]"
                          title="Edit Item"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(entry.id, entry.title)}
                          className="win98-btn !px-1.5 !py-0.5 text-[10px] text-red-800"
                          title="Delete Item"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tiles View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[600px] p-1">
          {entries.map((entry) => (
            <VaultCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
