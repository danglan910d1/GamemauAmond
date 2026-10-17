// GamemauAmond/src/components/game2/MatchCard.tsx
import React from 'react';

export interface MatchCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  icon?: string;
  isMatched: boolean;
  isSelected: boolean;
  isError: boolean;
  side: 'left' | 'right';
  onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  title,
  subtitle,
  image,
  icon,
  isMatched,
  isSelected,
  isError,
  side,
  onClick,
}) => {
  // 1. Style khi chọn có background xanh dương nhạt, tất cả item đều có border nhẹ
  let cardStyle = 'bg-white/95 border-[#d7c2ba]/60 shadow-xs hover:border-[#b45309]/50';
  if (isMatched) {
    cardStyle = 'bg-[#f0fdf4] border-[#22c55e]/60 shadow-none opacity-85';
  } else if (isError) {
    cardStyle = 'bg-[#fee2e2] border-[#ef4444] animate-shake';
  } else if (isSelected) {
    // Nền xanh dương nhạt chứ không phải viền đậm
    cardStyle = 'bg-[#e0f2fe] border-[#38bdf8] shadow-sm scale-[1.01]';
  }

  // Đối với thẻ số 1 (sữa) ở cột phải: không có image thì vẫn giữ khoảng trống w-10 h-10 để thẳng hàng
  const hasVisual = Boolean(image || icon);

  return (
    <button
      type="button"
      disabled={isMatched}
      onClick={onClick}
      className={`w-full text-left relative rounded-2xl p-2.5 flex items-center gap-2 border transition-all duration-150 active:scale-98 cursor-pointer min-h-[58px] ${cardStyle}`}
    >
      {/* Khung visual ở đầu thẻ */}
      {hasVisual ? (
        <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] flex items-center justify-center shrink-0 p-1 overflow-hidden border border-[#ebdccd]/60">
          {image ? (
            <img
              src={image}
              alt={title}
              className={`${
                image.includes('almond-koka')
                  ? 'w-6 h-8'
                  : 'w-7 h-7'
              } object-contain drop-shadow-xs`}
            />
          ) : (
            <span className="material-symbols-outlined text-[#3c2415] text-[22px]">
              {icon || 'nutrition'}
            </span>
          )}
        </div>
      ) : (
        /* Chừa khoảng trống ở đầu để con số thẳng hàng với các thẻ khác */
        <div className="w-10 h-10 shrink-0 pointer-events-none" aria-hidden="true" />
      )}

      {/* Nội dung text */}
      <div className="flex flex-col min-w-0 pr-1 flex-1">
        <span
          className={`leading-tight ${
            side === 'right'
              ? 'text-[20px] sm:text-[22px] text-[#3c2415] font-bold tracking-tight'
              : 'text-[13.5px] sm:text-[14.5px] text-[#3c2415] font-bold line-clamp-2'
          }`}
        >
          {title}
        </span>
        {side === 'left' && subtitle && (
          <span className="text-[11px] sm:text-[11.5px] text-[#6b5847] leading-[1.25] font-medium truncate mt-0.5">
            {subtitle}
          </span>
        )}
      </div>

      {/* Huy hiệu hoàn thành khi matched */}
      {side === 'left' && isMatched && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[13px] font-bold">check</span>
        </div>
      )}

      {side === 'right' && (
        <div className="ml-auto pr-0.5 shrink-0">
          {isMatched ? (
            <span
              className="material-symbols-outlined text-[19px] text-[#16a34a]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              verified
            </span>
          ) : (
            <span className="material-symbols-outlined text-[18px] text-[#d7c2ba]">
              radio_button_unchecked
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default MatchCard;
