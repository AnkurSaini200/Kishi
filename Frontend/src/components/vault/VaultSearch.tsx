interface VaultSearchProps {
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function VaultSearch({
  value,
  onChange,
  totalCount,
  filteredCount,
}: VaultSearchProps) {
  return (
    <div className="flex items-center gap-2 text-[11px] select-none py-1">
      <label htmlFor="vault-search-input" className="text-black shrink-0">
        <u>S</u>earch:
      </label>
      <div className="relative flex items-center flex-1 max-w-xs">
        <input
          id="vault-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter items..."
          className="win98-input w-full pr-6"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-1 text-[10px] text-neutral-600 hover:text-black cursor-pointer px-1 font-bold"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <span className="text-[10px] text-neutral-600 shrink-0">
        {value ? `${filteredCount} of ${totalCount}` : `${totalCount} items`}
      </span>
    </div>
  );
}
