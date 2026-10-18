import React, { useState, useMemo } from 'react';
import { ScreenId, MATCH_DATA, ASSETS, MatchPair, StoreInfo } from '../types';
import { sound } from '../sound';
import MatchCard from './game2/MatchCard';
import { Game2IntroModal, Game2WonModal, Game2OverModal } from './game2/Game2Modals';
import SelectStoreModal from './game2/SelectStoreModal';

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

  // 3. Modals kết quả (hỗ trợ hash QA)
  const [showWonModal, setShowWonModal] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#game2_won';
  });
  const [showOverModal, setShowOverModal] = useState<boolean>(false);
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);

  // Seed đảo thứ tự cột bên phải để tăng tính tương tác & thử thách minigame
  const [rightOrderSeed, setRightOrderSeed] = useState<number>(0);

  const totalPairs = MATCH_DATA.length; // 5 cặp

  // Cột bên phải: đảo thứ tự ngẫu nhiên cố định theo seed
  const shuffledRightItems = useMemo<MatchPair[]>(() => {
    const items = [...MATCH_DATA];
    for (let i = items.length - 1; i > 0; i--) {
      const j = (i * 3 + rightOrderSeed + 1) % (i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [rightOrderSeed]);

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

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      sound.playDropCatch();
      const updated = new Set(matchedIds);
      updated.add(leftId);
      setMatchedIds(updated);

      setSelectedLeft(null);
      setSelectedRight(null);

      // Nếu đã ghép đủ cả 5 cặp -> Tự động bật Popup Chiến Thắng
      if (updated.size === totalPairs) {
        setTimeout(() => {
          sound.playWin();
          setShowWonModal(true);
        }, 350);
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

        // =========================================================================
        // LOGIC HIỆN TẠI: Lật sai 1 lần là thua ngay ("đi luôn")
        // =========================================================================
        if (nextMistakes >= 1) {
          setShowOverModal(true);
        }

        /* =========================================================================
         * LOGIC CŨ (CHO PHÉP SAI 3 LẦN - MỞ RA NẾU ĐỔI Ý):
         * Để quay lại cho phép sai 3 lần, bạn chỉ cần comment đoạn `if (nextMistakes >= 1)`
         * ở trên lại và bỏ comment khối code dưới đây:
         *
         * if (nextMistakes >= 3) {
         *   setShowOverModal(true);
         * }
         * ========================================================================= */
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
    setRightOrderSeed((prev) => prev + 1);
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
          className="relative w-full rounded-[28px] p-3 sm:p-3.5 border-2 border-[#ebdccd] shadow-lg overflow-hidden flex flex-col justify-center my-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.80) 50%, rgba(255, 253, 249, 0.92) 100%), url(${ASSETS.game2BgCard})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Bàn cờ 2 cột ghép đôi: Căn chỉnh theo từng hàng để item trái & item phải luôn bằng nhau 100% */}
          <div className="flex flex-col gap-2 w-full">
            {MATCH_DATA.map((leftItem, idx) => {
              const rightItem = shuffledRightItems[idx];
              return (
                <div
                  key={leftItem.id}
                  className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full items-stretch"
                >
                  {/* Cột trái: mục thực phẩm */}
                  <MatchCard
                    title={leftItem.leftTitle}
                    subtitle={leftItem.leftSubtitle}
                    image={leftItem.leftImage}
                    isMatched={matchedIds.has(leftItem.id)}
                    isSelected={selectedLeft === leftItem.id}
                    isError={mismatchedLeft === leftItem.id}
                    side="left"
                    onClick={() => handleLeftClick(leftItem.id)}
                  />

                  {/* Cột phải: khẩu phần tương ứng (được shuffle) */}
                  {rightItem && (
                    <MatchCard
                      key={rightItem.id}
                      title={rightItem.rightTitle}
                      image={rightItem.rightImage}
                      icon={rightItem.rightIcon}
                      isMatched={matchedIds.has(rightItem.id)}
                      isSelected={selectedRight === rightItem.id}
                      isError={mismatchedRight === rightItem.id}
                      side="right"
                      onClick={() => handleRightClick(rightItem.id)}
                    />
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
