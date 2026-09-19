import { useState, type FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import PasswordGenerator from '../password/PasswordGenerator';
import PasswordStrength from '../password/PasswordStrength';
import type { VaultEntry } from '../../types/vault';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<VaultEntry, 'id'>) => Promise<void>;
}

export function AddEntryModal({ isOpen, onClose, onAdd }: AddEntryModalProps) {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setWebsite('');
    setShowGenerator(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!username.trim()) {
      setError('Username or email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        username: username.trim(),
        password,
        website: website.trim(),
        category: 'login',
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Password Entry"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        {error && (
          <div className="p-2 border border-red-800 bg-red-100 text-red-800 text-[11px] font-bold">
            {error}
          </div>
        )}

        <div className="win98-groupbox">
          <span className="win98-groupbox-legend">
            General
          </span>

          <div className="space-y-2.5">
            {/* Title */}
            <Input
              label="Item Name / Service:"
              placeholder="e.g. GitHub, Google, Banking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Username */}
            <Input
              label="User Name / Email:"
              placeholder="e.g. user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Website URL */}
            <Input
              label="Website URL (optional):"
              placeholder="e.g. https://github.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] text-black">
                  Password:
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="win98-btn !px-1.5 !py-0 text-[10px]"
                >
                  {showGenerator ? 'Hide Generator' : 'Generate...'}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter or generate password"
                  className="win98-input flex-1 font-mono text-[11px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="win98-btn !px-2 !py-0.5 text-[10px] shrink-0"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <PasswordStrength password={password} />
            </div>

            {/* Embedded Password Generator */}
            {showGenerator && (
              <div className="mt-2">
                <PasswordGenerator
                  compact
                  onSelectPassword={(generated) => {
                    setPassword(generated);
                    setShowGenerator(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dialog Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            OK
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
