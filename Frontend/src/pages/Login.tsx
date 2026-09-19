import { useState, type FormEvent } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { isValidEmail } from '../utils/validation';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const auth = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email / Password submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await auth.login(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to sign in. Please check your credentials or backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google Authentication handler
  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await auth.loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Passkey Authentication handler
  const handlePasskeyLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await auth.loginWithPasskey();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passkey authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // SSO Authentication handler
  const handleSsoLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await auth.loginWithSso();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Single Sign-On authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="desktop-container flex items-center justify-center p-4 sm:p-8">
      {/* Authentic Windows 95/98 Logon Dialog at Original Comfortable Scale */}
      <div className="win98-window login-dialog-window">
        {/* Title Bar */}
        <div className="win98-title-bar">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>Log On to Kishi Password Manager</span>
          </div>
          <div className="win98-title-controls">
            <button className="win98-title-btn" title="Help">?</button>
            <button className="win98-title-btn" title="Close">✕</button>
          </div>
        </div>

        {/* Dialog Body - Comfortable Spacing and Readable Proportions */}
        <div className="p-6 sm:p-8 bg-[#c0c0c0] text-black text-left">
          {/* Top Banner with Retro Key Graphic */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#808080] border-b-[#ffffff] shadow-[0_1px_0_#ffffff] mb-5">
            <div className="text-5xl select-none">🗝️</div>
            <div>
              <div className="font-bold text-base text-black tracking-tight">
                Kishi Password Manager
              </div>
              <p className="text-xs text-black mt-0.5">
                Your passwords. Under your protection. Please log on to access your encrypted vault.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 border border-red-800 bg-red-100 text-red-900 text-xs font-bold flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Credentials Groupbox */}
            <div className="win98-groupbox">
              <span className="win98-groupbox-legend">
                User Credentials
              </span>

              <div className="space-y-3.5 pt-1">
                <Input
                  label="User Name / Email:"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-normal text-black">
                      Master Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="win98-btn !px-2 !py-0.5 text-xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account master password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="win98-input w-full font-mono text-sm"
                    required
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs text-black cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={(e) => setRememberEmail(e.target.checked)}
                    />
                    <span>Remember my user name on this computer</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Log On Button */}
            <div className="pt-1 flex items-center justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full sm:w-auto px-8"
              >
                Log On / Unlock Vault
              </Button>
            </div>
          </form>

          {/* Alternate Authentication Providers Groupbox */}
          <div className="win98-groupbox mt-5">
            <span className="win98-groupbox-legend">
              Alternate Authentication Methods
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Google Authentication */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="win98-btn py-2 px-3 text-xs flex items-center justify-center gap-2 font-normal"
                title="Log on using Google Account"
              >
                <span className="font-bold text-blue-900">G</span>
                <span>Google</span>
              </button>

              {/* Passkey Authentication */}
              <button
                type="button"
                onClick={handlePasskeyLogin}
                disabled={isLoading}
                className="win98-btn py-2 px-3 text-xs flex items-center justify-center gap-2 font-normal"
                title="Log on using WebAuthn / Passkey"
              >
                <span>🔑</span>
                <span>Passkey</span>
              </button>

              {/* Enterprise SSO */}
              <button
                type="button"
                onClick={handleSsoLogin}
                disabled={isLoading}
                className="win98-btn py-2 px-3 text-xs flex items-center justify-center gap-2 font-normal"
                title="Log on using Enterprise Single Sign-On"
              >
                <span>🏢</span>
                <span>Enterprise SSO</span>
              </button>
            </div>
          </div>

          {/* Create Account / New User Option */}
          <div className="mt-5 pt-4 border-t border-[#808080] border-t-[#ffffff] shadow-[0_1px_0_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-black">
              Don't have a Kishi master account yet?
            </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="win98-btn font-normal text-xs px-4"
            >
              Create New Account...
            </button>
          </div>

          {/* Security Architecture Verification */}
          <div className="mt-4 text-center text-[11px] text-black">
            Protected with zero-knowledge client-side encryption • PBKDF2-SHA-256 & AES-256-GCM
          </div>
        </div>
      </div>
    </div>
  );
}
