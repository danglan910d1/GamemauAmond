// GamemauAmond/src/components/ClaimScreen.tsx
import React, { useState } from 'react';
import { ScreenId, PrizeItem, PRIZES, ASSETS } from '../types';
import { sound } from '../sound';
import Button from './ui/Button';

interface ClaimScreenProps {
  prize: PrizeItem | null;
  onReturnWheel: () => void;
  onGoHome: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ClaimScreen: React.FC<ClaimScreenProps> = ({
  prize,
  onReturnWheel,
  onGoHome,
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [voucherCode] = useState<string>(
    () => `GLC-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );

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
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            celebration
          </span>
          <span className="typo-caption text-[11.5px] text-[#bc000c]">
            CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG!
          </span>
        </div>

        <h2 className="typo-display text-[22px] sm:text-[24px] text-[#4a2c11]">
          Xác Nhận Đổi Quà Tại Booth
        </h2>
        <p className="typo-body text-[12.5px] mt-1 max-w-[310px] leading-[1.35]">
          Xuất trình màn hình xác nhận này cho nhân viên PG tại gian hàng Glico để nhận phần quà của bạn.
        </p>

        {/* Gift Card Clean Presentation */}
        <div className="w-full mt-3 p-4 rounded-3xl bg-white border border-[#e6e2dc] shadow-[0_4px_16px_rgba(74,29,15,0.06)] flex flex-col items-center">
          {/* Exact Prize Visual (Không dùng badge rườm rà) */}
          <div className="relative w-32 h-32 rounded-2xl bg-[#fdfbf7] p-2 flex items-center justify-center border border-[#e6e2dc] shadow-inner mb-2.5">
            {currentPrize.type === 'img' && currentPrize.imgSrc ? (
              <img
                src={currentPrize.imgSrc}
                alt={currentPrize.name}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            ) : (
              // 3D Snack Box Visual for Pocky / Pretz / Pejoy
              <div
                className="w-16 h-24 rounded-lg flex flex-col items-center justify-between p-1.5 shadow-md border border-white/60 text-white"
                style={{ backgroundColor: currentPrize.boxBg || '#be123c' }}
              >
                <span className="text-[9px] font-black tracking-wider opacity-90">
                  {currentPrize.brand || 'GLICO'}
                </span>
                <div
                  className="w-10 h-6 rounded flex items-center justify-center text-[8px] font-black"
                  style={{ backgroundColor: currentPrize.barColor || '#f59e0b', color: '#4a1d0f' }}
                >
                  {currentPrize.sub || 'SNACK'}
                </div>
                <span className="text-[8px] font-bold opacity-80 truncate max-w-full">
                  {currentPrize.short}
                </span>
              </div>
            )}
          </div>

          {/* Prize Name & Desc */}
          <h3 className="typo-heading text-[17px] text-[#3c2415] max-w-[280px]">
            {currentPrize.name}
          </h3>
          <p className="typo-body text-[#b45309] font-bold text-[13px] mt-0.5 leading-[1.3]">
            {currentPrize.desc}
          </p>

          {/* Voucher Code */}
          <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#f1ede7] border border-dashed border-amber-600/50 flex items-center gap-2">
            <span className="typo-body text-[12px] text-[#6b5847]">Mã nhận quà:</span>
            <span className="text-[15px] font-black text-[#4a1d0f] tracking-wider font-mono">
              {voucherCode}
            </span>
          </div>
        </div>

        {/* Booth Instruction Note */}
        <div className="w-full mt-2.5 px-3 py-2.5 rounded-xl bg-[#f7f3ed] border border-[#e6e2dc] text-left flex items-start gap-2 shadow-2xs">
          <span className="material-symbols-outlined text-[18px] text-[#bc000c] shrink-0 mt-0.5">
            info
          </span>
          <p className="typo-body text-[12px] leading-[1.35] text-[#6b5847]">
            Nhân viên PG sẽ kiểm tra và nhấn nút xác nhận bên dưới sau khi trao quà trực tiếp tại booth. Vui lòng không tự ý thao tác trước.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm mx-auto space-y-2 pt-3 pb-3 shrink-0">
        {!isConfirmed ? (
          <Button
            variant="primary"
            size="lg"
            icon="play_arrow"
            onClick={handleConfirm}
            className="uppercase font-black tracking-widest text-[16px] sm:text-[18px] py-3.5 sm:py-4 shadow-xl"
          >
            XÁC NHẬN ĐÃ NHẬN QUÀ
          </Button>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-full bg-[#15803d] text-white font-extrabold text-[14px] shadow-md flex items-center justify-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>ĐÃ HOÀN TẤT ĐỔI QUÀ TẠI BOOTH</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="secondary"
            size="sm"
            icon="rotate_right"
            onClick={onReturnWheel}
          >
            Về vòng quay
          </Button>

          <Button
            variant="amber"
            size="sm"
            icon="home"
            onClick={onGoHome}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimScreen;
