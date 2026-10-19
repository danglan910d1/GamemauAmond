// GamemauAmond/src/components/game2/MatchCard.tsx
import React from 'react';

export interface MatchCardProps {
  title: string;
  subtitle?: string;
  unit?: string;
  image?: string;
  icon?: string;
  isMatched: boolean;
  isJustMatched?: boolean;
  isSelected: boolean;
  isError: boolean;
  side: 'left' | 'right';
  onClick: () => void;
  cardRef?: (node: HTMLButtonElement | null) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  title,
  subtitle,
  unit,
  image,
  icon,
  isMatched,
  isJustMatched = false,
  isSelected,
  isError,
  side,
  onClick,
  cardRef,
}) => {
  // 1. Style khi chọn có background xanh dương nhạt, khi vừa match đúng thì phình to nổi bật (animate-matchPop)
  let cardStyle = 'bg-white/95 border-[#d7c2ba]/60 shadow-xs hover:border-[#b45309]/50';
  if (isJustMatched) {
    cardStyle = 'bg-gradient-to-r from-[#dcfce7] via-[#bbf7d0] to-[#86efac] border-2 border-[#16a34a] animate-matchPop ring-4 ring-[#22c55e]/60 z-50';
  } else if (isMatched) {
    cardStyle = 'bg-[#f0fdf4] border-[#22c55e]/60 shadow-none opacity-85';
  } else if (isError) {
    cardStyle = 'bg-[#fee2e2] border-[#ef4444] animate-shake';
  } else if (isSelected) {
    // Nền xanh dương nhạt chứ không phải viền đậm
    cardStyle = 'bg-[#e0f2fe] border-[#38bdf8] shadow-sm scale-[1.01]';
  }

  // Đối với thẻ số 1 (sữa) ở cột phải: không có image thì vẫn giữ khoảng trống để thẳng hàng
  const hasVisual = Boolean(image || icon);

  return (
    <button
      ref={cardRef}
      type="button"
      disabled={isMatched}
      onClick={onClick}
      className={`w-full h-full text-left relative rounded-2xl flex items-center border transition-all duration-200 active:scale-98 cursor-pointer ${
        side === 'right'
          ? 'px-2 py-1.5 gap-1.5 justify-between'
          : 'px-2.5 py-1.5 gap-2'
      } ${cardStyle}`}
    >
      {/* Khung visual ở đầu thẻ */}
      {hasVisual ? (
        <div
          className={`${
            side === 'right'
              ? `w-6 h-6 rounded-md ${
                  isMatched
                    ? 'bg-[#dcfce7] border-[#86efac]'
                    : isSelected
                    ? 'bg-[#e0f2fe] border-[#7dd3fc]'
                    : 'bg-[#FAF4ED] border-[#ebdccd]/70'
                }`
              : 'w-10 h-10 rounded-xl bg-[#FAF4ED] border-[#ebdccd]/60'
          } flex items-center justify-center shrink-0 p-0.5 overflow-hidden border`}
        >
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
            <span
              className={`material-symbols-outlined transition-colors duration-200 ${
                side === 'right'
                  ? `text-[14px] ${
                      isMatched
                        ? 'text-[#16a34a]'
                        : isSelected
                        ? 'text-[#0284c7]'
                        : 'text-[#8c7462]'
                    }`
                  : 'text-[#3c2415] text-[22px]'
              }`}
            >
              {icon || 'nutrition'}
            </span>
          )}
        </div>
      ) : (
        /* Chừa khoảng trống ở đầu để con số thẳng hàng với các thẻ khác nếu không có visual */
        <div
          className={`${
            side === 'right' ? 'w-6 h-6' : 'w-10 h-10'
          } shrink-0 pointer-events-none`}
          aria-hidden="true"
        />
      )}

      {/* Nội dung text: Uppercase, đậm nét, tinh chỉnh typographic cao cấp */}
      <div className="flex flex-col min-w-0 flex-1 justify-center px-0.5">
        {side === 'right' ? (
          <div className="inline-flex items-baseline justify-center gap-1 flex-nowrap w-full">
            <span
              className={`leading-tight font-black tracking-tight transition-all duration-200 whitespace-nowrap ${
                isJustMatched
                  ? 'text-[17px] sm:text-[18px] text-[#14532d] drop-shadow-xs'
                  : isMatched
                  ? 'text-[16px] sm:text-[17px] text-[#15803d]'
                  : isSelected
                  ? 'text-[18px] sm:text-[20px] text-[#0369a1]'
                  : 'text-[18px] sm:text-[20px] text-[#2c1810]'
              }`}
            >
              {title}
            </span>
            {isMatched && unit && (
              <span
                className={`font-extrabold uppercase tracking-wider text-[11px] sm:text-[12px] text-[#16a34a] whitespace-nowrap ${
                  isJustMatched ? 'animate-unitPopIn' : ''
                }`}
              >
                {unit}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center">
            <span
              className={`uppercase font-extrabold tracking-wide leading-[1.25] transition-all duration-200 line-clamp-2 ${
                isMatched
                  ? 'text-[#15803d]'
                  : isSelected
                  ? 'text-[#0369a1]'
                  : 'text-[#2c1810]'
              } ${
                title.includes('180ml') || title.length > 14
                  ? 'text-[11.5px] sm:text-[12px]'
                  : 'text-[12.5px] sm:text-[13.5px]'
              }`}
            >
              {title}
            </span>
            {subtitle && (
              <span className="text-[10px] sm:text-[11px] text-[#6b5847] leading-[1.2] font-semibold uppercase tracking-wider truncate mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Huy hiệu hoàn thành khi matched */}
      {side === 'left' && isMatched && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[13px] font-bold">check</span>
        </div>
      )}

      {side === 'right' && (
        <div className="shrink-0 w-4.5 h-4.5 flex items-center justify-center">
          {isMatched ? (
            <span
              className="material-symbols-outlined text-[17px] text-[#16a34a]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              verified
            </span>
          ) : (
            <span className="material-symbols-outlined text-[15px] text-[#d7c2ba]">
              radio_button_unchecked
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default MatchCard;
