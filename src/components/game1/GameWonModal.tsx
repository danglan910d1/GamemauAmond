// GamemauAmond/src/components/game1/GameWonModal.tsx
import React from 'react';
import { ASSETS } from '../../types';
import Button from '../ui/Button';

export interface GameWonModalProps {
  isOpen: boolean;
  onNextRound: () => void;
}

const NUTRITION_ITEMS = [
  { icon: ASSETS.iconVitaminE, label: '100% Vitamin E' },
  { icon: ASSETS.iconZeroCholesterol, label: '0% Cholesterol' },
  { icon: ASSETS.iconRichFiber, label: 'Giàu chất xơ' },
];

/**
 * Popup THÀNH CÔNG – Đúng chuẩn thiết kế:
 * - Hộp sữa Almond Koka nhô lên phía trên đỉnh modal (giống Hình 4).
 * - Chip: "✨ HOÀN THÀNH VÒNG 1 ✨" theo style chip màn hình chào (giống Hình 3).
 * - Tiêu đề chính: "Đã hứng đủ những giọt dinh dưỡng!" theo style text CUNG CẤP DƯỠNG CHẤT MỖI NGÀY.
 * - Khung 3 Huy hiệu Dinh Dưỡng tròn (giống Hình 3).
 * - Nút bấm: "TIẾP TỤC VÒNG 2" theo đúng style text button màn hình chào.
 */
export const GameWonModal: React.FC<GameWonModalProps> = ({ isOpen, onNextRound }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#fdfbf7] rounded-[36px] p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp pt-2">
        {/* Hộp sữa Almond Koka nổi lên trên đỉnh (giống Hình 4) */}
        <div className="relative -mt-20 mb-2 flex items-center justify-center">
          <img
            src={ASSETS.almondKokaOriginal}
            alt="Hộp sữa Almond Koka"
            className="h-32 sm:h-36 w-auto object-contain drop-shadow-2xl"
          />
          <div className="absolute -top-1 -right-2 text-2xl animate-bounce">✨</div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
        </div>

        {/* Chip kết quả màu vàng cam (giống Hình 3): Style đồng bộ chip hộp sữa màn hình chào */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-md border border-white/60 mb-3">
          <span className="typo-caption tracking-tight leading-none text-[12px] sm:text-[12.5px] font-bold uppercase">
            ✨ HOÀN THÀNH VÒNG 1 ✨
          </span>
        </div>

        {/* Tiêu đề chính */}
        <h2 className="font-bold text-[#3c2415] tracking-tight leading-[1.25] text-[22px] sm:text-[23px] mb-4">
          Đã hứng đủ những<br />giọt dinh dưỡng!
        </h2>

        {/* 3 Huy hiệu Dinh Dưỡng tròn (giống Hình 3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5 w-full">
          {NUTRITION_ITEMS.map((item) => (
            <div
              key={item.label}
              className="border border-[#eedecf] rounded-2xl p-2 bg-white flex flex-col items-center justify-between text-center min-h-[96px] shadow-xs hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <span className="typo-body font-bold text-[#5c4436] text-[12px] sm:text-[12.5px] leading-[1.25] text-center mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Nút bấm TIẾP TỤC VÒNG 2 */}
        <Button
          variant="primary"
          size="lg"
          icon="play_arrow"
          onClick={onNextRound}
          className="w-full py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[18px] shadow-xl"
        >
          TIẾP TỤC VÒNG 2
        </Button>
      </div>
    </div>
  );
};

export default GameWonModal;
