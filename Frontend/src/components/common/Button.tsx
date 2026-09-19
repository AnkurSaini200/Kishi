import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Authentic Windows 95/98 button styling
  const isDefault = variant === 'primary';

  const sizePadding = {
    sm: 'px-2 py-0.5 text-[10px] min-h-[20px]',
    md: 'px-3 py-1 text-[11px] min-h-[23px]',
    lg: 'px-4 py-1.5 text-xs min-h-[26px]',
  };

  return (
    <button
      className={`win98-btn ${isDefault ? 'win98-btn-default' : ''} ${sizePadding[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-pulse font-bold text-[10px]">...</span>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
