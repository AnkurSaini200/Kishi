import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightElement,
    className = '',
    id,
    disabled,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-normal text-black mb-1 select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-2 flex items-center pointer-events-none text-black">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`win98-input w-full ${leftIcon ? 'pl-7' : ''} ${
            rightElement ? 'pr-12' : ''
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-1 flex items-center">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-700 font-bold">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-[10px] text-black">{hint}</p>
      )}
    </div>
  );
});
