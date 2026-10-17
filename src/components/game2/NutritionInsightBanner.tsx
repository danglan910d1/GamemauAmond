// GamemauAmond/src/components/game2/NutritionInsightBanner.tsx
import React from 'react';
import { ASSETS } from '../../types';

export interface NutritionInsightBannerProps {
  title: string;
  text: string;
  isSuccess: boolean;
}

export const NutritionInsightBanner: React.FC<NutritionInsightBannerProps> = ({
  title,
  text,
  isSuccess,
}) => {
  return (
    <div
      className={`rounded-2xl p-3.5 shadow-sm border relative overflow-hidden flex items-start gap-3 transition-all duration-300 min-h-[96px] mb-3 ${
        isSuccess ? 'bg-[#f8fbf8] border-[#2E8B57]/40' : 'bg-[#fff8f7] border-[#ba1a1a]/40'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
          isSuccess ? 'bg-[#e3f4e8] text-[#2E8B57]' : 'bg-[#ffdad6] text-[#ba1a1a]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          {isSuccess ? 'check_circle' : 'error'}
        </span>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] text-[#411904] font-bold leading-tight">{title}</span>
          <img src={ASSETS.glicoLogoRed} alt="Glico" className="h-4 w-auto object-contain" />
        </div>
        <p className="text-[12px] text-[#52443d] leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default NutritionInsightBanner;
