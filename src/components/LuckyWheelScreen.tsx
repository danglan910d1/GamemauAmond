import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { ScreenId, PRIZES, PrizeItem, ASSETS, StoreInfo } from "../types";
import { APPS_SCRIPT_URL } from "../config";
import { sound } from "../sound";
import WheelCanvas from "./wheel/WheelCanvas";
import WinnerModal from "./wheel/WinnerModal";

interface LuckyWheelScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onGoHome?: () => void;
  onClaimPrize?: (prize: PrizeItem) => void;
  selectedStore?: StoreInfo | null;
}

export const LuckyWheelScreen: React.FC<LuckyWheelScreenProps> = ({
  onNavigate,
  onGoHome,
  selectedStore,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [spinsAvailable, setSpinsAvailable] = useState<number>(1);
  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(() => {
    return typeof window !== "undefined" && window.location.hash === "#winner"
      ? PRIZES[0]
      : null;
  });
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.location.hash === "#winner";
  });

  // Khóa đồng bộ chặn đứng mọi khả năng quay trùng/kép trong cùng 1 chu kỳ sự kiện
  const isSpinningRef = useRef<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    chipTop: number;
    chipFontSize: number;
    wheelCenterY: number;
    wheelSize: number;
  }>({
    chipTop: 230,
    chipFontSize: 12,
    wheelCenterY: 480,
    wheelSize: 340,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const cW = el.clientWidth || 390;
      const cH = el.clientHeight || 750;

      // wheel-bg-new.png kích thước gốc 768 x 1376
      // Hiển thị dạng background-size: cover, background-position: center top
      const scale = Math.max(cW / 768, cH / 1376);

      // Đáy slogan "Sống thanh xuân từ bên trong": Y ≈ 375 px trên ảnh gốc 768x1376
      // Chip "QUAY LÀ TRÚNG" nằm ngay bên dưới dòng chữ slogan
      const chipTop = Math.round(390 * scale);
      const chipFontSize = Math.max(11, Math.min(13.5, Math.round(scale * 24)));
      const chipBottom = chipTop + 28;

      // Đỉnh của dải cong màu vàng "Cả Nhà Cùng Yêu" ở đáy: Y ≈ 1095 px trên ảnh gốc 768x1376
      const goldTop = Math.min(cH, Math.round(1095 * scale));

      // Khoảng chiều cao khả dụng giữa đáy chip và đỉnh dải màu vàng dưới cùng
      const availableHeight = Math.max(260, goldTop - 8 - (chipBottom + 8));

      // Kim chỉ (pointer) tại 12h nhô lên khỏi mép trên vòng quay khoảng 5%
      // Kích thước vòng quay: BỰ, nằm gọn giữa chip bên trên và dải màu vàng bên dưới
      const maxWheelByHeight = Math.floor(availableHeight / 1.05);
      const targetSize = Math.min(Math.round(cW * 0.92), 370);
      const wheelSize = Math.max(280, Math.min(targetSize, maxWheelByHeight));

      const pointerOverhang = Math.round(wheelSize * 0.05);
      const totalWheelH = wheelSize + pointerOverhang;
      const gap = Math.max(0, availableHeight - totalWheelH);
      const topPadding = 8 + Math.round(gap * 0.35);

      // Tâm vòng quay căn chỉnh hoàn hảo: Đỉnh kim dưới chip, đáy bánh xe nằm trên dải màu vàng
      const wheelCenterY = chipBottom + topPadding + pointerOverhang + Math.round(wheelSize / 2);

      setLayout({
        chipTop,
        chipFontSize,
        wheelCenterY,
        wheelSize,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totalStock = PRIZES.reduce((acc, p) => acc + p.stock, 0);

  const pickWinningIndex = () => {
    const random = Math.random();
    let accum = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      accum += PRIZES[i].stock / totalStock;
      if (random <= accum) return i;
    }
    return 0;
  };

  const handleSpin = () => {
    // Chặn tuyệt đối quay 2 lần do double-click hoặc sự kiện bubbling
    if (isSpinningRef.current || isSpinning || spinsAvailable <= 0) return;
    isSpinningRef.current = true;
    setIsSpinning(true);

    const winningIndex = pickWinningIndex();
    const winning = PRIZES[winningIndex];

    const sliceCount = PRIZES.length;
    const sliceDegree = 360 / sliceCount;
    const targetSliceCenter = winningIndex * sliceDegree + sliceDegree / 2;
    const stopAngle = (270 - targetSliceCenter + 360) % 360;

    const fullSpins = (6 + Math.floor(Math.random() * 2)) * 360;
    const prevNet = currentRotation % 360;
    const extraNeeded = (stopAngle - prevNet + 360) % 360;
    const delta = fullSpins + extraNeeded;

    const finalRotation = currentRotation + delta;
    setCurrentRotation(finalRotation);

    const tickInterval = setInterval(() => {
      sound.playWheelTick();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSpinsAvailable((prev) => Math.max(0, prev - 1));
      setWonPrize(winning);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      sound.playWin();

      // Gửi API ghi nhận kết quả và TRỪ TỒN KHO trên Google Sheets (chỉ 1 lần duy nhất)
      const storeIdToRecord = selectedStore?.id || 'STORE_HCM_01';
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'submitResult',
          storeId: storeIdToRecord,
          giftId: String(winning.id),
          giftName: winning.name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[LuckyWheel] Đã trừ tồn kho thành công:', data);
        })
        .catch((err) => {
          console.warn('[LuckyWheel] Lỗi trừ kho:', err);
        });

      setTimeout(() => {
        setShowWinnerModal(true);
      }, 500);
    }, 4200);
  };

  const handleGoHomeInternal = () => {
    isSpinningRef.current = false;
    sound.playClick();
    setShowWinnerModal(false);
    if (onGoHome) {
      onGoHome();
    } else {
      onNavigate("home");
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full max-w-md mx-auto overflow-hidden select-none"
      style={{
        backgroundImage: `url(${ASSETS.wheelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f6eecb",
      }}
    >
      {/* 
        1. CHIP "QUAY LÀ TRÚNG":
        - Luôn nằm ngay dưới dòng chữ "Sống thanh xuân từ bên trong"
        - Tự động co giãn theo tỉ lệ background
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
        style={{
          top: `${layout.chipTop}px`,
        }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-gradient-to-r from-[#e60012] via-[#bc000c] to-[#99000a] text-white shadow-md border border-white/80 whitespace-nowrap">
          <span
            className="font-extrabold uppercase text-white tracking-wider leading-none whitespace-nowrap"
            style={{
              fontSize: `${layout.chipFontSize}px`,
            }}
          >
            QUAY LÀ TRÚNG
          </span>
        </div>
      </div>

      {/* 
        2. VÒNG QUAY MAY MẮN:
        - Bự hơn, ôm trọn từ dưới cổ bạn nam xuống sát mép đường cong "Cả Nhà Cùng Yêu"
        - Không bao giờ đè lên chữ Slogan hay Ribbon
        - Nhấn bất kỳ vị trí nào trên vòng quay là quay
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
        style={{
          top: `${layout.wheelCenterY}px`,
        }}
      >
        <WheelCanvas
          size={layout.wheelSize}
          currentRotation={currentRotation}
          isSpinning={isSpinning}
          onSpin={handleSpin}
        />
      </div>

      {/* Winner Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        wonPrize={wonPrize}
        onGoHome={handleGoHomeInternal}
      />
    </div>
  );
};

export default LuckyWheelScreen;
