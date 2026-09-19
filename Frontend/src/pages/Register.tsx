import { useState, type FormEvent } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import PasswordStrength from '../components/password/PasswordStrength';
import { isValidEmail } from '../utils/validation';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const { register } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Please enter a password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters in length');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="desktop-container flex items-center justify-center p-4">
      {/* Classic Windows 95/98 User Account Setup Dialog */}
      <div className="win98-window dialog-window">
        {/* Title Bar */}
        <div className="win98-title-bar">
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Kishi - Create Master Account</span>
          </div>
          <div className="win98-title-controls">
            <button className="win98-title-btn" title="Help">?</button>
            <button className="win98-title-btn" title="Close" onClick={onSwitchToLogin}>✕</button>
          </div>
        </div>

        {/* Dialog Body */}
        <div className="p-4 bg-[#c0c0c0] text-black text-left">
          <div className="flex items-center gap-3 pb-3 border-b border-[#808080] border-b-[#ffffff] shadow-[0_1px_0_#ffffff] mb-3">
            <div className="text-3xl select-none">👤</div>
            <div>
              <div className="font-bold text-[12px] text-black">
                New User Account Wizard
              </div>
              <p className="text-[11px] text-black">
                Setup your master account. Your credentials will be encrypted client-side.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2 border border-red-800 bg-red-100 text-red-800 text-[11px] font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="win98-groupbox">
              <span className="win98-groupbox-legend">
                Account Information
              </span>

              <div className="space-y-2.5">
                <Input
                  label="Email Address:"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-black">
                      Master Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="win98-btn !px-1.5 !py-0 text-[10px]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a master password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="win98-input w-full font-mono"
                    required
                  />

                  <PasswordStrength password={password} />
                </div>

                <Input
                  label="Confirm Master Password:"
                  type="password"
                  placeholder="Confirm master password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="win98-btn text-[11px]"
              >
                ← Back to Sign In
              </button>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onSwitchToLogin}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
