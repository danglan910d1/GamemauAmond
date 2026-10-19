// GamemauAmond/src/components/Game1Screen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenId, DropItem, SplashEffect } from '../types';
import { ASSETS } from '../types';
import { sound } from '../sound';
import MilkCup from './game1/MilkCup';
import FallingItem from './game1/FallingItem';
import DropCounter from './game1/DropCounter';
import GameOverModal from './game1/GameOverModal';
import GameWonModal from './game1/GameWonModal';
import {
  TARGET_DROPS,
  CUP_W,
  CUP_H,
  CUP_BOTTOM_OFFSET,
  CUP_MOUTH_RATIO_Y,
  CUP_MOUTH_HALF_RATIO,
  CUP_BODY_HALF_RATIO,
  ITEM_SIZE,
  HAZARD_RATIO_START,
  HAZARD_RATIO_MAX,
  SPAWN_INTERVAL_START,
  SPAWN_INTERVAL_MIN,
  BASE_SPEED,
  SPEED_STEP,
  NUTRITION_SPRITES,
  OBSTACLE_SPRITES,
  MILESTONE_TEXT,
  SpriteDef,
} from './game1/config';

interface Game1ScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onGoHome: () => void;
  onNextRound?: () => void;
}

type GameStatus = 'playing' | 'won' | 'lost';

/** Va chạm hình tròn (vật thể) – hình chữ nhật (thân ly) */
const circleHitsRect = (
  cx: number,
  cy: number,
  r: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => {
  const nx = Math.max(left, Math.min(cx, right));
  const ny = Math.max(top, Math.min(cy, bottom));
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < r * r;
};

export const Game1Screen: React.FC<Game1ScreenProps> = ({ onNavigate, onGoHome, onNextRound }) => {
  const [status, setStatus] = useState<GameStatus>('playing');
  const [caughtDrops, setCaughtDrops] = useState<number>(0);
  const [cupX, setCupX] = useState<number>(180);
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [splashes, setSplashes] = useState<SplashEffect[]>([]);
  const [bumpKey, setBumpKey] = useState<number>(0);
  const [hitObstacle, setHitObstacle] = useState<SpriteDef | null>(null);

  const arenaRef = useRef<HTMLDivElement>(null);
  const arenaSizeRef = useRef<{ w: number; h: number }>({ w: 360, h: 520 });
  const itemsRef = useRef<DropItem[]>([]);
  const caughtRef = useRef<number>(0);
  const cupXRef = useRef<number>(180);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const lastSpawnXRef = useRef<number>(-999);
  const nextIdRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const statusRef = useRef<GameStatus>('playing');

  const clampCupX = (x: number) => {
    const { w } = arenaSizeRef.current;
    const half = CUP_W / 2;
    return Math.max(half, Math.min(w - half, x));
  };

  const moveCup = useCallback((x: number) => {
    const clamped = clampCupX(x);
    cupXRef.current = clamped;
    setCupX(clamped);
  }, []);

  // Theo dõi kích thước Arena (responsive) & đặt ly ở giữa lúc bắt đầu
  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return;
    const measure = () => {
      arenaSizeRef.current = { w: el.clientWidth || 360, h: el.clientHeight || 520 };
      moveCup(cupXRef.current);
    };
    arenaSizeRef.current = { w: el.clientWidth || 360, h: el.clientHeight || 520 };
    moveCup(arenaSizeRef.current.w / 2);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [moveCup]);

  const endGame = useCallback((result: 'won' | 'lost', obstacle?: SpriteDef) => {
    if (statusRef.current !== 'playing') return;
    statusRef.current = result;
    cancelAnimationFrame(rafRef.current);
    isDraggingRef.current = false;
    if (result === 'won') {
      sound.playWin();
    } else {
      sound.playError();
      setHitObstacle(obstacle ?? null);
    }
    setStatus(result);
  }, []);

  const retryGame = useCallback(() => {
    sound.playClick();
    itemsRef.current = [];
    caughtRef.current = 0;
    setDrops([]);
    setCaughtDrops(0);
    setHitObstacle(null);
    setSplashes([]);
    statusRef.current = 'playing';
    setStatus('playing');
  }, []);

  const pushSplash = useCallback((x: number, y: number, text: string) => {
    const id = Date.now() + Math.random();
    setSplashes((prev) => [...prev, { id, x, y, text }]);
    window.setTimeout(() => setSplashes((prev) => prev.filter((s) => s.id !== id)), 900);
  }, []);

  // ===================== GAME LOOP =====================
  useEffect(() => {
    if (status !== 'playing') return;

    const spawn = (now: number) => {
      const { w } = arenaSizeRef.current;
      const count = caughtRef.current;
      const progress = count / TARGET_DROPS;
      const interval = SPAWN_INTERVAL_START - (SPAWN_INTERVAL_START - SPAWN_INTERVAL_MIN) * progress;
      if (now - lastSpawnRef.current < interval) return;
      lastSpawnRef.current = now;

      // 1. Tỉ lệ chướng ngại vật theo giai đoạn:
      // - 0-1 giọt đầu: 100% giọt sữa (0% chướng ngại vật) để người chơi dễ dàng làm quen thao tác hứng
      // - Từ giọt thứ 2 trở lên: tăng nhẹ dần từ HAZARD_RATIO_START (15%) đến HAZARD_RATIO_MAX (45%)
      const currentHazardRatio = count < 2
        ? 0
        : HAZARD_RATIO_START + (HAZARD_RATIO_MAX - HAZARD_RATIO_START) * progress;
      const isHazard = Math.random() < currentHazardRatio;

      const margin = ITEM_SIZE / 2 + 6;
      // Tránh sinh 2 vật thể liên tiếp chồng cùng một cột
      let x = margin + Math.random() * (w - margin * 2);
      for (let i = 0; i < 4 && Math.abs(x - lastSpawnXRef.current) < ITEM_SIZE; i++) {
        x = margin + Math.random() * (w - margin * 2);
      }
      lastSpawnXRef.current = x;

      // 2. Tốc độ rơi: siêu chậm rãi, trôi êm ái, người chơi thoải mái di chuyển ly
      const speedBase = BASE_SPEED + count * SPEED_STEP;
      itemsRef.current.push({
        id: nextIdRef.current++,
        x,
        y: -ITEM_SIZE / 2,
        speed: speedBase + Math.random() * 0.2,
        isHazard,
        size: ITEM_SIZE,
        variant: Math.floor(Math.random() * 3),
        rotation: Math.random() * 14 - 7,
      });

      // 3. Rơi đồng thời ở làn khác (Double Drop):
      // - Chỉ xuất hiện khi gần thắng (>= 4 giọt) với tỉ lệ nhỏ (15%)
      // - Vật thứ 2 luôn luôn là giọt sữa dinh dưỡng để hứng, không bao giờ là chướng ngại vật!
      const doubleDropChance = count < 4 ? 0 : 0.15;
      if (Math.random() < doubleDropChance) {
        let x2 = margin + Math.random() * (w - margin * 2);
        if (Math.abs(x2 - x) > ITEM_SIZE * 1.35) {
          itemsRef.current.push({
            id: nextIdRef.current++,
            x: x2,
            y: -ITEM_SIZE * 0.9,
            speed: speedBase + Math.random() * 0.2,
            isHazard: false, // Luôn là giọt sữa để hứng thêm
            size: ITEM_SIZE,
            variant: Math.floor(Math.random() * 3),
            rotation: Math.random() * 14 - 7,
          });
        }
      }
    };

    const tick = (now: number) => {
      if (statusRef.current !== 'playing') return;
      if (!lastFrameRef.current) lastFrameRef.current = now;
      // Giới hạn delta để tránh "nhảy cóc" khi tab bị ẩn
      const dt = Math.min(now - lastFrameRef.current, 48);
      lastFrameRef.current = now;

      spawn(now);

      const { h } = arenaSizeRef.current;
      const cupBottom = h - CUP_BOTTOM_OFFSET;
      const cupTop = cupBottom - CUP_H;
      const mouthY = cupTop + CUP_H * CUP_MOUTH_RATIO_Y;
      const catchLine = mouthY + 8; // tâm huy hiệu lọt qua vành ly
      const cx = cupXRef.current;
      const mouthHalf = CUP_W * CUP_MOUTH_HALF_RATIO;
      const bodyHalf = CUP_W * CUP_BODY_HALF_RATIO;

      const next: DropItem[] = [];
      for (const item of itemsRef.current) {
        const prevY = item.y;
        const y = prevY + item.speed * (dt / 16.67);
        const r = item.size / 2;

        if (item.isHazard) {
          // Chướng ngại vật chỉ tính thua khi rơi trực diện vào miệng ly từ trên xuống.
          // Một khi đã lướt qua miệng ly (prevY >= mouthY + 8), di chuyển ly chạm thành KHÔNG BỊ THUA ("qua là không sao nữa").
          const hazardThresholdY = mouthY + 8;
          if (prevY < hazardThresholdY) {
            // Kiểm tra va chạm ngay tại miệng ly (rộng bằng miệng ly, không tính thân ly bên dưới)
            if (circleHitsRect(item.x, y, r * 0.65, cx - mouthHalf, mouthY - 6, cx + mouthHalf, hazardThresholdY + 4)) {
              itemsRef.current = [];
              setDrops([]);
              endGame('lost', OBSTACLE_SPRITES[item.variant % OBSTACLE_SPRITES.length]);
              return;
            }
          }
        } else if (prevY < catchLine && y >= catchLine && Math.abs(item.x - cx) <= mouthHalf - r * 0.2) {
          // Hứng trúng huy hiệu dinh dưỡng (kiểm tra theo đường cắt -> không bị "xuyên" khi rơi nhanh)
          caughtRef.current += 1;
          const count = caughtRef.current;
          setCaughtDrops(count);
          setBumpKey((k) => k + 1);
          sound.playDropCatch();
          pushSplash(
            cx,
            mouthY,
            MILESTONE_TEXT[count] ?? NUTRITION_SPRITES[item.variant % NUTRITION_SPRITES.length].label
          );
          if (count >= TARGET_DROPS) {
            itemsRef.current = [];
            setDrops([]);
            // Dừng loop ngay, chờ lớp sữa dâng đầy (≈0.5s) rồi mới hiện popup
            statusRef.current = 'won';
            isDraggingRef.current = false;
            window.setTimeout(() => {
              sound.playWin();
              setStatus('won');
            }, 550);
            return;
          }
          continue;
        }

        if (y - r <= h) next.push({ ...item, y });
      }

      itemsRef.current = next;
      setDrops(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    lastFrameRef.current = 0;
    lastSpawnRef.current = performance.now() - SPAWN_INTERVAL_START + 500; // vật thể đầu tiên sau ~0.5s
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, endGame, pushSplash]);

  // ===================== ĐIỀU KHIỂN LY =====================
  const toArenaX = (clientX: number) => {
    const rect = arenaRef.current?.getBoundingClientRect();
    return rect ? clientX - rect.left : clientX;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (statusRef.current !== 'playing') return;
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveCup(toArenaX(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || statusRef.current !== 'playing') return;
    moveCup(toArenaX(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-2 px-3 pt-2 pb-safe bg-[#fdf9f3] overflow-hidden select-none">
      {/* Bộ đếm giọt dinh dưỡng */}
      <div className="shrink-0">
        <DropCounter caught={caughtDrops} target={TARGET_DROPS} />
      </div>

      {/* Game Arena */}
      <div
        ref={arenaRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex-1 min-h-0 w-full mb-2 rounded-3xl border-2 border-[#eedecf] overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.12)] cursor-grab active:cursor-grabbing touch-none"
        style={{
          backgroundImage: `url(${ASSETS.game1BgCard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Vật thể rơi: Huy hiệu dinh dưỡng & Chướng ngại vật */}
        {drops.map((item) => (
          <FallingItem key={item.id} item={item} />
        ))}

        {/* Điểm nổi khi hứng trúng */}
        {splashes.map((s) => (
          <div
            key={s.id}
            className="absolute z-40 pointer-events-none whitespace-nowrap typo-caption text-[12px] text-[#b45309] bg-white/95 px-2.5 py-1 rounded-full border border-[#f59e0b] shadow-md animate-floatUp"
            style={{ left: s.x, top: s.y - 24 }}
          >
            {s.text}
          </div>
        ))}

        {/* Ly sữa 3D */}
        <MilkCup cupX={cupX} caughtDrops={caughtDrops} bumpKey={bumpKey} />
      </div>

      {/* Popups kết quả */}
      <GameOverModal
        isOpen={status === 'lost'}
        hitObstacle={hitObstacle}
        onGoHome={() => {
          sound.playClick();
          onGoHome();
        }}
      />
      <GameWonModal
        isOpen={status === 'won'}
        onNextRound={() => {
          sound.playClick();
          if (onNextRound) onNextRound();
          else onNavigate('game2');
        }}
      />
    </div>
  );
};

export default Game1Screen;
