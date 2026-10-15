import React, { useState } from 'react';
import { ScreenId, PrizeItem, PRIZES, ASSETS } from '../types';
import { sound } from '../sound';

interface ClaimScreenProps {
  prize: PrizeItem | null;
  onReturnWheel: () => void;
  onGoHome: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ClaimScreen: React.FC<ClaimScreenProps> = ({
  prize,
  onReturnWheel,
  onGoHome
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [voucherCode] = useState<string>(() => `GLC-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  const currentPrize = prize || PRIZES[0];

  const handleConfirm = () => {
    sound.playWin();
    setIsConfirmed(true);
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-4 pt-3 pb-safe bg-[#fdf9f3] overflow-y-auto select-none">
      {/* Top Details & Gift Card */}
      <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto shrink-0 pt-1">
        {/* Celebration pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#bc000c]/10 text-[#bc000c] border border-[#bc000c]/25 mb-2 shadow-xs">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            celebration
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wide">
            CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG!
          </span>
        </div>

        <h2 className="text-[20px] font-extrabold text-[#4a1d0f] tracking-tight leading-tight">
          Xác Nhận Đổi Quà Tại Booth
        </h2>
        <p className="text-[12px] text-[#52443d] mt-1 max-w-[310px]">
          Xuất trình màn hình xác nhận này cho PG tại gian hàng Glico để nhận phần quà của bạn.
        </p>

        {/* Gift Card */}
        <div className="w-full mt-3 p-4 rounded-3xl bg-white border border-[#e6e2dc] shadow-[0_4px_16px_rgba(74,29,15,0.06)] flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-amber-100/50 pointer-events-none" />

          {/* Photo */}
          <div className="relative w-28 h-28 rounded-2xl bg-[#fdf9f3] p-2 flex items-center justify-center border border-[#e6e2dc] shadow-inner mb-2.5">
            <img
              src={currentPrize.imgSrc || ASSETS.almondKokaUnsweetened}
              alt={currentPrize.name}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#bc000c] text-white text-[9px] font-extrabold tracking-wider">
              GLICO
            </span>
          </div>

          {/* Prize Name & Desc */}
          <h3 className="text-[16px] font-bold text-[#4a1d0f] leading-tight max-w-[280px]">
            {currentPrize.name}
          </h3>
          <p className="text-[12px] text-[#b45309] font-medium mt-0.5">
            {currentPrize.desc}
          </p>

          {/* Voucher code */}
          <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#f1ede7] border border-dashed border-amber-600/50 flex items-center gap-2">
            <span className="text-[11px] text-[#52443d]">Mã nhận quà:</span>
            <span className="text-[14px] font-extrabold text-[#4a1d0f] tracking-wider font-mono">
              {voucherCode}
            </span>
          </div>
        </div>

        {/* Booth Instruction Note */}
        <div className="w-full mt-2.5 px-3 py-2.5 rounded-xl bg-[#f7f3ed] border border-[#e6e2dc] text-left flex items-start gap-2 shadow-2xs">
          <span className="material-symbols-outlined text-[18px] text-[#bc000c] shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[11px] text-[#52443d] leading-relaxed">
            Nhân viên PG sẽ kiểm tra và nhấn nút xác nhận bên dưới sau khi trao quà trực tiếp tại booth. Vui lòng không tự ý thao tác trước.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm mx-auto space-y-2 pt-3 pb-3 shrink-0">
        {!isConfirmed ? (
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#bc000c] to-[#930007] text-white font-extrabold text-[14px] shadow-lg shadow-[#bc000c]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">done_all</span>
            <span>XÁC NHẬN ĐÃ NHẬN QUÀ</span>
          </button>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-full bg-[#15803d] text-white font-extrabold text-[14px] shadow-md flex items-center justify-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>ĐÃ HOÀN TẤT ĐỔI QUÀ TẠI BOOTH</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onReturnWheel();
            }}
            className="py-2.5 px-3 rounded-full bg-[#f1ede7] text-[#4a1d0f] font-bold text-[12.5px] border border-[#e6e2dc] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">rotate_right</span>
            <span>Về vòng quay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="py-2.5 px-3 rounded-full bg-[#4a1d0f] text-white font-bold text-[12.5px] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
