// GamemauAmond/src/components/game1/MilkCup.tsx
import React from 'react';
import { ASSETS } from '../../types';
import { CUP_W, CUP_H, CUP_BOTTOM_OFFSET } from './config';

export interface MilkCupProps {
  cupX: number;
  caughtDrops: number;
  /** Đổi giá trị mỗi lần hứng trúng để kích hoạt hiệu ứng nảy ly */
  bumpKey?: number;
}

/** Mức sữa dâng lên (%) tương ứng với 0 -> 6 giọt */
const MILK_LEVELS_PCT = [0, 18, 36, 54, 70, 85, 100];

/**
 * Ly sữa 3D (ảnh ly-hung-sua.png) + lớp sữa vàng kem dâng lên rõ rệt bên trong theo từng giọt hứng được.
 */
export const MilkCup: React.FC<MilkCupProps> = ({ cupX, caughtDrops, bumpKey = 0 }) => {
  const safeDrops = Math.max(0, Math.min(caughtDrops, MILK_LEVELS_PCT.length - 1));
  const fillPercent = MILK_LEVELS_PCT[safeDrops];

  return (
    <div
      className="absolute pointer-events-none z-30 will-change-transform"
      style={{
        width: CUP_W,
        height: CUP_H,
        bottom: CUP_BOTTOM_OFFSET,
        left: 0,
        transform: `translateX(${cupX - CUP_W / 2}px)`,
      }}
    >
      {/* Bóng đổ dưới chân ly */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[72%] h-3.5 rounded-[50%] bg-[#2d120a]/35 blur-[3px]" />

      <div key={bumpKey} className="relative w-full h-full animate-cupBump">
        {/* 1. Ảnh ly 3D thật làm nền */}
        <img
          src={ASSETS.lyHungSua}
          alt="Ly hứng sữa Almond Koka"
          draggable={false}
          className="absolute inset-0 w-full h-full object-fill select-none drop-shadow-[0_6px_10px_rgba(45,18,10,0.35)]"
        />

        {/* 2. Lớp sữa vàng kem dâng lên rõ ràng theo từng giọt (Nằm nổi bên trong lòng ly) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            // Cắt chính xác theo lòng bên trong của ly thủy tinh (hình thang miệng rộng đáy hẹp)
            clipPath: 'polygon(8% 8%, 92% 8%, 84% 92%, 16% 92%)',
          }}
        >
          {/* Vùng sữa dâng lên từ đáy ly */}
          <div
            className="absolute inset-x-0 bottom-0 overflow-hidden"
            style={{
              height: `${fillPercent}%`,
              transition: 'height 0.45s cubic-bezier(0.34, 1.35, 0.64, 1)',
            }}
          >
            {/* Màu sữa hạt hạnh nhân béo ngậy, ấm áp */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf4] via-[#f7e5c9] to-[#deb582] opacity-95 shadow-[inset_0_2px_6px_rgba(255,255,255,0.8)]" />

            {/* Sóng sữa bề mặt bồng bềnh */}
            {safeDrops > 0 && (
              <svg
                className="absolute -top-[5px] left-0 h-[10px] w-[200%] liquid-wave filter drop-shadow-[0_1px_2px_rgba(222,181,130,0.6)]"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 5 Q12.5 0 25 5 T50 5 T75 5 T100 5 T125 5 T150 5 T175 5 T200 5 V10 H0 Z"
                  fill="#ffffff"
                />
              </svg>
            )}

            {/* Vệt ánh sáng kem sữa tự nhiên */}
            <div className="absolute left-[15%] inset-y-0 w-3 bg-gradient-to-r from-white/40 to-transparent" />
            <span className="absolute left-[28%] top-[20%] w-1.5 h-1.5 rounded-full bg-white/90 shadow-xs" />
            <span className="absolute left-[65%] top-[35%] w-1 h-1 rounded-full bg-white/80 shadow-xs" />
          </div>
        </div>

        {/* 3. Lớp phản quang thủy tinh 3D đè trên miệng và thân ly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'polygon(7% 6%, 93% 6%, 85% 93%, 15% 93%)',
          }}
        >
          {/* Ánh sáng phản chiếu kính thủy tinh chéo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default MilkCup;
