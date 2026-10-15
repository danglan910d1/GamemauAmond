import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenId, ASSETS } from '../types';
import { sound } from '../sound';

interface Game1ScreenProps {
  onNextRound: () => void;
  onGoHome: () => void;
  onNavigate: (screen: ScreenId) => void;
}

interface DropItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  isHazard: boolean;
}

interface SplashEffect {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const Game1Screen: React.FC<Game1ScreenProps> = ({ onNextRound, onGoHome }) => {
  const [caughtDrops, setCaughtDrops] = useState<number>(0);
  const targetDrops = 6;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cupX, setCupX] = useState<number>(160);
  const [splashes, setSplashes] = useState<SplashEffect[]>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<DropItem[]>([]);
  const nextIdRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastSpawnRef = useRef<number>(0);
  const spawnIntervalRef = useRef<number>(1100);
  const goodSpawnCountRef = useRef<number>(0);
  const caughtDropsRef = useRef<number>(0);
  const isFinishedRef = useRef<boolean>(false);
  const cupXRef = useRef<number>(160);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2000);
  };

  // Safe bounds update for Cup
  const updateCupPosition = useCallback((clientX: number) => {
    if (isFinishedRef.current) return;
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const halfWidth = 55;
    const relX = clientX - rect.left;
    const clampedX = Math.max(halfWidth, Math.min(rect.width - halfWidth, relX));
    cupXRef.current = clampedX;
    setCupX(clampedX);
  }, []);

  const triggerGameOver = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    sound.playError();
    setIsGameOver(true);
  }, []);

  const triggerGameWon = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    sound.playWin();
    setIsGameWon(true);
  }, []);

  const resetGame = () => {
    sound.playClick();
    setIsGameOver(false);
    setIsGameWon(false);
    isFinishedRef.current = false;
    itemsRef.current = [];
    goodSpawnCountRef.current = 0;
    caughtDropsRef.current = 0;
    setCaughtDrops(0);
    setSplashes([]);
    spawnIntervalRef.current = 1100;
    lastSpawnRef.current = performance.now();
    showToast('Bắt đầu lượt chơi mới! Hãy hứng giọt vàng nhé.');
  };

  // Touch & Mouse Listeners
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFinishedRef.current) return;
    isDraggingRef.current = true;
    updateCupPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isFinishedRef.current) return;
    updateCupPosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isFinishedRef.current && arenaRef.current) {
        const arenaRect = arenaRef.current.getBoundingClientRect();
        const arenaWidth = arenaRect.width;
        const arenaHeight = arenaRect.height;

        // Spawn item logic
        if (time - lastSpawnRef.current > spawnIntervalRef.current) {
          lastSpawnRef.current = time;
          spawnIntervalRef.current = Math.max(750, spawnIntervalRef.current - 12);

          let isHazard = false;
          if (goodSpawnCountRef.current < targetDrops) {
            isHazard = Math.random() < 0.35;
          } else {
            isHazard = Math.random() < 0.5;
          }

          if (!isHazard) {
            goodSpawnCountRef.current++;
          }

          const itemWidth = 48;
          const spawnX = Math.random() * (arenaWidth - itemWidth - 24) + 12;

          itemsRef.current.push({
            id: nextIdRef.current++,
            x: spawnX + itemWidth / 2,
            y: -50,
            speed: Math.random() * 0.7 + 2.3,
            isHazard
          });
        }

        // Move and collide
        const cupTop = arenaHeight - 140;
        const hitRadius = 55;
        const updatedList: DropItem[] = [];

        for (const item of itemsRef.current) {
          item.y += item.speed * (delta / 16.6);

          // Check hit
          if (item.y >= cupTop && item.y <= cupTop + 28) {
            const distX = Math.abs(item.x - cupXRef.current);
            if (distX < hitRadius) {
              if (item.isHazard) {
                triggerGameOver();
                return;
              } else {
                caughtDropsRef.current++;
                const newCount = caughtDropsRef.current;
                setCaughtDrops(newCount);
                sound.playDropCatch();

                let text = '+1 Giọt';
                if (newCount === 2) text = 'Mở Khóa: 100% Vit E!';
                else if (newCount === 4) text = 'Mở Khóa: 0% Cholesterol!';
                else if (newCount === 6) text = 'Mở Khóa: Giàu Chất Xơ!';

                const splashId = Date.now() + Math.random();
                setSplashes((prev) => [...prev, { id: splashId, x: cupXRef.current, y: cupTop, text }]);
                setTimeout(() => {
                  setSplashes((prev) => prev.filter((s) => s.id !== splashId));
                }, 700);

                if (newCount >= targetDrops) {
                  triggerGameWon();
                  return;
                }
              }
              continue;
            }
          }

          if (item.y <= arenaHeight + 40) {
            updatedList.push(item);
          }
        }
        itemsRef.current = updatedList;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [triggerGameOver, triggerGameWon]);

  // Milk height calculation (SVG translation: 135 to 24)
  const maxRise = 135 - 24;
  const currentRise = (caughtDrops / targetDrops) * maxRise;
  const milkTranslateY = 135 - currentRise;

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-3.5 pt-2 pb-safe flex flex-col justify-between overflow-hidden relative select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-[#4a1d0f] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#f59e0b]">info</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Badges & Rules */}
      <div className="shrink-0 flex flex-col gap-1.5 mb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-white/95 border border-[#e3d0bf] px-3 py-1 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-ping" />
            <span className="font-bold text-[11px] text-[#4a1d0f] tracking-wide uppercase">
              VÒNG 1: HỨNG GIỌT SỮA
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#5c2e16] text-white px-3 py-1 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[#f59e0b] text-[15px] drop-glow">
              water_drop
            </span>
            <span className="font-bold text-[11px] tracking-wider">
              {caughtDrops}/{targetDrops} Giọt
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="w-full bg-white/95 border border-[#dfcebd] rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="material-symbols-outlined text-[#d97706] text-[18px] shrink-0 mt-0.5">
              touch_app
            </span>
            <p className="text-xs text-[#4a1d0f] leading-snug font-medium">
              Kéo ly hứng đủ 6 giọt vàng dinh dưỡng, tránh chướng ngại vật!
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1 bg-[#fee2e2] text-[#e60012] px-2 py-1 rounded-md text-[10px] font-bold border border-[#fca5a5]">
            <span className="material-symbols-outlined text-[12px]">favorite</span>
            <span>1 MẠNG</span>
          </div>
        </div>
      </div>

      {/* 3 Nutrition Milestones */}
      <div className="grid grid-cols-3 gap-1.5 mb-1.5 shrink-0">
        {/* Tier 1 */}
        <div
          className={`border rounded-xl py-1.5 px-1 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xs ${
            caughtDrops >= 2
              ? 'bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] border-[#d97706]'
              : 'bg-white/80 border-[#dfcebd]'
          }`}
        >
          <span className="text-[9.5px] font-semibold text-[#85746c] uppercase tracking-tight flex items-center gap-0.5">
            <span
              className={`material-symbols-outlined text-[12px] ${
                caughtDrops >= 2 ? 'text-[#15803d]' : 'text-gray-400'
              }`}
            >
              {caughtDrops >= 2 ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            MỐC 1 (GIỌT 1-2)
          </span>
          <span className="text-[11.5px] font-bold text-[#4a1d0f] leading-tight mt-0.5">
            100% Vitamin E
          </span>
        </div>

        {/* Tier 2 */}
        <div
          className={`border rounded-xl py-1.5 px-1 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xs ${
            caughtDrops >= 4
              ? 'bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] border-[#d97706]'
              : 'bg-white/80 border-[#dfcebd]'
          }`}
        >
          <span className="text-[9.5px] font-semibold text-[#85746c] uppercase tracking-tight flex items-center gap-0.5">
            <span
              className={`material-symbols-outlined text-[12px] ${
                caughtDrops >= 4 ? 'text-[#15803d]' : 'text-gray-400'
              }`}
            >
              {caughtDrops >= 4 ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            MỐC 2 (GIỌT 3-4)
          </span>
          <span className="text-[11.5px] font-bold text-[#4a1d0f] leading-tight mt-0.5">
            0% Cholesterol
          </span>
        </div>

        {/* Tier 3 */}
        <div
          className={`border rounded-xl py-1.5 px-1 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xs ${
            caughtDrops >= 6
              ? 'bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] border-[#d97706]'
              : 'bg-white/80 border-[#dfcebd]'
          }`}
        >
          <span className="text-[9.5px] font-semibold text-[#85746c] uppercase tracking-tight flex items-center gap-0.5">
            <span
              className={`material-symbols-outlined text-[12px] ${
                caughtDrops >= 6 ? 'text-[#15803d]' : 'text-gray-400'
              }`}
            >
              {caughtDrops >= 6 ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            MỐC 3 (GIỌT 5-6)
          </span>
          <span className="text-[11.5px] font-bold text-[#4a1d0f] leading-tight mt-0.5">
            Giàu Chất Xơ
          </span>
        </div>
      </div>

      {/* Sân chơi Minigame Arena */}
      <div
        ref={arenaRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex-1 w-full relative bg-gradient-to-b from-[#fdfbf7]/90 to-[#f6ecde] rounded-2xl border-2 border-[#dfcebd] overflow-hidden shadow-inner touch-none select-none min-h-[380px] cursor-grab active:cursor-grabbing"
      >
        {/* Almond Watermark */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none flex items-center justify-center">
          <svg className="w-72 h-72 text-[#4a1d0f]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C7.5 7 4 11.5 4 16a8 8 0 0 0 16 0c0-4.5-3.5-9-8-14zm0 20a6 6 0 0 1-6-6c0-3.3 2.7-7 6-11 3.3 4 6 7.7 6 11a6 6 0 0 1-6 6z" />
          </svg>
        </div>

        {/* Gesture Guide */}
        <div className="absolute top-2.5 inset-x-0 flex justify-between px-3.5 text-[#a88f7b] text-[11px] font-semibold pointer-events-none">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Chạm / Kéo
          </span>
          <span className="flex items-center gap-1">
            Kéo / Vuốt <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </div>

        {/* Falling items container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {itemsRef.current.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none will-change-transform flex items-center justify-center"
              style={{
                left: `${item.x - 24}px`,
                top: `${item.y}px`,
                width: '48px',
                height: '48px'
              }}
            >
              {!item.isHazard ? (
                // Good nutritious golden almond drop
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#d97706] shadow-[0_4px_12px_rgba(217,119,6,0.6)] border-2 border-white flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-[24px] text-white font-bold drop-shadow">
                    water_drop
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5c2e16] border-2 border-white flex items-center justify-center shadow-xs">
                    <span className="text-[9px] text-white font-black leading-none">AK</span>
                  </div>
                </div>
              ) : (
                // Hazard obstacle
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#1f2937] shadow-[0_4px_12px_rgba(31,41,55,0.7)] border-2 border-[#ef4444] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px] text-[#ef4444]">
                    warning
                  </span>
                  <span className="absolute -top-1 -right-1 text-[10px] text-white bg-[#e60012] rounded-full w-4 h-4 flex items-center justify-center font-black border border-white">
                    ✕
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Splash animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {splashes.map((s) => (
            <div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center"
              style={{ left: `${s.x}px`, top: `${s.y}px` }}
            >
              <div className="w-16 h-16 rounded-full bg-[#fde68a]/60 animate-ping" />
              <span className="text-xs font-black text-[#d97706] animate-bounce -top-6 absolute whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full border border-[#d97706] shadow-sm">
                {s.text}
              </span>
            </div>
          ))}
        </div>

        {/* Ly Sữa Thủy Tinh Almond Koka (138px x 158px) */}
        <div
          className="absolute bottom-2.5 w-[138px] h-[158px] -translate-x-1/2 pointer-events-none z-30 transition-transform duration-75"
          style={{ left: `${cupX}px` }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-end">
            <svg
              className="w-[138px] h-[158px] drop-shadow-[0_12px_24px_rgba(74,29,15,0.32)]"
              fill="none"
              viewBox="0 0 138 158"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="innerGlassClip">
                  <path d="M22 18 L34 135 C35 145, 44 151, 69 151 C94 151, 103 145, 104 135 L116 18 Z" />
                </clipPath>
                <linearGradient id="milkGradient" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#f0c68c" />
                  <stop offset="40%" stopColor="#fae0b2" />
                  <stop offset="80%" stopColor="#fff2da" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="glassReflection" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="20%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="80%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
                </linearGradient>
              </defs>

              {/* Thân ly nền */}
              <path
                d="M20 16 L33 138 C34.5 149, 44 154, 69 154 C94 154, 103.5 149, 105 138 L118 16 Z"
                fill="#ffffff"
                fillOpacity="0.38"
              />

              {/* Vùng chứa sữa clip-path */}
              <g clipPath="url(#innerGlassClip)">
                <rect fill="#fbf5ed" fillOpacity="0.4" height="158" width="138" x="0" y="0" />
                <g
                  style={{
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    willChange: 'transform'
                  }}
                  transform={`translate(0, ${milkTranslateY})`}
                >
                  <path
                    className="milk-surface-wave"
                    d="M 0 0 Q 34.5 -6 69 0 T 138 0 L 138 158 L 0 158 Z"
                    fill="url(#milkGradient)"
                  />
                  <ellipse cx="69" cy="1" fill="#ffffff" fillOpacity="0.9" rx="36" ry="3" />
                  <circle cx="44" cy="18" fill="#ffffff" fillOpacity="0.8" r="4.5" />
                  <circle cx="88" cy="22" fill="#ffffff" fillOpacity="0.75" r="4" />
                  <circle cx="66" cy="46" fill="#ffffff" fillOpacity="0.75" r="3.5" />
                  <circle cx="52" cy="76" fill="#ffffff" fillOpacity="0.6" r="4" />
                </g>
              </g>

              {/* Ticks đo định lượng */}
              <line opacity="0.95" stroke="#a87d5b" strokeLinecap="round" strokeWidth="2.8" x1="36" x2="49" y1="108" y2="108" />
              <text fill="#7a461e" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9.5" fontWeight="900" x="53" y="111.5">
                MỐC 1
              </text>

              <line opacity="0.95" stroke="#a87d5b" strokeLinecap="round" strokeWidth="2.8" x1="32" x2="45" y1="72" y2="72" />
              <text fill="#7a461e" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9.5" fontWeight="900" x="49" y="75.5">
                MỐC 2
              </text>

              <line opacity="1" stroke="#a87d5b" strokeLinecap="round" strokeWidth="3" x1="28" x2="43" y1="36" y2="36" />
              <text fill="#5c2e16" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10.5" fontWeight="900" x="47" y="39.5">
                ĐẦY 180ml
              </text>

              <text fill="#4a1d0f" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9.5" fontWeight="900" letterSpacing="1.2" opacity="0.9" textAnchor="middle" x="69" y="138">
                ALMOND KOKA
              </text>

              <path
                d="M20 16 L33 138 C34.5 149, 44 154, 69 154 C94 154, 103.5 149, 105 138 L118 16 Z"
                fill="url(#glassReflection)"
              />
              <path
                d="M20 16 L33 138 C34.5 149, 44 154, 69 154 C94 154, 103.5 149, 105 138 L118 16 Z"
                fill="none"
                stroke="#dfc8b3"
                strokeWidth="3.2"
              />
              <ellipse cx="69" cy="16" fill="#ffffff" fillOpacity="0.85" rx="49" ry="6.5" stroke="#d5beaa" strokeWidth="3.2" />
              <ellipse cx="69" cy="16" fill="#faf3e8" fillOpacity="0.4" rx="43" ry="4.5" />
            </svg>
            <div className="w-20 h-2 bg-[#4a1d0f]/25 rounded-full mt-1.5 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="shrink-0 text-center py-2">
        <p className="text-[12px] text-[#5c4436] font-semibold flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#d97706] shrink-0" />
          1 Ly 180ml Almond Koka cung cấp trọn vẹn 100% nhu cầu Vitamin E tự nhiên mỗi ngày
        </p>
      </div>

      {/* MODAL 1: THẤT BẠI (CHƯỚNG NGẠI VẬT) - Matching Image 3 */}
      {isGameOver && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
        >
          <div className="w-full max-w-xs bg-[#fdf9f3] rounded-3xl p-5 border-2 border-[#dfcebd] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp">
            {/* Close 'X' button */}
            <button
              type="button"
              aria-label="Đóng và chơi lại"
              onClick={resetGame}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#f2ebd9] hover:bg-[#e6ddc8] text-[#5c2e16] border border-[#dfcebd] flex items-center justify-center active:scale-90 transition-all z-20 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] leading-none font-bold">close</span>
            </button>

            {/* Almond Koka Pack + Red ✕ */}
            <div className="relative -mt-16 mb-2 flex items-center justify-center">
              <img
                src={ASSETS.almondKokaBoxTransparent}
                alt="Hộp sữa Almond Koka"
                className="h-32 w-auto object-contain drop-shadow-xl"
              />
              <div className="absolute -bottom-1 -right-2 w-8 h-8 rounded-full bg-[#e60012] text-white flex items-center justify-center shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#e60012] text-white mb-2 shadow-xs">
              1 LƯỢT DUY NHẤT ĐÃ KẾT THÚC
            </span>

            <h2 className="font-black text-lg text-[#4a1d0f] mb-1.5 tracking-tight">
              CHƯA HOÀN THÀNH THỬ THÁCH!
            </h2>
            <p className="text-xs text-[#5c4a40] mb-5 leading-relaxed font-medium">
              Rất tiếc bạn chưa vượt qua thử thách lần này! Hãy nghỉ ngơi cùng Almond Koka nhé!
            </p>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={resetGame}
                className="w-full py-3 px-6 rounded-full bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-white font-extrabold text-sm shadow-[0_4px_0_#92400e] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Chơi lại ngay
              </button>

              <button
                type="button"
                onClick={onGoHome}
                className="w-full py-3 px-6 rounded-full bg-[#4a1d0f] hover:bg-[#38150a] active:bg-[#280e07] text-white font-extrabold text-sm shadow-[0_4px_0_#2b1008] active:translate-y-0.5 transition-all cursor-pointer"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: THÀNH CÔNG (HỨNG ĐỦ 6 GIỌT VÀNG) */}
      {isGameWon && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-[#2d120a]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
        >
          <div className="w-full max-w-xs bg-[#fdf9f3] rounded-3xl p-5 border-2 border-[#fed7aa] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp">
            {/* Close 'X' button */}
            <button
              type="button"
              aria-label="Đóng và chơi lại"
              onClick={resetGame}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#f2ebd9] hover:bg-[#e6ddc8] text-[#5c2e16] border border-[#dfcebd] flex items-center justify-center active:scale-90 transition-all z-20 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] leading-none font-bold">close</span>
            </button>

            {/* Almond Koka Pack + Sparkles */}
            <div className="relative -mt-16 mb-2 flex items-center justify-center">
              <img
                src={ASSETS.almondKokaBoxTransparent}
                alt="Hộp sữa Almond Koka"
                className="h-32 w-auto object-contain drop-shadow-2xl"
              />
              <div className="absolute -top-1 -right-2 text-2xl animate-bounce">✨</div>
              <div className="absolute -bottom-1 -left-2 w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#d97706] text-white mb-2 shadow-xs">
              ✨ XUẤT SẮC ĐẠT 100% ✨
            </span>

            <h2 className="font-black text-lg text-[#4a1d0f] mb-1 tracking-tight leading-snug">
              ĐÃ HỨNG ĐỦ 6 GIỌT DINH DƯỠNG!
            </h2>
            <p className="text-xs text-[#5c4a40] mb-3 font-semibold">
              Ly sữa Almond Koka 180ml đã đầy ắp năng lượng thanh xuân!
            </p>

            {/* 3 Milestones Unlocked */}
            <div className="w-full bg-[#f6ebd9]/90 rounded-2xl p-3 border border-[#e3d1be] flex flex-col gap-2 mb-4 text-left">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#4a1d0f]">
                  100% Vitamin E Tự Nhiên
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#4a1d0f]">
                  0% Cholesterol & Không Lactose
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#4a1d0f]">
                  Giàu Chất Xơ Thực Vật
                </span>
              </div>
            </div>

            {/* Next Round CTA Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNextRound();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-white font-extrabold text-sm shadow-[0_4px_0_#92400e] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiếp tục Vòng 2</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
