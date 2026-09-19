import { useState } from 'react';
import { useClipboard } from '../../hooks/useClipboard';

interface PasswordFieldProps {
  value: string;
  label?: string;
  onCopySuccess?: (msg: string) => void;
}

export function PasswordField({ value, label, onCopySuccess }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { copied, copyToClipboard } = useClipboard({ clearTimeoutMs: 30000 });

  const handleCopy = async () => {
    await copyToClipboard(value, true);
    if (onCopySuccess) {
      onCopySuccess('Password copied to clipboard (will auto-clear in 30s)');
    }
  };

  const maskedValue = '•'.repeat(Math.min(Math.max(value.length, 8), 16));

  return (
    <div className="w-full text-left">
      {label && (
        <span className="block text-[11px] font-normal text-black mb-1">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        <div className="win98-input flex-1 font-mono text-[11px] select-all truncate bg-white py-1 px-1.5 h-[23px] flex items-center">
          {showPassword ? value : maskedValue}
        </div>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="win98-btn !px-2 !py-0.5 text-[10px] shrink-0"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="win98-btn !px-2 !py-0.5 text-[10px] shrink-0 font-normal"
          title="Copy password to clipboard (auto-clears in 30s)"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
