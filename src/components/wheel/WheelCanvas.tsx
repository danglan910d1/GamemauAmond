import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PRIZES, PrizeItem, ASSETS } from '../../types';
import { getPreloadedImage } from '../../utils/assetLoader';

export interface WheelCanvasProps {
  currentRotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  size?: number; // Đường kính linh hoạt (px), tự động thu phóng theo màn hình
  isReady?: boolean;
  isOutOfStock?: boolean;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  currentRotation,
  isSpinning,
  onSpin,
  size = 316,
  isReady = true,
  isOutOfStock = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<{ [key: number]: HTMLImageElement }>({});
  const [ledPhase, setLedPhase] = useState<number>(0);

  // Hiệu ứng đèn LED viền chớp chớp luân phiên rực rỡ (chớp cực nhanh khi đang quay)
  useEffect(() => {
    const interval = isSpinning ? 110 : 450;
    const timer = setInterval(() => {
      setLedPhase((prev) => (prev + 1) % 2);
    }, interval);
    return () => clearInterval(timer);
  }, [isSpinning]);

  // Nạp ảnh giải thưởng từ bộ nhớ đệm tải trước (100% đầy đủ ngay từ khung hình đầu tiên)
  useEffect(() => {
    PRIZES.forEach((p) => {
      if (p.imgSrc) {
        const cached = getPreloadedImage(p.imgSrc);
        if (cached && cached.complete) {
          loadedImagesRef.current[p.id] = cached;
        } else {
          const img = new Image();
          img.src = p.imgSrc;
          img.onload = () => {
            loadedImagesRef.current[p.id] = img;
            drawWheel();
          };
        }
      }
    });
    drawWheel();
  }, []);

  // Nan quạt phối màu đồng điệu cùng màu nền (Kem sữa Almond & Vàng hoàng kim), làm nổi bật sản phẩm quà tặng
  const SLICE_STYLES = [
    { bg: '#ffffff', line: '#d97706' }, // 1. Kem sữa Almond ngọc trai
    { bg: '#fef3c7', line: '#d97706' }, // 2. Vàng hoàng kim ấm áp
    { bg: '#fffdf5', line: '#d97706' }, // 3. Kem sữa Almond
    { bg: '#fef3c7', line: '#d97706' }, // 4. Vàng hoàng kim ấm áp
    { bg: '#ffffff', line: '#d97706' }, // 5. Kem sữa Almond ngọc trai
    { bg: '#fef3c7', line: '#d97706' }, // 6. Vàng hoàng kim ấm áp
    { bg: '#fffdf5', line: '#d97706' }, // 7. Kem sữa Almond
    { bg: '#fef3c7', line: '#d97706' }, // 8. Vàng hoàng kim ấm áp
    { bg: '#ffffff', line: '#d97706' }, // 9. Kem sữa Almond ngọc trai
    { bg: '#fef3c7', line: '#d97706' }, // 10. Vàng hoàng kim ấm áp
  ];

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width / 2 - 4; // Bán kính ngoài cùng
    const rimWidth = 14; // Độ dày vành kim loại
    const wheelRadius = outerRadius - rimWidth; // Bán kính mặt nan quạt
    const sliceCount = PRIZES.length;
    const sliceAngle = (2 * Math.PI) / sliceCount;

    ctx.clearRect(0, 0, width, height);

    // 1. VẼ 10 NAN QUẠT VỚI GRADIENT & ĐỔ BÓNG (Đồng điệu tông màu kem vàng cùng nền)
    PRIZES.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const style = SLICE_STYLES[i % SLICE_STYLES.length];

      ctx.save();

      // Vẽ hình quạt
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
      ctx.closePath();

      // Màu nền nan quạt: Radial gradient sang trọng đồng điệu cùng màu nền
      const midAngle = startAngle + sliceAngle / 2;
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        30,
        centerX + Math.cos(midAngle) * wheelRadius * 0.85,
        centerY + Math.sin(midAngle) * wheelRadius * 0.85,
        wheelRadius
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, style.bg);
      grad.addColorStop(1, style.bg === '#ffffff' ? '#fffbeb' : '#fde68a');
      ctx.fillStyle = grad;
      ctx.fill();

      // Viền chia nan quạt bằng sợi vàng kim loại sắc sảo
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Đổ bóng góc quạt tạo rãnh 3D
      ctx.shadowColor = 'rgba(74, 29, 15, 0.18)';
      ctx.shadowBlur = 5;
      ctx.stroke();

      ctx.restore();
    });

    // 2. VẼ HÌNH ẢNH SẢN PHẨM PHẦN QUÀ
    PRIZES.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(midAngle);

      const img = loadedImagesRef.current[prize.id];

      if (img && img.complete) {
        ctx.save();
        // Căn vị trí sản phẩm nằm cân đối, thanh thoát và lớn hơn giữa nan quạt
        ctx.translate(wheelRadius * 0.65, 0);
        ctx.rotate(Math.PI / 2);

        // Kích thước ảnh sản phẩm phần quà to rõ, nổi bật hơn
        const maxImgWidth = 92;
        const maxImgHeight = 124;
        const imgAspect = img.width / img.height;
        let drawW = maxImgWidth;
        let drawH = drawW / imgAspect;
        if (drawH > maxImgHeight) {
          drawH = maxImgHeight;
          drawW = drawH * imgAspect;
        }

        // Đổ bóng 3D sắc nét làm nổi bật sản phẩm khỏi nền nan quạt
        ctx.shadowColor = 'rgba(50, 15, 0, 0.48)';
        ctx.shadowBlur = 9;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3.5;

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        // Fallback: Chấm tròn gradient sang trọng
        ctx.save();
        ctx.translate(wheelRadius * 0.70, 0);
        const dotGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
        dotGrad.addColorStop(0, '#fef08a');
        dotGrad.addColorStop(0.6, '#d97706');
        dotGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    });

    // 3. VÀNH KIM LOẠI ĐỒNG BỌC NGOÀI NAN QUẠT
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius - 2, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
    ctx.restore();

    // 4. TRỤ TÂM VÒNG QUAY (Center Axle Mount)
    ctx.save();
    const centerRimGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      32,
      centerX,
      centerY,
      56
    );
    centerRimGrad.addColorStop(0, '#fef08a');
    centerRimGrad.addColorStop(0.4, '#d97706');
    centerRimGrad.addColorStop(0.8, '#78350f');
    centerRimGrad.addColorStop(1, '#b45309');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
    ctx.fillStyle = centerRimGrad;
    ctx.shadowColor = 'rgba(74, 29, 15, 0.45)';
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#92400e';
    ctx.stroke();

    ctx.restore();
  }, [SLICE_STYLES]);

  // Các kích thước thu phóng tỉ lệ theo `size` (Tâm vòng quay to & nổi bật)
  const wheelSize = size;
  const canvasSize = Math.round(wheelSize * 0.91);
  const hubSize = Math.max(72, Math.round(wheelSize * 0.29));
  const auraSize = wheelSize + 14;
  const radius = wheelSize / 2 - 6;
  const centerCoord = wheelSize / 2;
  const dotSize = Math.max(6, Math.round(wheelSize * 0.032));

  const pointerW = Math.max(22, Math.round(wheelSize * 0.095));
  const pointerH = Math.max(30, Math.round(wheelSize * 0.135));

  return (
    <div
      className="relative flex items-center justify-center shrink-0 select-none"
      style={{ width: auraSize, height: auraSize }}
    >
      {/* Vòng hào quang phát sáng vàng gold lung linh */}
      <div
        className="absolute rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-300/20 to-rose-400/25 blur-xl pointer-events-none animate-pulseGlow"
        style={{ width: auraSize, height: auraSize }}
      />

      {/* Vành Bezel ngoài cùng bọc vàng kim loại 3D & 24 bóng LED ngọc trai - Nhấn vào bất kỳ đâu là quay */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Nhấn để quay thưởng Almond Koka"
        onClick={(e) => {
          if (!isSpinning && isReady && !isOutOfStock) {
            onSpin();
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isSpinning && isReady && !isOutOfStock) {
            e.preventDefault();
            onSpin();
          }
        }}
        style={{ width: wheelSize, height: wheelSize }}
        className={`relative rounded-full p-2 bg-gradient-to-b from-[#fef08a] via-[#d97706] to-[#78350f] shadow-[0_10px_30px_-5px_rgba(74,29,15,0.45),inset_0_2px_5px_rgba(255,255,255,0.7)] flex items-center justify-center border-2 border-[#fef08a] transition-all select-none ${
          isSpinning || !isReady || isOutOfStock ? 'cursor-not-allowed opacity-95' : 'cursor-pointer hover:brightness-105 active:scale-95'
        }`}
      >
        {/* 24 Bóng đèn LED ngọc trai phát sáng chớp chớp luân phiên (Casino Carnival Style) */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * (Math.PI * 2);
            const x = centerCoord + radius * Math.cos(angle) - dotSize / 2;
            const y = centerCoord + radius * Math.sin(angle) - dotSize / 2;
            const isGold = i % 2 === 0;
            const isLit = isGold ? ledPhase === 0 : ledPhase === 1;

            return (
              <div
                key={i}
                className={`absolute rounded-full border border-amber-900/30 transition-all duration-150 ${
                  isGold
                    ? isLit
                      ? 'bg-gradient-to-tr from-amber-300 via-yellow-100 to-white shadow-[0_0_10px_#fef08a,0_0_16px_#eab308] scale-110 opacity-100 z-10'
                      : 'bg-amber-600/70 shadow-none scale-90 opacity-40'
                    : isLit
                      ? 'bg-gradient-to-tr from-rose-500 via-rose-300 to-white shadow-[0_0_10px_#fb7185,0_0_16px_#e11d48] scale-110 opacity-100 z-10'
                      : 'bg-rose-900/70 shadow-none scale-90 opacity-40'
                }`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                }}
              />
            );
          })}
        </div>

        {/* Kim chỉ 3D Hoàng Gia (Pointer Arrow) tại 12 giờ */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-[0_4px_8px_rgba(74,29,15,0.65)] pointer-events-none"
          style={{ top: `-${Math.round(pointerH * 0.35)}px` }}
        >
          <div className="relative flex flex-col items-center">
            {/* Đĩa chốt vàng đỉnh kim */}
            <div
              className="rounded-full bg-gradient-to-tr from-[#b45309] via-[#fef08a] to-[#d97706] border border-[#fef08a] shadow-md flex items-center justify-center z-10"
              style={{
                width: `${Math.round(pointerW * 0.65)}px`,
                height: `${Math.round(pointerW * 0.65)}px`,
                marginBottom: `-${Math.round(pointerW * 0.35)}px`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
            </div>
            {/* Mũi tên đỏ ruby viền vàng 3D nhọn sắc */}
            <div
              className="bg-gradient-to-b from-[#e60012] via-[#bc000c] to-[#780004] border-2 border-[#fef08a] shadow-lg flex items-center justify-center"
              style={{
                width: `${pointerW}px`,
                height: `${pointerH}px`,
                clipPath: 'polygon(50% 100%, 0% 15%, 20% 0%, 80% 0%, 100% 15%)',
              }}
            >
              {/* Vạch sáng ánh kim giữa mũi tên */}
              <div className="w-0.5 h-4 bg-gradient-to-b from-amber-200 to-transparent rounded-full opacity-80 -mt-1" />
            </div>
          </div>
        </div>

        {/* Khung quay Canvas (Rotating Wheel) */}
        <div
          className="relative rounded-full bg-white shadow-inner overflow-hidden flex items-center justify-center border-2 border-amber-700/50"
          style={{ width: canvasSize, height: canvasSize }}
        >
          <canvas
            ref={canvasRef}
            width={576}
            height={576}
            className="w-full h-full transform will-change-transform"
            style={{
              transition: 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)',
              transform: `rotate(${currentRotation}deg)`,
            }}
          />
        </div>

        {/* Nút bấm / Tâm bánh xe (Center Hub) với Logo Almond Koka to rõ & nổi bật thương hiệu */}
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            aria-label="Quay thưởng Almond Koka"
            disabled={isSpinning || !isReady || isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSpinning && isReady && !isOutOfStock) {
            onSpin();
          }
            }}
            style={{ width: hubSize, height: hubSize }}
            className={`rounded-full bg-gradient-to-b from-white via-[#fffdfa] to-[#fbf1e6] flex flex-col items-center justify-center p-2 shadow-[0_8px_24px_rgba(74,29,15,0.45),inset_0_2px_5px_rgba(255,255,255,1)] border-[3.5px] border-[#d97706] active:scale-95 transition-all group focus:outline-none cursor-pointer hover:brightness-105 ${
              isSpinning || !isReady || isOutOfStock ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer hover:brightness-105 animate-pulseSlow'
            }`}
          >
            {/* Vòng viền vàng chỉ mỏng bên trong */}
            <div className="w-full h-full rounded-full border-2 border-amber-300/80 p-1 flex items-center justify-center bg-white shadow-inner relative">
              <img
                src={ASSETS.almondKokaLogo}
                alt="Almond Koka"
                className={`w-full h-full object-contain filter drop-shadow-sm scale-110 transition-opacity ${
                  !isReady ? 'opacity-30' : 'opacity-100'
                }`}
              />
              {isOutOfStock ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#451a03]/90 rounded-full text-white p-1 text-center">
                  <span className="material-symbols-outlined text-[18px] text-amber-300">lock</span>
                  <span className="text-[7px] font-black text-amber-200 uppercase leading-none mt-0.5">Chưa có kho</span>
                </div>
              ) : !isReady ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-full">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[7.5px] font-bold text-amber-800 mt-0.5 uppercase tracking-tight">Tải kho...</span>
                </div>
              ) : null}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WheelCanvas;
