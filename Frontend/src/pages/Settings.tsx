import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useVaultCrypto } from '../contexts/VaultCryptoContext';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import {
  AUTO_LOCK_OPTIONS,
  CLIPBOARD_TIMEOUT_OPTIONS,
  APP_NAME,
  APP_TAGLINE,
} from '../utils/constants';

export function Settings() {
  const { user, logout } = useAuthContext();
  const {
    isUnlocked,
    lock,
    autoLockTimeout,
    setAutoLockTimeout,
  } = useVaultCrypto();

  const [activeTab, setActiveTab] = useState<'security' | 'account' | 'about'>('security');

  const [clipboardTimeout, setClipboardTimeout] = useState<number>(() => {
    const saved = localStorage.getItem('kishi_clipboard_timeout_ms');
    return saved ? parseInt(saved, 10) : 30000;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAutoLockChange = (timeoutMs: number) => {
    setAutoLockTimeout(timeoutMs);
    setToastMessage('Auto-lock timeout updated');
  };

  const handleClipboardTimeoutChange = (timeoutMs: number) => {
    setClipboardTimeout(timeoutMs);
    localStorage.setItem('kishi_clipboard_timeout_ms', timeoutMs.toString());
    setToastMessage('Clipboard auto-clear timeout updated');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 text-left">
      {/* Classic Windows Tab Header */}
      <div className="flex items-center gap-1 select-none pl-1 border-b border-[#808080] mb-3">
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1 text-[11px] font-normal cursor-pointer ${
            activeTab === 'security'
              ? 'win98-tab-active'
              : 'win98-tab-inactive'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-3 py-1 text-[11px] font-normal cursor-pointer ${
            activeTab === 'account'
              ? 'win98-tab-active'
              : 'win98-tab-inactive'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-3 py-1 text-[11px] font-normal cursor-pointer ${
            activeTab === 'about'
              ? 'win98-tab-active'
              : 'win98-tab-inactive'
          }`}
        >
          About
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'security' && (
        <div className="space-y-3">
          <div className="win98-groupbox">
            <span className="win98-groupbox-legend">
              Inactivity & Clipboard Settings
            </span>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] text-black mb-1">
                  Inactivity Auto-Lock:
                </label>
                <select
                  value={autoLockTimeout}
                  onChange={(e) => handleAutoLockChange(Number(e.target.value))}
                  className="win98-input w-full max-w-xs"
                >
                  {AUTO_LOCK_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-600 mt-0.5">
                  Purges master password and decrypted credentials from memory after inactivity.
                </p>
              </div>

              <div>
                <label className="block text-[11px] text-black mb-1">
                  Clipboard Auto-Clear Timeout:
                </label>
                <select
                  value={clipboardTimeout}
                  onChange={(e) => handleClipboardTimeoutChange(Number(e.target.value))}
                  className="win98-input w-full max-w-xs"
                >
                  {CLIPBOARD_TIMEOUT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-600 mt-0.5">
                  Overwrites system clipboard automatically after copying passwords.
                </p>
              </div>
            </div>
          </div>

          {isUnlocked && (
            <div className="win98-groupbox">
              <span className="win98-groupbox-legend">
                Vault Lock
              </span>
              <div className="flex items-center justify-between p-1">
                <div>
                  <div className="font-bold text-[11px] text-black">
                    Lock Vault Now
                  </div>
                  <p className="text-[10px] text-neutral-600">
                    Immediately purge master key from memory.
                  </p>
                </div>
                <button
                  onClick={lock}
                  className="win98-btn font-bold text-red-800"
                >
                  Lock Vault
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'account' && (
        <div className="win98-groupbox">
          <span className="win98-groupbox-legend">
            User Account Details
          </span>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] text-neutral-600">
                Logged in as:
              </label>
              <div className="win98-sunken p-1.5 font-mono text-[11px] bg-white text-black max-w-sm">
                {user?.email || 'User'}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                onClick={logout}
              >
                Sign Out of Kishi
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="win98-groupbox">
          <span className="win98-groupbox-legend">
            System & Cryptography Information
          </span>

          <div className="space-y-2 pt-1 text-[11px]">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-300">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-bold text-black">{APP_NAME} Password Manager</div>
                <div className="text-[10px] text-neutral-600">{APP_TAGLINE}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="win98-sunken p-2 bg-white">
                <span className="text-[10px] font-bold uppercase text-neutral-600 block">Key Derivation</span>
                <span className="font-bold text-black">PBKDF2-SHA-256</span>
                <p className="text-[10px] text-neutral-600 mt-0.5">600,000 iterations, 16-byte random salt.</p>
              </div>

              <div className="win98-sunken p-2 bg-white">
                <span className="text-[10px] font-bold uppercase text-neutral-600 block">Encryption</span>
                <span className="font-bold text-black">AES-256-GCM</span>
                <p className="text-[10px] text-neutral-600 mt-0.5">Authenticated encryption, 12-byte random IV.</p>
              </div>
            </div>

            <div className="text-[10px] text-neutral-600 pt-1">
              Engine: Web Crypto API (Client-side in-memory execution)
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
