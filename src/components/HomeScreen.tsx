// GamemauAmond/src/components/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, PRODUCT_CAROUSEL, ASSETS } from '../types';
import { sound } from '../sound';
import Button from './ui/Button';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onStart: () => void;
}

// Kích thước gốc của ảnh nền tree-background.jpg & vị trí đáy cụm Logo + Slogan + Huy hiệu No.1
const BG_NATURAL_W = 1440;
const BG_NATURAL_H = 2560;
const BG_BRAND_BOTTOM_Y = 735; // px trên ảnh gốc (đáy chữ "từ bên trong" + huy hiệu No.1)

const NUTRITION_CARDS = [
  { key: 'vitE', icon: ASSETS.iconVitaminE, alt: 'Vitamin E', text: 'Hỗ trợ chống oxi hóa tế bào' },
  { key: 'chol', icon: ASSETS.iconZeroCholesterol, alt: '0% Cholesterol', text: 'Tốt cho tim mạch' },
  { key: 'fiber', icon: ASSETS.iconRichFiber, alt: 'Chất xơ tốt', text: 'Tốt cho tiêu hóa' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [brandSpacer, setBrandSpacer] = useState<number>(190);

  // Tính chính xác chiều cao vùng Logo trên nền (background-size: cover, position: top)
  // => Carousel luôn bắt đầu ngay dưới Slogan, không bao giờ đè lên chữ ALMOND KOKA.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const compute = () => {
      const { clientWidth: w, clientHeight: h } = el;
      const scale = Math.max(w / BG_NATURAL_W, h / BG_NATURAL_H);
      setBrandSpacer(Math.round(BG_BRAND_BOTTOM_Y * scale) + 6);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Autoplay: tự động chuyển slide sau mỗi 4 giây (khoảng 3-5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === PRODUCT_CAROUSEL.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex]);

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
      ref={rootRef}
      className="relative flex-1 w-full max-w-md mx-auto flex flex-col overflow-hidden shadow-2xl select-none"
      style={{
        backgroundImage: `url(${ASSETS.treeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Reserved Area: chiều cao tính theo hình nền thực tế -> lộ trọn Logo, Slogan & Huy hiệu No.1 */}
      <div className="w-full shrink-0 pointer-events-none" style={{ height: brandSpacer }} />

      {/* Product Showcase Carousel (4 SKU chuẩn) - chiếm phần còn lại, không tràn lên vùng Logo */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center px-2 pb-1.5">
        {/* Arrow Left */}
        <button
          type="button"
          aria-label="Sản phẩm trước"
          onClick={prevProduct}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#4a1d0f] shadow-lg border border-[#e3d0bf] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">chevron_left</span>
        </button>

        {/* Carton Image: 4 SKU cùng chiều cao hiển thị (1L chỉ lấy mặt trước) */}
        <div className="relative flex-1 min-h-0 w-full">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-white/30 blur-2xl pointer-events-none" />
          <img
            key={currentProduct.id}
            src={currentProduct.image}
            alt={currentProduct.name}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full max-h-[260px] w-auto max-w-[70%] object-contain object-bottom filter drop-shadow-[0_14px_20px_rgba(74,29,15,0.3)] transition-opacity duration-300"
          />
        </div>

        {/* Product Pill Tag (chip mảnh, height nhỏ gọn) */}
        <div
          className={`mt-1.5 shrink-0 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full ${
            currentProduct.badgeBg || 'bg-[#0284c7]'
          } text-white shadow-md border border-white/60 transition-all duration-300`}
        >
          <span className="material-symbols-outlined text-[14px] leading-none shrink-0">
            {currentProduct.badgeIcon || 'eco'}
          </span>
          <span className="typo-caption tracking-tight leading-[1.5] text-[11.5px]">
            {currentProduct.badgeText || currentProduct.name}
          </span>
        </div>

        {/* Indicators: đổi màu tương ứng với Chip nhãn đang hiển thị */}
        <div className="flex items-center gap-2 mt-1.5 shrink-0">
          {PRODUCT_CAROUSEL.map((p, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `w-6 ${currentProduct.badgeBg || 'bg-[#0284c7]'} shadow-sm`
                    : 'w-2 bg-[#4a1d0f]/25 hover:bg-[#4a1d0f]/40'
                }`}
              />
            );
          })}
        </div>

        {/* Arrow Right */}
        <button
          type="button"
          aria-label="Sản phẩm tiếp theo"
          onClick={nextProduct}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#4a1d0f] shadow-lg border border-[#e3d0bf] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">chevron_right</span>
        </button>
      </div>

      {/* Bottom Sheet Card: CUNG CẤP DƯỠNG CHẤT MỖI NGÀY */}
      <div className="bg-white/95 backdrop-blur-md rounded-t-3xl pt-3 px-4 pb-safe border-t-2 border-[#eedecf] shadow-[0_-8px_24px_rgba(74,29,15,0.12)] shrink-0">
        <h3 className="typo-heading text-center mb-2 uppercase text-[#3c2415]">
          CUNG CẤP DƯỠNG CHẤT MỖI NGÀY
        </h3>

        {/* 3 Nutrition Cards: chữ lớn hơn & sát icon hơn */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-3">
          {NUTRITION_CARDS.map((card) => (
            <div
              key={card.key}
              className="border border-[#e3d1be] rounded-2xl px-1.5 pt-1.5 pb-2 bg-[#fdfbf7] flex flex-col items-center justify-start text-center shadow-xs hover:shadow-sm transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                <img
                  src={card.icon}
                  alt={card.alt}
                  className="w-full h-full object-contain filter drop-shadow-xs transform hover:scale-105 transition-transform"
                />
              </div>
              <span className="typo-body font-bold text-[#5c4436] text-center leading-[1.25] text-[13.5px] sm:text-[14.5px] -mt-0.5">
                {card.text}
              </span>
            </div>
          ))}
        </div>

        {/* Nút BẮT ĐẦU */}
        <Button
          variant="primary"
          size="lg"
          icon="play_arrow"
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="mb-1 py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[19px] shadow-xl"
        >
          BẮT ĐẦU
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
