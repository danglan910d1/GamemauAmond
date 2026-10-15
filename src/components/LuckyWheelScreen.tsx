import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenId, PRIZES, PrizeItem, ASSETS } from '../types';
import { sound } from '../sound';
import confetti from 'canvas-confetti';

interface LuckyWheelScreenProps {
  onClaimPrize: (prize: PrizeItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const LuckyWheelScreen: React.FC<LuckyWheelScreenProps> = ({ onClaimPrize }) => {
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinsAvailable, setSpinsAvailable] = useState<number>(1);
  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImagesRef = useRef<{ [key: number]: HTMLImageElement }>({});

  const totalStock = PRIZES.reduce((sum, item) => sum + item.stock, 0);

  // Preload Almond Koka images for canvas
  useEffect(() => {
    PRIZES.forEach((p) => {
      if (p.type === 'img' && p.imgSrc) {
        const img = new Image();
        img.src = p.imgSrc;
        img.onload = () => {
          loadedImagesRef.current[p.id] = img;
          drawWheel();
        };
      }
    });
    drawWheel();
  }, []);

  // Draw 3D product box for Pocky/Pretz/Pejoy
  const drawProductBox = (c: CanvasRenderingContext2D, prize: PrizeItem) => {
    const w = 46;
    const h = 76;
    const x = -w / 2;
    const y = -h / 2;
    const r = 5;

    c.save();
    c.shadowColor = 'rgba(74, 29, 15, 0.35)';
    c.shadowBlur = 8;
    c.shadowOffsetY = 4;

    c.fillStyle = prize.boxBg || '#be123c';
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
    c.restore();

    c.lineWidth = 1.5;
    c.strokeStyle = 'rgba(255,255,255,0.7)';
    c.stroke();

    c.fillStyle = 'rgba(255, 255, 255, 0.25)';
    c.beginPath();
    c.roundRect(x + 2, y + 2, w - 4, 14, [4, 4, 0, 0]);
    c.fill();

    c.fillStyle = '#ffffff';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = "800 11px 'Plus Jakarta Sans', sans-serif";
    c.fillText(prize.brand || 'GLICO', 0, y + 24);

    c.fillStyle = prize.barColor || '#f59e0b';
    c.beginPath();
    c.roundRect(x + 6, y + 33, w - 12, 18, 3);
    c.fill();

    c.fillStyle = prize.stickCol || '#78350f';
    c.beginPath();
    c.roundRect(x + 10, y + 36, w - 20, 4, 2);
    c.roundRect(x + 10, y + 43, w - 20, 4, 2);
    c.fill();

    c.fillStyle = 'rgba(255, 255, 255, 0.95)';
    c.font = "800 7.5px 'Plus Jakarta Sans', sans-serif";
    c.fillText(prize.sub || '', 0, y + 62);

    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.font = "700 6px 'Plus Jakarta Sans', sans-serif";
    c.fillText('GLICO', 0, y + 9);
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 6;
    const sliceAngle = (2 * Math.PI) / PRIZES.length;

    ctx.clearRect(0, 0, width, height);

    PRIZES.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.28)';
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);

      const itemDist = radius * 0.63;
      ctx.translate(itemDist, 0);
      ctx.rotate(Math.PI / 2);

      if (prize.type === 'img' && loadedImagesRef.current[prize.id]) {
        const img = loadedImagesRef.current[prize.id];
        const imgW = 48;
        const imgH = 88;
        ctx.save();
        ctx.shadowColor = 'rgba(74, 29, 15, 0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
        ctx.restore();
      } else {
        drawProductBox(ctx, prize);
      }

      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();
  }, []);

  const pickWinningIndex = () => {
    const random = Math.random();
    let accum = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      accum += PRIZES[i].stock / totalStock;
      if (random <= accum) return i;
    }
    return 0; // Default Almond Koka
  };

  const handleSpin = () => {
    if (isSpinning) return;

    sound.playClick();
    setIsSpinning(true);

    const winningIndex = pickWinningIndex();
    const winning = PRIZES[winningIndex];

    const sliceCount = PRIZES.length;
    const sliceDegree = 360 / sliceCount;
    const targetSliceCenter = winningIndex * sliceDegree + sliceDegree / 2;
    // Pointer at 12 o'clock (270 degrees)
    const stopAngle = (270 - targetSliceCenter + 360) % 360;

    const fullSpins = (6 + Math.floor(Math.random() * 2)) * 360;
    const prevNet = currentRotation % 360;
    const extraNeeded = (stopAngle - prevNet + 360) % 360;
    const delta = fullSpins + extraNeeded;

    const finalRotation = currentRotation + delta;
    setCurrentRotation(finalRotation);

    // Audio tick pulses
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSpinsAvailable((prev) => Math.max(0, prev - 1));
      setWonPrize(winning);

      // Fireworks
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      sound.playWin();

      setTimeout(() => {
        setShowWinnerModal(true);
      }, 500);
    }, 4200);
  };

  const resetSpin = () => {
    sound.playClick();
    setShowWinnerModal(false);
    setSpinsAvailable(1);
  };

  return (
    <div
      className="relative flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-3.5 pt-1.5 pb-safe overflow-hidden select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(253, 249, 243, 0.88) 0%, rgba(253, 249, 243, 0.72) 40%, rgba(253, 249, 243, 0.88) 100%), url(${ASSETS.treeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center text-center shrink-0 bg-white/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#bc000c] text-white shadow-sm mb-0.5">
          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            military_tech
          </span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold">
            100% CƠ HỘI TRÚNG QUÀ – QUAY LÀ TRÚNG!
          </span>
        </div>

        <h2 className="text-[17px] font-extrabold text-[#4a1d0f] tracking-tight uppercase leading-tight mt-0.5">
          VÒNG QUAY MAY MẮN GLICO
        </h2>

        {/* Status Strip: Lượt quay & Xem tỷ lệ kho */}
        <div className="flex items-center justify-between w-full max-w-[340px] px-3.5 py-1 rounded-xl bg-[#f1ede7]/90 backdrop-blur-sm shadow-sm border border-[#e6e2dc]/80 mt-1">
          <div className="flex items-center gap-1.5 text-[#4a1d0f] font-semibold text-[12px]">
            <span className="material-symbols-outlined text-[16px] text-[#f59e0b]" style={{ fontVariationSettings: '"FILL" 1' }}>
              stars
            </span>
            <span>
              Lượt quay: <b className="text-[#bc000c] font-bold">{spinsAvailable} / 1</b>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowRatesModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#4a1d0f] shadow-xs border border-[#e6e2dc] text-[11px] font-bold active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px] text-[#b45309]">analytics</span>
            <span>Xem tỷ lệ kho</span>
          </button>
        </div>
      </div>

      {/* Wheel Arena */}
      <div className="relative flex items-center justify-center shrink-0 py-2 my-1">
        {/* Amber glowing background */}
        <div className="absolute w-[315px] h-[315px] rounded-full bg-gradient-to-tr from-amber-400/25 to-rose-400/20 blur-2xl pointer-events-none animate-pulseGlow" />

        {/* Outer Gold Ring with Bezel & LED lights */}
        <div className="relative w-[304px] h-[304px] rounded-full p-2 bg-gradient-to-b from-[#fcd34d] via-[#b45309] to-[#78350f] shadow-[0_10px_32px_-6px_rgba(74,29,15,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center border-2 border-[#fef08a]">
          {/* LED Pearl Bulbs */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * (Math.PI * 2);
              const radius = 146;
              const x = 152 + radius * Math.cos(angle) - 4;
              const y = 152 + radius * Math.sin(angle) - 4;
              return (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${
                    i % 2 === 0 ? 'bg-amber-200' : 'bg-rose-200'
                  } shadow-[0_0_8px_rgba(254,240,138,0.95)]`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    animation: `pulse 1.4s infinite ${i * 0.07}s ease-in-out`
                  }}
                />
              );
            })}
          </div>

          {/* Pointer needle at 12 o'clock */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-[0_4px_8px_rgba(74,29,15,0.55)] pointer-events-none">
            <div className="w-8 h-10 bg-gradient-to-b from-[#e60012] via-[#bc000c] to-[#780004] clip-pointer relative flex items-center justify-center rounded-t-sm border border-[#fef08a] shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-300 to-white shadow-inner -mt-2 border border-amber-500/40" />
            </div>
          </div>

          {/* Rotating Wheel Canvas */}
          <div className="relative w-[280px] h-[280px] rounded-full bg-white shadow-inner overflow-hidden flex items-center justify-center border-2 border-amber-600/40">
            <canvas
              ref={canvasRef}
              width={576}
              height={576}
              className="w-full h-full transform will-change-transform"
              style={{
                transition: 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)',
                transform: `rotate(${currentRotation}deg)`
              }}
            />
          </div>

          {/* Center 3D Button QUAY NGAY */}
          <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              aria-label="Quay ngay"
              disabled={isSpinning}
              onClick={handleSpin}
              className={`w-[78px] h-[78px] rounded-full bg-gradient-to-b from-[#e60012] via-[#bc000c] to-[#930007] text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(188,0,12,0.55),inset_0_2px_4px_rgba(255,255,255,0.45)] border-2 border-[#fef08a] active:scale-95 transition-all group focus:outline-none cursor-pointer hover:brightness-105 ${
                isSpinning ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px] text-amber-200 group-hover:scale-110 transition-transform -mb-0.5"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                stars
              </span>
              <span className="text-[12px] font-extrabold uppercase tracking-wide text-white drop-shadow-sm">
                QUAY
              </span>
              <span className="text-[9px] font-bold uppercase tracking-tighter text-amber-200">
                NGAY
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="w-full flex flex-col items-center pb-safe shrink-0 pt-1">
        <div className="w-full max-w-[340px] px-3.5 py-2 rounded-2xl bg-[#f1ede7]/90 backdrop-blur-md shadow-sm border border-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ffdbcc] flex items-center justify-center text-[#411904] shrink-0">
              <span className="material-symbols-outlined text-[17px]">verified</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] font-bold text-[#411904] leading-tight">
                Quà dinh dưỡng chính hãng
              </span>
              <span className="text-[10px] text-[#52443d] leading-none mt-0.5">
                Glico Almond Koka & Bánh Que Cao Cấp
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#bc000c] text-[11px] font-bold shadow-xs border border-[#bc000c]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bc000c] animate-ping" />
            Sẵn sàng
          </div>
        </div>
      </div>

      {/* WINNER POPUP MODAL (Matching Image 9) */}
      {showWinnerModal && wonPrize && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#31302d]/70 backdrop-blur-xs flex items-center justify-center px-4 transition-all animate-fadeIn"
        >
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center relative border-2 border-[#fef08a] animate-scaleUp">
            {/* Top Medal Header */}
            <div className="w-14 h-14 -mt-10 rounded-full bg-gradient-to-b from-[#e60012] to-[#bc000c] text-white flex items-center justify-center shadow-lg border-2 border-[#fef08a]">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                military_tech
              </span>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#4a1d0f] leading-tight mt-1">
              Bạn Đã Trúng Thưởng
            </h3>

            {/* Prize Card */}
            <div className="relative w-28 h-28 rounded-2xl bg-[#fdf9f3] p-2 flex items-center justify-center border border-[#e6e2dc] shadow-inner my-3">
              <img
                src={wonPrize.imgSrc || ASSETS.almondKokaUnsweetened}
                alt={wonPrize.name}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>

            <h4 className="text-[15px] font-bold text-[#4a1d0f] leading-tight px-2">
              {wonPrize.name}
            </h4>
            <p className="text-[12px] text-[#52443d] mt-1 px-3">
              {wonPrize.desc}
            </p>

            {/* Action Buttons */}
            <div className="w-full mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowWinnerModal(false);
                  onClaimPrize(wonPrize);
                }}
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#bc000c] to-[#930007] text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Đổi Quà Tại Booth Ngay</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={resetSpin}
                className="w-full py-2.5 px-4 rounded-full bg-[#f1ede7] text-[#4a1d0f] font-bold text-xs border border-[#e6e2dc] active:scale-95 transition-all cursor-pointer"
              >
                Quay Thêm Lượt Nữa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RATES & INVENTORY MODAL */}
      {showRatesModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#31302d]/60 backdrop-blur-xs flex items-end justify-center transition-opacity"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl p-4 shadow-2xl max-h-[82vh] flex flex-col animate-slideUp">
            <div className="w-10 h-1 bg-[#e6e2dc] rounded-full mx-auto mb-3 shrink-0" />

            <div className="flex items-center justify-between pb-2.5 border-b border-[#f1ede7] shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#bc000c] text-[22px]">balance</span>
                <div>
                  <h3 className="text-[16px] font-bold text-[#4a1d0f] leading-tight">
                    Cơ Chế & Tỷ Lệ Kho Tồn
                  </h3>
                  <p className="text-[11px] text-[#52443d]">Minh bạch theo số lượng quà khả dụng</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRatesModal(false)}
                className="w-8 h-8 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#4a1d0f] active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#f7f3ed] p-2 rounded-xl my-2 flex items-center justify-between text-[11px] text-[#4a1d0f] shrink-0 border border-[#e6e2dc]">
              <span>Tổng tồn kho toàn chiến dịch:</span>
              <span className="font-extrabold text-[#bc000c] text-[13px]">
                {totalStock.toLocaleString()} sản phẩm
              </span>
            </div>

            {/* List 10 items */}
            <div className="overflow-y-auto space-y-1.5 pr-0.5 flex-1">
              {PRIZES.map((item, idx) => {
                const pct = ((item.stock / totalStock) * 100).toFixed(2);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#f1ede7] text-[#4a1d0f]"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-5 h-5 rounded-full bg-white text-[#bc000c] flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-[#e6e2dc]">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-[12px] truncate text-[#4a1d0f] font-bold leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#52443d]">
                          Tồn kho: <b>{item.stock}</b>
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#bc000c]/10 text-[#bc000c] text-[11px] font-extrabold shrink-0">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowRatesModal(false)}
                className="w-full py-2.5 rounded-full bg-[#4a1d0f] text-white font-bold text-[13px] active:scale-98 cursor-pointer"
              >
                ĐÃ HIỂU & TIẾP TỤC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
