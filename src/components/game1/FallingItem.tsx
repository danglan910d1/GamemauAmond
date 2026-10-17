// GamemauAmond/src/components/game1/FallingItem.tsx
import React from 'react';
import { DropItem } from '../../types';
import { NUTRITION_SPRITES, OBSTACLE_SPRITES } from './config';

export interface FallingItemProps {
  item: DropItem;
}

/** Vật thể rơi: Huy hiệu dinh dưỡng (cần hứng) hoặc Chướng ngại vật (cần tránh) */
export const FallingItem: React.FC<FallingItemProps> = React.memo(({ item }) => {
  const sprite = item.isHazard
    ? OBSTACLE_SPRITES[item.variant % OBSTACLE_SPRITES.length]
    : NUTRITION_SPRITES[item.variant % NUTRITION_SPRITES.length];

  // Lắc nhẹ khi rơi cho sinh động
  const sway = Math.sin(item.y / 38) * 10 + item.rotation;

  return (
    <div
      className="absolute left-0 top-0 pointer-events-none will-change-transform"
      style={{
        width: item.size,
        height: item.size,
        transform: `translate(${item.x - item.size / 2}px, ${item.y - item.size / 2}px) rotate(${sway}deg)`,
      }}
    >
      <img
        src={sprite.src}
        alt={sprite.label}
        draggable={false}
        className={`w-full h-full object-contain select-none ${
          item.isHazard
            ? 'drop-shadow-[0_4px_8px_rgba(127,29,29,0.45)]'
            : 'drop-shadow-[0_4px_10px_rgba(217,119,6,0.55)]'
        }`}
      />
    </div>
  );
});

FallingItem.displayName = 'FallingItem';

export default FallingItem;
