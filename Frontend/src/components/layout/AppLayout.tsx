import type { ReactNode } from 'react';
import { Sidebar, type AppPage } from './Sidebar';
import { Header } from './Header';
import { useAuthContext } from '../../contexts/AuthContext';
import { useVaultCrypto } from '../../contexts/VaultCryptoContext';
import { useVault } from '../../hooks/useVault';

interface AppLayoutProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  children: ReactNode;
}

export function AppLayout({ activePage, onNavigate, children }: AppLayoutProps) {
  const { user } = useAuthContext();
  const { isUnlocked, autoLockTimeout } = useVaultCrypto();
  const { entries } = useVault();

  const pageNames: Record<AppPage, string> = {
    vault: 'All Items',
    security: 'Security Health Audit',
    generator: 'Password Generator Utility',
    settings: 'Options & Security Settings',
  };

  const autoLockMinutes = Math.round(autoLockTimeout / 60000);

  return (
    <div className="desktop-container">
      {/* Main Kishi Application Window */}
      <div className="win98-window main-application-window flex flex-col">
        {/* Window Title Bar */}
        <div className="win98-title-bar">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs">🛡️</span>
            <span className="truncate">
              Kishi Password Manager - [{pageNames[activePage] || 'Vault'}]
            </span>
          </div>
          <div className="win98-title-controls">
            <button className="win98-title-btn" title="Minimize">
              _
            </button>
            <button className="win98-title-btn" title="Maximize">
              □
            </button>
            <button className="win98-title-btn" title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Menu Bar & Toolbar */}
        <Header activePage={activePage} onNavigate={onNavigate} />

        {/* Two-Pane Workspace */}
        <div className="p-2.5 bg-[#c0c0c0] flex flex-col md:flex-row gap-2.5 flex-1 min-h-[620px]">
          {/* Left Tree Pane */}
          <Sidebar activePage={activePage} onNavigate={onNavigate} />

          {/* Right Content Pane */}
          <main className="flex-1 min-w-0 flex flex-col">
            {children}
          </main>
        </div>

        {/* Classic Windows Status Bar */}
        <div className="win98-status-bar">
          <div className="win98-status-segment flex-1">
            Ready
          </div>
          <div className="win98-status-segment w-28 text-center">
            {isUnlocked ? `${entries.length} items` : 'Vault Locked'}
          </div>
          <div className="win98-status-segment w-40 text-center">
            {isUnlocked ? 'AES-256-GCM' : 'Locked'}
          </div>
          <div className="win98-status-segment w-36 text-center">
            Auto-lock: {autoLockMinutes}m
          </div>
          <div className="win98-status-segment w-44 truncate">
            {user?.email || 'User'}
          </div>
        </div>
      </div>
    </div>
  );
}
