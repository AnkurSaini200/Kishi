import { useAuthContext } from '../../contexts/AuthContext';
import { useVaultCrypto } from '../../contexts/VaultCryptoContext';
import type { AppPage } from './Sidebar';

interface HeaderProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  onAddNew?: () => void;
}

export function Header({ activePage, onNavigate, onAddNew }: HeaderProps) {
  const { logout } = useAuthContext();
  const { isUnlocked, lock } = useVaultCrypto();

  return (
    <div className="select-none">
      {/* Classic Windows Menu Bar */}
      <div className="win98-menubar">
        <div className="win98-menu-item">
          <u>F</u>ile
        </div>
        <div className="win98-menu-item">
          <u>E</u>dit
        </div>
        <div className="win98-menu-item">
          <u>V</u>iew
        </div>
        <div
          className="win98-menu-item"
          onClick={() => onNavigate('vault')}
        >
          <u>V</u>ault
        </div>
        <div
          className="win98-menu-item"
          onClick={() => onNavigate('generator')}
        >
          <u>T</u>ools
        </div>
        <div
          className="win98-menu-item"
          onClick={() => onNavigate('settings')}
        >
          <u>H</u>elp
        </div>
      </div>

      {/* Classic Windows Toolbar */}
      <div className="win98-toolbar">
        {/* New Item */}
        <button
          onClick={onAddNew || (() => onNavigate('vault'))}
          className="win98-btn flex items-center gap-1 font-normal text-[11px]"
          title="Add New Password Entry"
        >
          <span className="text-xs">➕</span>
          <span>New Entry</span>
        </button>

        {/* Lock Vault */}
        {isUnlocked && (
          <button
            onClick={lock}
            className="win98-btn flex items-center gap-1 font-normal text-[11px]"
            title="Lock Vault Immediately"
          >
            <span className="text-xs">🔒</span>
            <span>Lock</span>
          </button>
        )}

        <div className="win98-toolbar-separator" />

        {/* Quick Nav: All Items */}
        <button
          onClick={() => onNavigate('vault')}
          className={`win98-btn flex items-center gap-1 text-[11px] ${
            activePage === 'vault' ? 'active font-bold' : ''
          }`}
        >
          <span>📁</span>
          <span>Vault</span>
        </button>

        {/* Quick Nav: Security Health */}
        <button
          onClick={() => onNavigate('security')}
          className={`win98-btn flex items-center gap-1 text-[11px] ${
            activePage === 'security' ? 'active font-bold' : ''
          }`}
        >
          <span>🛡️</span>
          <span>Audit</span>
        </button>

        {/* Quick Nav: Generator */}
        <button
          onClick={() => onNavigate('generator')}
          className={`win98-btn flex items-center gap-1 text-[11px] ${
            activePage === 'generator' ? 'active font-bold' : ''
          }`}
        >
          <span>🔑</span>
          <span>Generator</span>
        </button>

        {/* Quick Nav: Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className={`win98-btn flex items-center gap-1 text-[11px] ${
            activePage === 'settings' ? 'active font-bold' : ''
          }`}
        >
          <span>⚙️</span>
          <span>Options</span>
        </button>

        <div className="win98-toolbar-separator" />

        {/* Logout */}
        <button
          onClick={logout}
          className="win98-btn flex items-center gap-1 text-[11px] ml-auto"
          title="Sign out of Kishi"
        >
          <span>🚪</span>
          <span>Logoff</span>
        </button>
      </div>
    </div>
  );
}
