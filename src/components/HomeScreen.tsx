import React, { useState } from 'react';
import { ScreenId, PRODUCT_CAROUSEL, ASSETS } from '../types';
import { sound } from '../sound';

interface HomeScreenProps {
  onStart: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevProduct = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === 0 ? PRODUCT_CAROUSEL.length - 1 : prev - 1));
  };

  const nextProduct = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === PRODUCT_CAROUSEL.length - 1 ? 0 : prev + 1));
  };

  const currentProduct = PRODUCT_CAROUSEL[currentIndex];

  return (
    <div
      className="relative flex-1 w-full max-w-md mx-auto flex flex-col justify-between overflow-hidden shadow-2xl select-none"
      style={{
        backgroundImage: `url(${ASSETS.treeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top Header Floating Logos */}
      <div className="relative pt-4 px-4 flex flex-col items-center z-10">
        {/* Glico Logo Top Right */}
        <div className="w-full flex justify-end">
          <img
            src={ASSETS.glicoLogoRed}
            alt="Glico"
            className="h-7 w-auto object-contain filter drop-shadow-sm"
          />
        </div>

        {/* Almond Koka Japanese Logo & Slogan */}
        <div className="mt-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="font-extrabold text-[22px] tracking-tight text-[#3b190f]">
              ALMOND KOKA
            </span>
          </div>
          <span className="text-[12px] font-semibold text-[#5c3c2e] -mt-1 tracking-wider">
            アーモンド効果
          </span>

          <div className="flex items-center justify-center gap-2 mt-2">
            <h2 className="text-[26px] font-extrabold text-[#2d120a] tracking-tight drop-shadow-xs">
              Sống thanh xuân
            </h2>
            <img
              src={ASSETS.no1JapanEmblem}
              alt="No.1 Japan"
              className="h-9 w-auto object-contain filter drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Product Showcase Carousel with Left & Right Arrows */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-2">
        {/* Arrow Left */}
        <button
          type="button"
          aria-label="Sản phẩm trước"
          onClick={prevProduct}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#4a1d0f] shadow-lg border border-[#e3d0bf] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">chevron_left</span>
        </button>

        {/* Carton Image in Clean Display Stage */}
        <div className="relative flex flex-col items-center justify-center px-4 w-full">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-52 h-52 rounded-full bg-white/40 blur-2xl pointer-events-none" />
            <img
              key={currentProduct.id}
              src={currentProduct.image}
              alt={currentProduct.name}
              className="h-64 sm:h-72 w-auto object-contain filter drop-shadow-[0_16px_24px_rgba(74,29,15,0.3)] transition-all duration-300 transform hover:scale-105"
            />
          </div>

          {/* Product Pill Tag */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1b706c] text-white shadow-md border border-white/60">
            <span className="material-symbols-outlined text-[15px] text-[#86efac]">eco</span>
            <span className="text-[12px] font-bold tracking-tight">
              {currentProduct.name}
            </span>
          </div>
        </div>

        {/* Arrow Right */}
        <button
          type="button"
          aria-label="Sản phẩm tiếp theo"
          onClick={nextProduct}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#4a1d0f] shadow-lg border border-[#e3d0bf] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">chevron_right</span>
        </button>
      </div>

      {/* Bottom Sheet Card: Cung Cấp Dưỡng Chất Mỗi Ngày */}
      <div className="bg-white/95 backdrop-blur-md rounded-t-3xl pt-4 px-4 pb-safe border-t-2 border-[#eedecf] shadow-[0_-8px_24px_rgba(74,29,15,0.12)] shrink-0">
        <h3 className="text-center font-extrabold text-[15px] text-[#3d180c] tracking-tight uppercase mb-3">
          CUNG CẤP DƯỠNG CHẤT MỖI NGÀY
        </h3>

        {/* 3 Nutrition Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Box 1: Chống oxi hoá */}
          <div className="border border-[#e3d1be] rounded-2xl p-2.5 bg-[#fdfbf7] flex flex-col items-center justify-between text-center min-h-[92px] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#fff4e5] border border-[#f59e0b]/40 flex items-center justify-center text-[#d97706] mb-1">
              <span className="text-[11px] font-black leading-none">VIT</span>
              <span className="text-[9px] font-black text-[#b45309]">E</span>
            </div>
            <span className="text-[11px] font-bold text-[#4a1d0f] leading-snug">
              Hỗ trợ chống oxi hóa tế bào
            </span>
          </div>

          {/* Box 2: Tốt cho tim mạch */}
          <div className="border border-[#e3d1be] rounded-2xl p-2.5 bg-[#fdfbf7] flex flex-col items-center justify-between text-center min-h-[92px] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#fee2e2] border border-[#ef4444]/40 flex items-center justify-center text-[#e60012] mb-1">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <span className="text-[11px] font-bold text-[#4a1d0f] leading-snug">
              Tốt cho tim mạch
            </span>
          </div>

          {/* Box 3: Tốt cho tiêu hóa (Chất xơ tốt) */}
          <div className="border border-[#e3d1be] rounded-2xl p-2.5 bg-[#fdfbf7] flex flex-col items-center justify-between text-center min-h-[92px] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#fef3c7] border border-[#d97706]/40 flex flex-col items-center justify-center text-[#78350f] mb-1">
              <span className="text-[7.5px] font-black uppercase leading-tight">CHẤT</span>
              <span className="text-[9px] font-black leading-none text-[#b45309]">XƠ</span>
            </div>
            <span className="text-[11px] font-bold text-[#4a1d0f] leading-snug">
              Tốt cho tiêu hóa
            </span>
          </div>
        </div>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#5c2e16] hover:bg-[#482310] active:bg-[#341609] text-white font-extrabold text-[17px] shadow-[0_5px_0_#2b1008] active:translate-y-0.5 active:shadow-[0_2px_0_#2b1008] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <span className="material-symbols-outlined text-[20px] text-[#fef08a]" style={{ fontVariationSettings: '"FILL" 1' }}>
            play_arrow
          </span>
          <span className="tracking-wide uppercase">BẮT ĐẦU</span>
        </button>
      </div>
    </div>
  );
};
