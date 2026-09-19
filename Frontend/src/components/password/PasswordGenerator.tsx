import { useEffect } from 'react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { useClipboard } from '../../hooks/useClipboard';
import PasswordStrength from './PasswordStrength';

interface PasswordGeneratorProps {
  onSelectPassword?: (password: string) => void;
  compact?: boolean;
}

export default function PasswordGenerator({
  onSelectPassword,
  compact = false,
}: PasswordGeneratorProps) {
  const {
    options,
    password,
    error,
    updateOption,
    generate,
  } = usePasswordGenerator();

  const { copied, copyToClipboard } = useClipboard({ clearTimeoutMs: 30000 });

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async () => {
    await copyToClipboard(password, true);
  };

  return (
    <div className={`text-left ${compact ? '' : 'p-2'}`}>
      <div className="win98-groupbox">
        <span className="win98-groupbox-legend">
          🔑 Password Generator
        </span>

        {/* Generated Password Box */}
        <div className="mb-3">
          <label className="block text-[11px] text-black mb-1">
            Generated Password:
          </label>
          <div className="flex gap-1">
            <input
              type="text"
              value={password}
              readOnly
              className="win98-input flex-1 font-mono text-[11px] select-all bg-white"
            />
            <button
              type="button"
              onClick={generate}
              className="win98-btn"
              title="Generate new password"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="win98-btn"
              title="Copy to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {onSelectPassword && (
              <button
                type="button"
                onClick={() => onSelectPassword(password)}
                className="win98-btn win98-btn-default"
              >
                Use
              </button>
            )}
          </div>

          <PasswordStrength password={password} />
        </div>

        {/* Settings Group */}
        <div className="win98-groupbox mt-3">
          <span className="win98-groupbox-legend">
            Options
          </span>

          {/* Length Slider */}
          <div className="mb-2">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span>Length:</span>
              <span className="font-bold font-mono">{options.length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) => updateOption('length', Number(e.target.value))}
              className="w-full accent-[#000080]"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
              />
              <span>Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
              />
              <span>Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
              />
              <span>Symbols (!@#$)</span>
            </label>
          </div>
        </div>

        {error && <p className="mt-2 text-[11px] text-red-700 font-bold">{error}</p>}
      </div>
    </div>
  );
}