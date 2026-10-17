import React from 'react';
import { PrizeItem, StoreInfo, ASSETS } from '../../types';
import Button from '../ui/Button';

export interface WinnerModalProps {
  isOpen: boolean;
  wonPrize: PrizeItem | null;
  onGoHome: () => void;
  selectedStore?: StoreInfo | null;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  wonPrize,
  onGoHome,
  selectedStore,
}) => {
  if (!isOpen || !wonPrize) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1e0a04]/85 backdrop-blur-md flex items-center justify-center p-4 transition-opacity animate-fadeIn"
    >
      <div className="w-full max-w-[350px] sm:max-w-[380px] bg-gradient-to-b from-[#fffefc] via-[#fffdf9] to-[#fbf4ea] rounded-[36px] p-6 border-[3px] border-[#f59e0b] shadow-[0_20px_50px_rgba(65,25,4,0.5)] flex flex-col items-center text-center relative animate-scaleUp pt-4">
        {/* Hào quang vàng hoàng kim phát sáng sau khung quà */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-400/40 via-yellow-300/30 to-orange-400/30 blur-2xl pointer-events-none animate-pulseGlow" />

        {/* Logo Almond Koka nổi bật trên đỉnh */}
        <div className="w-20 h-20 -mt-14 rounded-full bg-gradient-to-b from-white via-[#fffdfa] to-[#fbf1e6] p-2 flex items-center justify-center shadow-[0_8px_20px_rgba(74,29,15,0.35)] border-[3px] border-[#d97706] mb-3 relative z-10">
          <img
            src={ASSETS.almondKokaLogo}
            alt="Almond Koka"
            className="w-full h-full object-contain filter drop-shadow-xs"
          />
        </div>

        {/* Chip chúc mừng rực rỡ */}
        <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#e60012] via-[#bc000c] to-[#99000a] text-white shadow-lg border border-white/80 mb-2.5 relative z-10">
          <span className="tracking-wider leading-none text-[13px] sm:text-[14px] font-extrabold uppercase">
            QUAY LÀ TRÚNG THƯỞNG
          </span>
        </div>

        {/* Tiêu đề Chúc mừng bạn! */}
        <h2 className="font-extrabold text-[#4a1d0f] tracking-tight leading-[1.2] text-[26px] sm:text-[28px] mb-2 drop-shadow-xs relative z-10">
          Chúc mừng bạn!
        </h2>

        {/* Khung hiển thị hình ảnh phần quà lớn hơn, đổ bóng 3D sắc nét */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white p-3 flex items-center justify-center border-2 border-[#fcd34d] shadow-[0_10px_25px_-5px_rgba(74,29,15,0.25),inset_0_2px_6px_rgba(255,255,255,1)] my-2 relative z-10">
          <img
            src={wonPrize.imgSrc || ASSETS.almondKokaOriginal}
            alt={wonPrize.name}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(74,29,15,0.35)] transition-transform hover:scale-105"
          />
        </div>

        {/* Tên quà tặng nổi bật, chữ to rõ ràng */}
        <h3 className="text-[17px] sm:text-[18.5px] font-extrabold text-[#4a1d0f] leading-snug px-2 mt-2.5 mb-6 relative z-10 drop-shadow-xs">
          {wonPrize.name}
        </h3>

        {/* Nút: VỀ TRANG CHỦ */}
        <Button
          variant="primary"
          size="lg"
          icon="home"
          iconColor="text-white"
          onClick={onGoHome}
          className="w-full py-4 uppercase font-extrabold tracking-wider text-[18px] sm:text-[19px] shadow-[0_8px_20px_rgba(217,119,6,0.4)] border border-amber-300 relative z-10"
        >
          VỀ TRANG CHỦ
        </Button>
      </div>
    </div>
  );
};

export default WinnerModal;
