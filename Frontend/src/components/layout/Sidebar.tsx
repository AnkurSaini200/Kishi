import { useVaultCrypto } from '../../contexts/VaultCryptoContext';
import { useVault } from '../../hooks/useVault';

export type AppPage = 'vault' | 'security' | 'generator' | 'settings';

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  const { isUnlocked } = useVaultCrypto();
  const { entries } = useVault();

  const navItems: { id: AppPage; label: string; icon: string; count?: number }[] = [
    {
      id: 'vault',
      label: 'All Items',
      icon: '📁',
      count: isUnlocked ? entries.length : undefined,
    },
    {
      id: 'security',
      label: 'Security Health',
      icon: '🛡️',
    },
    {
      id: 'generator',
      label: 'Password Generator',
      icon: '🔑',
    },
    {
      id: 'settings',
      label: 'Options / Settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="w-full md:w-60 shrink-0 flex flex-col">
      {/* Left Tree Pane Header */}
      <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1 px-1">
        Folders & Views
      </div>

      {/* Sunken Tree View Container */}
      <div className="win98-sunken flex-1 p-1.5 bg-white min-h-[160px] md:min-h-[550px] select-none overflow-y-auto">
        <div className="text-[11px] font-bold px-1 py-0.5 text-black mb-1 flex items-center gap-1 border-b border-neutral-200">
          <span>🗄️</span>
          <span>Kishi Vault</span>
        </div>

        <div className="space-y-0.5 pl-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center justify-between px-2 py-1 text-[11px] font-normal cursor-pointer border border-transparent ${
                  isActive
                    ? 'bg-[#000080] text-white !border-dotted !border-white'
                    : 'text-black hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1 font-mono ${
                      isActive ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
