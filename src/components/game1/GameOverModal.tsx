// GamemauAmond/src/components/game1/GameOverModal.tsx
import React from 'react';
import { ASSETS } from '../../types';
import Button from '../ui/Button';
import { SpriteDef } from './config';

export interface GameOverModalProps {
  isOpen: boolean;
  onGoHome: () => void;
  hitObstacle?: SpriteDef | null;
}

/**
 * Popup THẤT BẠI – Đúng chuẩn thiết kế:
 * - Visual: Huy hiệu chướng ngại vật thật bên trái (kèm dấu ✕ đỏ) + Hộp sữa Almond Koka bên phải.
 * - Chip: "ÔI! BẠN ĐÃ CHẠM PHẢI: {TÊN}" theo đúng typography chip màn hình chào.
 * - Tiêu đề chính: "Hãy uống 1 ly Almond Koka và quay lại nhé!"
 * - Nút CTA duy nhất: "VỀ TRANG CHỦ" (không cho chơi lại).
 */
export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onGoHome, hitObstacle }) => {
  if (!isOpen) return null;

  const obstacleLabel = hitObstacle?.label || 'ĐẬU NÀNH';
  const obstacleSrc = hitObstacle?.src || ASSETS.obstacleSoybean;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#fdfbf7] rounded-[36px] p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp">
        {/* Visual đỉnh: Huy hiệu chướng ngại vật (trái) + Hộp sữa Almond Koka (phải) đúng Hình 1 */}
        <div className="relative flex items-center justify-center gap-2 mb-3 w-full">
          {/* Huy hiệu chướng ngại vật thật + dấu ✕ đỏ */}
          <div className="relative shrink-0">
            <img
              src={obstacleSrc}
              alt={obstacleLabel}
              className="w-24 h-24 sm:w-26 sm:h-26 object-contain drop-shadow-md"
            />
            {/* Dấu ✕ đỏ gắn góc trên bên phải của huy hiệu */}
            <div className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#dc2626] border-2 border-white text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[17px] sm:text-[19px] font-black leading-none">
                close
              </span>
            </div>
          </div>

          {/* Hộp sữa Almond Koka 180ml */}
          <div className="relative shrink-0">
            <img
              src={ASSETS.almondKokaOriginal}
              alt="Almond Koka 180ml"
              className="h-32 sm:h-36 w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Chip thông báo: Style đồng bộ với chip hộp sữa ở màn hình chào */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#fee2e2] border border-[#fca5a5] text-[#b91c1c] shadow-xs mb-3">
          <span className="typo-caption tracking-tight leading-none text-[12px] sm:text-[12.5px] font-bold uppercase">
            ÔI! BẠN ĐÃ CHẠM PHẢI: {obstacleLabel}
          </span>
        </div>

        {/* Tiêu đề chính */}
        <h2 className="font-bold text-[#3c2415] tracking-tight leading-[1.25] text-[22px] sm:text-[23px] mb-5">
          Hãy uống 1 ly<br />Almond Koka và<br />quay lại nhé!
        </h2>

        {/* Nút CTA duy nhất: VỀ TRANG CHỦ */}
        <Button
          variant="primary"
          size="lg"
          icon="home"
          iconColor="text-[#f59e0b]"
          onClick={onGoHome}
          className="w-full py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[18px] shadow-xl"
        >
          VỀ TRANG CHỦ
        </Button>
      </div>
    </div>
  );
};

export default GameOverModal;
