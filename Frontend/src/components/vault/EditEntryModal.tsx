import { useState, type FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import PasswordGenerator from '../password/PasswordGenerator';
import PasswordStrength from '../password/PasswordStrength';
import type { VaultEntry } from '../../types/vault';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: VaultEntry | null;
  onSave: (id: string, updated: Partial<VaultEntry>) => Promise<void>;
}

function EditEntryForm({
  entry,
  onClose,
  onSave,
}: {
  entry: VaultEntry;
  onClose: () => void;
  onSave: (id: string, updated: Partial<VaultEntry>) => Promise<void>;
}) {
  const [title, setTitle] = useState(entry.title);
  const [username, setUsername] = useState(entry.username);
  const [password, setPassword] = useState(entry.password);
  const [website, setWebsite] = useState(entry.website || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(entry.id, {
        title: title.trim(),
        username: username.trim(),
        password,
        website: website.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      {error && (
        <div className="p-2 border border-red-800 bg-red-100 text-red-800 text-[11px] font-bold">
          {error}
        </div>
      )}

      <div className="win98-groupbox">
        <span className="win98-groupbox-legend">
          Properties
        </span>

        <div className="space-y-2.5">
          {/* Title */}
          <Input
            label="Item Name / Service:"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Username */}
          <Input
            label="User Name / Email:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Website */}
          <Input
            label="Website URL (optional):"
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

          {/* Embedded Generator */}
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

      {/* Dialog Actions */}
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
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function EditEntryModal({
  isOpen,
  onClose,
  entry,
  onSave,
}: EditEntryModalProps) {
  if (!entry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Entry - ${entry.title}`}
      maxWidth="md"
    >
      <EditEntryForm
        key={entry.id}
        entry={entry}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}
