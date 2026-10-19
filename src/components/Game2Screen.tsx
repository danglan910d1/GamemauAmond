import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScreenId, MATCH_DATA, ASSETS, MatchPair, StoreInfo } from '../types';
import { sound } from '../sound';
import MatchCard from './game2/MatchCard';
import { Game2IntroModal, Game2WonModal, Game2OverModal } from './game2/Game2Modals';
import SelectStoreModal from './game2/SelectStoreModal';

interface MatchLine {
  id: string;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isNew: boolean;
}

/** Hàm xáo trộn ngẫu nhiên hoàn toàn (Fisher-Yates) cho cột khẩu phần ăn bên phải */
const shuffleRightCards = (data: MatchPair[]): MatchPair[] => {
  const items = [...data];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  // Đảm bảo không để nhiều cặp bị trùng vị trí dòng ban đầu (để tạo độ thử thách)
  let samePosCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === data[i].id) samePosCount++;
  }
  if (samePosCount >= 2 && items.length > 2) {
    [items[0], items[1]] = [items[1], items[0]];
  }
  return items;
};

interface Game2ScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onNextRound: (store?: StoreInfo) => void;
  onGoHome?: () => void;
}

export const Game2Screen: React.FC<Game2ScreenProps> = ({
  onNavigate,
  onNextRound,
  onGoHome,
}) => {
  // 1. Intro Modal state: hiển thị dẫn chuyện trước khi bắt đầu (hỗ trợ hash QA)
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#game2_board' || window.location.hash === '#game2_won')) {
      return false;
    }
    return true;
  });

  // 2. Logic bàn ghép đôi
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [mismatchedLeft, setMismatchedLeft] = useState<string | null>(null);
  const [mismatchedRight, setMismatchedRight] = useState<string | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  // 3. Khẩu phần ăn được xáo trộn ngẫu nhiên hoàn toàn mỗi lượt chơi
  const [shuffledRightItems, setShuffledRightItems] = useState<MatchPair[]>(() => shuffleRightCards(MATCH_DATA));

  // 4. Hiệu ứng nối & phình to khẩu phần ăn khi ghép đúng
  const [matchLines, setMatchLines] = useState<MatchLine[]>([]);
  const [justMatchedId, setJustMatchedId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const leftCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // 5. Modals kết quả (hỗ trợ hash QA)
  const [showWonModal, setShowWonModal] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#game2_won';
  });
  const [showOverModal, setShowOverModal] = useState<boolean>(false);
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);

  const totalPairs = MATCH_DATA.length; // 5 cặp

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    sound.playClick();
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id)) return;
    sound.playClick();
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  // Tự động tính toán lại tọa độ các đường nối khi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const board = boardRef.current;
      if (!board) return;
      const bRect = board.getBoundingClientRect();
      setMatchLines((prev) =>
        prev.map((l) => {
          const leftEl = leftCardRefs.current[l.id];
          const rightEl = rightCardRefs.current[l.id];
          if (!leftEl || !rightEl) return l;
          const lRect = leftEl.getBoundingClientRect();
          const rRect = rightEl.getBoundingClientRect();
          const x1 = lRect.right - bRect.left;
          const y1 = lRect.top + lRect.height / 2 - bRect.top;
          const x2 = rRect.left - bRect.left;
          const y2 = rRect.top + rRect.height / 2 - bRect.top;
          const midX = (x1 + x2) / 2;
          const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
          return { ...l, d, x1, y1, x2, y2 };
        })
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      sound.playDropCatch();
      const updated = new Set(matchedIds);
      updated.add(leftId);
      setMatchedIds(updated);

      // Kích hoạt hiệu ứng phình to cho khẩu phần ăn tương ứng
      setJustMatchedId(leftId);

      // Tính toán đường nối SVG từ mép phải thẻ trái sang mép trái thẻ phải
      const board = boardRef.current;
      const leftEl = leftCardRefs.current[leftId];
      const rightEl = rightCardRefs.current[leftId];

      if (board && leftEl && rightEl) {
        const bRect = board.getBoundingClientRect();
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        const x1 = lRect.right - bRect.left;
        const y1 = lRect.top + lRect.height / 2 - bRect.top;
        const x2 = rRect.left - bRect.left;
        const y2 = rRect.top + rRect.height / 2 - bRect.top;

        const midX = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        setMatchLines((prev) => [
          ...prev.filter((l) => l.id !== leftId),
          { id: leftId, d, x1, y1, x2, y2, isNew: true },
        ]);

        // Sau 800ms: khẩu phần thu lại kích thước bình thường, đường nối chuyển về trạng thái tĩnh
        window.setTimeout(() => {
          setJustMatchedId(null);
          setMatchLines((prev) =>
            prev.map((l) => (l.id === leftId ? { ...l, isNew: false } : l))
          );
        }, 800);
      }

      setSelectedLeft(null);
      setSelectedRight(null);

      // Nếu đã ghép đủ cả 5 cặp -> Tự động bật Popup Chiến Thắng
      if (updated.size === totalPairs) {
        setTimeout(() => {
          sound.playWin();
          setShowWonModal(true);
        }, 600);
      }
    } else {
      sound.playError();
      setMismatchedLeft(leftId);
      setMismatchedRight(rightId);

      const nextMistakes = mistakesCount + 1;
      setMistakesCount(nextMistakes);

      setSelectedLeft(null);
      setSelectedRight(null);

      setTimeout(() => {
        setMismatchedLeft(null);
        setMismatchedRight(null);

        // Lật sai 1 lần là thua ngay
        if (nextMistakes >= 1) {
          setShowOverModal(true);
        }
      }, 650);
    }
  };

  const resetRound = () => {
    sound.playClick();
    setMatchedIds(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setMismatchedLeft(null);
    setMismatchedRight(null);
    setMistakesCount(0);
    setShowWonModal(false);
    setShowOverModal(false);
    setJustMatchedId(null);
    setMatchLines([]);
    setShuffledRightItems(shuffleRightCards(MATCH_DATA));
  };

  const handleGoHomeInternal = () => {
    sound.playClick();
    if (onGoHome) {
      onGoHome();
    } else {
      onNavigate('home');
    }
  };

  return (
    <div
      className="relative flex-1 w-full max-w-md mx-auto px-3.5 pt-3 pb-safe flex flex-col justify-between overflow-y-auto select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(253, 249, 243, 0.72) 0%, rgba(253, 249, 243, 0.50) 50%, rgba(253, 249, 243, 0.78) 100%), url(${ASSETS.game2BgCard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col w-full flex-1 justify-center">
        {/* Game HUD Bar: 1 Chip duy nhất ở giữa, trùng khớp với số giọt ở Game 1 (bỏ chip VÒNG 2) */}
        <div className="flex items-center justify-center mb-3 shrink-0">
          <div className="inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xs border border-[#eedecf]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center shadow-xs">
              <img
                src={ASSETS.almondNutHeader}
                alt="Hạt hạnh nhân"
                className="w-4 h-5 object-contain"
              />
            </div>

            <span className="typo-heading text-[#3c2415] text-[15px] sm:text-[16px] leading-none">
              <b className="font-bold text-[#b45309]">{matchedIds.size}/5</b> Cặp
            </span>

            {/* 5 chấm tròn tiến độ trùng khớp thiết kế Game 1 */}
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#e7ded4]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < matchedIds.size
                      ? 'bg-[#d97706] scale-110 shadow-xs'
                      : 'bg-[#e7ded4]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Khung chơi game (Game Arena Card): Dùng game2-bg-card.jpg làm nền, căn chỉnh cân đối */}
        <div
          ref={boardRef}
          className="relative w-full rounded-[28px] p-3 sm:p-3.5 border-2 border-[#ebdccd] shadow-lg overflow-hidden flex flex-col justify-center my-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.80) 50%, rgba(255, 253, 249, 0.92) 100%), url(${ASSETS.game2BgCard})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* SVG Overlay: Vẽ các tia nối giữa thực phẩm & khẩu phần ăn tương ứng */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <filter id="game2Glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {matchLines.map((line) => (
              <g key={line.id}>
                {/* Lớp ánh hào quang phía dưới */}
                <path
                  d={line.d}
                  fill="none"
                  stroke="#86efac"
                  strokeWidth={line.isNew ? 7 : 5}
                  strokeOpacity={line.isNew ? 0.75 : 0.45}
                  strokeLinecap="round"
                  filter={line.isNew ? 'url(#game2Glow)' : undefined}
                />
                {/* Tia nối chính: Dùng màu xanh đậm đồng nhất #16a34a để cả đường ngang và đường chéo đều rõ nét 100% */}
                <path
                  d={line.d}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth={line.isNew ? 4 : 3}
                  strokeLinecap="round"
                  className={line.isNew ? 'animate-connectLine' : ''}
                />
                {/* Chấm tròn neo ở thẻ trái */}
                <circle
                  cx={line.x1}
                  cy={line.y1}
                  r={line.isNew ? 4.5 : 3.5}
                  fill="#16a34a"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
                {/* Chấm tròn neo ở thẻ phải */}
                <circle
                  cx={line.x2}
                  cy={line.y2}
                  r={line.isNew ? 4.5 : 3.5}
                  fill="#16a34a"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </svg>

          {/* Bàn cờ 2 cột ghép đôi: Căn chỉnh theo từng hàng để item trái & item phải luôn bằng nhau 100% */}
          <div className="flex flex-col gap-2 w-full relative z-0">
            {MATCH_DATA.map((leftItem, idx) => {
              const rightItem = shuffledRightItems[idx];
              return (
                <div
                  key={leftItem.id}
                  className="flex items-stretch justify-between w-full h-[62px] sm:h-[64px]"
                >
                  {/* Cột trái: Rộng hơn (178px - 186px) để text Sữa Almond Koka không bị cắt */}
                  <div className="w-[178px] sm:w-[186px] h-full shrink-0">
                    <MatchCard
                      cardRef={(el) => {
                        leftCardRefs.current[leftItem.id] = el;
                      }}
                      title={leftItem.leftTitle}
                      subtitle={leftItem.leftSubtitle}
                      image={leftItem.leftImage}
                      isMatched={matchedIds.has(leftItem.id)}
                      isSelected={selectedLeft === leftItem.id}
                      isError={mismatchedLeft === leftItem.id}
                      side="left"
                      onClick={() => handleLeftClick(leftItem.id)}
                    />
                  </div>

                  {/* Cột phải: Ngắn lại (~104px - 110px) nhưng đầy đủ không gian không bị đè nội dung */}
                  {rightItem && (
                    <div className="w-[104px] sm:w-[110px] h-full shrink-0">
                      <MatchCard
                        key={rightItem.id}
                        cardRef={(el) => {
                          rightCardRefs.current[rightItem.id] = el;
                        }}
                        title={rightItem.rightTitle}
                        image={rightItem.rightImage}
                        icon={rightItem.rightIcon}
                        isMatched={matchedIds.has(rightItem.id)}
                        isJustMatched={justMatchedId === rightItem.id}
                        isSelected={selectedRight === rightItem.id}
                        isError={mismatchedRight === rightItem.id}
                        side="right"
                        onClick={() => handleRightClick(rightItem.id)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Đã loại bỏ hoàn toàn nút Chơi lại và nút Đến vòng quay ở dưới */}

      {/* Modals Game 2 */}
      <Game2IntroModal
        isOpen={showIntroModal}
        onStart={() => setShowIntroModal(false)}
      />

      <Game2WonModal
        isOpen={showWonModal}
        onNextRound={() => {
          setShowWonModal(false);
          setShowStoreModal(true);
        }}
      />

      <SelectStoreModal
        isOpen={showStoreModal}
        onConfirm={(store) => {
          setShowStoreModal(false);
          onNextRound(store);
        }}
        onClose={() => setShowStoreModal(false)}
      />

      <Game2OverModal
        isOpen={showOverModal}
        onGoHome={handleGoHomeInternal}
      />
    </div>
  );
};

export default Game2Screen;
