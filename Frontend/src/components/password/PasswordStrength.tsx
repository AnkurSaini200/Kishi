import { analyzePassword } from '../../utils/passwordAnalysis';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) {
    return null;
  }

  const result = analyzePassword(password);

  const blockCount = {
    'Very Weak': 1,
    Weak: 2,
    Medium: 3,
    Strong: 4,
    'Very Strong': 5,
  }[result.label] || 2;

  const blockColor = {
    'Very Weak': 'bg-red-700',
    Weak: 'bg-orange-600',
    Medium: 'bg-yellow-600',
    Strong: 'bg-blue-800',
    'Very Strong': 'bg-green-700',
  }[result.label] || 'bg-blue-800';

  return (
    <div className="mt-2 text-left">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-black">Password Strength:</span>
        <span className="font-bold text-black">{result.label}</span>
      </div>

      {/* Classic Windows Segmented Progress Bar */}
      <div className="win98-sunken p-0.5 flex gap-0.5 bg-white h-4">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={`h-full flex-1 ${
              idx <= blockCount ? blockColor : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>

      {/* Status details */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-neutral-600">
        <span>Length: {result.length}</span>
        <span>Lowercase: {result.hasLowercase ? '✓' : '✗'}</span>
        <span>Uppercase: {result.hasUppercase ? '✓' : '✗'}</span>
        <span>Numbers: {result.hasNumber ? '✓' : '✗'}</span>
        <span>Symbols: {result.hasSymbol ? '✓' : '✗'}</span>
      </div>
    </div>
  );
}