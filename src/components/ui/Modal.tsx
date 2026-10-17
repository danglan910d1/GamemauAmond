// GamemauAmond/src/components/ui/Modal.tsx
import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = false,
  maxWidth = 'max-w-[340px]',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-3xl p-6 shadow-2xl border border-white/80 text-center animate-scale-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && onClose && (
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#f1ede7] text-[#4a1d0f] flex items-center justify-center hover:bg-[#e6e2dc] transition-all cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
