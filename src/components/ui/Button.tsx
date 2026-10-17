// GamemauAmond/src/components/ui/Button.tsx
import React from 'react';
import { sound } from '../../sound';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'amber';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconColor?: string;
  fullWidth?: boolean;
  playAudio?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconColor,
  fullWidth = true,
  playAudio = true,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (playAudio) {
      try {
        sound.playClick();
      } catch {
        // Safe catch
      }
    }
    onClick?.(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold tracking-wide transition-all select-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-full';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs py-2 px-3 gap-1.5',
    md: 'text-sm py-3 px-5 gap-2',
    lg: 'text-base py-3.5 px-6 gap-2.5',
  };

  // Style chuẩn theo hình mẫu: Nền nâu hạt hạnh nhân (#5c2e16), viền sẫm (#3d1a0a), chữ trắng, icon vàng hổ phách (#f59e0b)
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#5c2e16] hover:bg-[#4a220e] active:bg-[#381608] text-white border-2 border-[#3d1a0a] shadow-lg shadow-[#3d1a0a]/35',
    amber:
      'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-lg shadow-[#d97706]/30 hover:brightness-105',
    secondary:
      'bg-[#f1ede7] text-[#4a1d0f] border border-[#e6e2dc] hover:bg-[#e8e2d8] shadow-xs',
    success:
      'bg-gradient-to-r from-[#15803d] to-[#166534] text-white shadow-md shadow-[#15803d]/25 hover:brightness-105',
    danger:
      'bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white shadow-md shadow-[#e11d48]/25',
    outline:
      'bg-transparent text-[#4a1d0f] border-2 border-[#5c2e16] hover:bg-[#5c2e16]/10',
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  // Icon vàng hổ phách theo đúng hình mẫu
  const resolvedIconColor = iconColor || (variant === 'primary' ? 'text-[#f59e0b]' : 'currentColor');

  return (
    <button
      type="button"
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon === 'play_arrow' || icon === 'play' ? (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 fill-[#f59e0b] shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : icon ? (
        <span
          className={`material-symbols-outlined text-[1.25em] leading-none shrink-0 ${resolvedIconColor}`}
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
