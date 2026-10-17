// GamemauAmond/src/components/game1/DropCounter.tsx
import React from 'react';

export interface DropCounterProps {
  caught: number;
  target: number;
}

/** Bộ đếm giọt dinh dưỡng đã hứng (VD: "1/6 Giọt") */
export const DropCounter: React.FC<DropCounterProps> = ({ caught, target }) => (
  <div className="flex items-center justify-center">
    <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md pl-1.5 pr-4 py-1.5 rounded-full border border-[#eedecf] shadow-sm">
      <span className="w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center shadow-inner">
        <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: '"FILL" 1' }}>
          water_drop
        </span>
      </span>
      <span className="typo-heading text-[18px] text-[#4a2c11] leading-none tabular-nums">
        {caught}/{target}
      </span>
      <span className="typo-subheading text-[14px] text-[#785947] leading-none">Giọt</span>
      {/* Chấm tiến độ 6 mốc */}
      <span className="flex items-center gap-1 ml-1">
        {Array.from({ length: target }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < caught ? 'bg-[#d97706]' : 'bg-[#e8dccf]'
            }`}
          />
        ))}
      </span>
    </div>
  </div>
);

export default DropCounter;
