import React, { useState } from 'react';
import { ScreenId, MATCH_DATA, ASSETS } from '../types';
import { sound } from '../sound';

interface Game2ScreenProps {
  onNextRound: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const Game2Screen: React.FC<Game2ScreenProps> = ({ onNextRound }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set(['sweet_potato'])); // Start with sweet potato matched or fresh
  const [mismatchedLeft, setMismatchedLeft] = useState<string | null>(null);
  const [mismatchedRight, setMismatchedRight] = useState<string | null>(null);

  // Active insight message
  const [currentInsight, setCurrentInsight] = useState<{
    title: string;
    text: string;
    isSuccess: boolean;
  }>({
    title: 'Khoai lang & Vitamin E',
    text: 'Trong 100g khoai lang nấu chín (giữ nguyên vỏ) chỉ chứa khoảng 0,24 mg Vitamin E. Bạn cần ăn đến 1.2 củ khoai lang mỗi ngày!',
    isSuccess: true
  });

  const totalPairs = MATCH_DATA.length;
  const isAllMatched = matchedIds.size === totalPairs;

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    sound.playClick();

    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }

    setSelectedLeft(id);

    // If right already selected, verify match
    if (selectedRight) {
      verifyMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id)) return;
    sound.playClick();

    if (selectedRight === id) {
      setSelectedRight(null);
      return;
    }

    setSelectedRight(id);

    // If left already selected, verify match
    if (selectedLeft) {
      verifyMatch(selectedLeft, id);
    }
  };

  const verifyMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // MATCH SUCCESS
      sound.playDropCatch();
      const updated = new Set(matchedIds);
      updated.add(leftId);
      setMatchedIds(updated);

      const item = MATCH_DATA.find((m) => m.id === leftId);
      if (item) {
        setCurrentInsight({
          title: item.factTitle,
          text: item.factText,
          isSuccess: true
        });
      }

      setSelectedLeft(null);
      setSelectedRight(null);

      if (updated.size === totalPairs) {
        sound.playWin();
      }
    } else {
      // MISMATCH ERROR
      sound.playError();
      setMismatchedLeft(leftId);
      setMismatchedRight(rightId);
      setCurrentInsight({
        title: 'Chưa chính xác!',
        text: 'Hai món này chưa khớp với nhau, hãy quan sát khẩu phần tương đương và thử lại nhé!',
        isSuccess: false
      });

      setSelectedLeft(null);
      setSelectedRight(null);

      setTimeout(() => {
        setMismatchedLeft(null);
        setMismatchedRight(null);
      }, 700);
    }
  };

  const resetRound = () => {
    sound.playClick();
    setMatchedIds(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setMismatchedLeft(null);
    setMismatchedRight(null);
    setCurrentInsight({
      title: 'Ghép Đôi Thực Phẩm',
      text: 'Chọn từng thực phẩm và khẩu phần tương ứng để so sánh hàm lượng Vitamin E nhé!',
      isSuccess: true
    });
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-3.5 pt-3 pb-safe flex flex-col justify-between overflow-y-auto select-none">
      <div className="flex flex-col w-full">
        {/* Game HUD Bar */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 bg-[#5c2e16] text-white px-3.5 py-1 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[17px] text-[#ffdbcc]" style={{ fontVariationSettings: '"FILL" 1' }}>
              stars
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider">VÒNG 2</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#e6e2dc] px-3 py-1 rounded-full shadow-sm">
              <img src={ASSETS.almondBadgeRound} alt="Almond Koka" className="w-4 h-4 object-contain inline-block" />
              <span className="text-[12px] text-[#411904] font-bold">
                Đã ghép: <span className="text-[#93000a] font-extrabold text-[14px]">{matchedIds.size}</span>/{totalPairs}
              </span>
            </div>

            <button
              type="button"
              onClick={resetRound}
              title="Chơi lại vòng 2"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f1ede7] hover:bg-[#e6e2dc] text-[#411904] active:scale-95 transition-all shadow-sm border border-[#d7c2ba]/40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
            </button>
          </div>
        </div>

        {/* Prompt Card with Mascot Packlet */}
        <div className="relative bg-white rounded-2xl p-3.5 shadow-sm mb-3 flex items-center gap-3 overflow-hidden border border-[#d7c2ba]/40">
          <div className="w-11 h-11 rounded-full bg-[#f1ede7] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#006494] text-[24px]">touch_app</span>
          </div>
          <div className="flex flex-col min-w-0 pr-10">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[15px] text-[#411904] font-bold leading-tight">
                Ghép Đôi Thực Phẩm
              </span>
              <img src={ASSETS.glicoLogoRed} alt="Glico" className="h-4 w-auto object-contain shrink-0" />
            </div>
            <span className="text-[11.5px] text-[#52443d] leading-snug">
              Nối thực phẩm giàu <b>Vitamin E</b> với khẩu phần tương đương mỗi ngày!
            </span>
          </div>
          {/* Mascot Packlet */}
          <div className="absolute -right-1 -bottom-2 w-12 h-16 rotate-6 pointer-events-none drop-shadow-md">
            <img src={ASSETS.almondKokaPackSmall} alt="Almond Koka" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* 2-Column Matching Arena */}
        <div className="relative w-full mb-3">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Column Left: Nguồn cung cấp */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-[#411904]" />
                <span className="text-[11px] uppercase tracking-wider text-[#52443d] font-bold">
                  NGUỒN CUNG CẤP
                </span>
              </div>

              {MATCH_DATA.map((item) => {
                const isMatched = matchedIds.has(item.id);
                const isSelected = selectedLeft === item.id;
                const isErr = mismatchedLeft === item.id;

                let cardStyle = 'bg-white border-[#d7c2ba]/40';
                if (isMatched) {
                  cardStyle = 'bg-[#f4faf5] border-[#2E8B57]/50 shadow-none';
                } else if (isErr) {
                  cardStyle = 'ring-2 ring-[#ba1a1a] bg-[#ffdad6]/40 animate-shake';
                } else if (isSelected) {
                  cardStyle = 'ring-2 ring-[#006494] bg-[#cae6ff]/30 scale-[1.02] shadow-sm';
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-full text-left relative rounded-xl p-2 shadow-xs flex items-center gap-2 border transition-all duration-150 active:scale-95 cursor-pointer ${cardStyle}`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#FAF4ED] flex items-center justify-center shrink-0 p-1 overflow-hidden">
                      <img
                        src={item.leftImage}
                        alt={item.leftTitle}
                        className="w-8 h-8 object-contain drop-shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-[13px] text-[#411904] font-bold leading-tight truncate">
                        {item.leftTitle}
                      </span>
                      <span className="text-[10px] text-[#52443d] leading-tight">
                        {item.leftSubtitle}
                      </span>
                    </div>

                    {isMatched && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2E8B57] text-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Column Right: Khẩu phần 100% E */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-[#006494]" />
                <span className="text-[11px] uppercase tracking-wider text-[#52443d] font-bold">
                  KHẨU PHẦN 100% E
                </span>
              </div>

              {MATCH_DATA.map((item) => {
                const isMatched = matchedIds.has(item.id);
                const isSelected = selectedRight === item.id;
                const isErr = mismatchedRight === item.id;

                let cardStyle = 'bg-white border-[#d7c2ba]/40';
                if (isMatched) {
                  cardStyle = 'bg-[#f4faf5] border-[#2E8B57]/50 shadow-none';
                } else if (isErr) {
                  cardStyle = 'ring-2 ring-[#ba1a1a] bg-[#ffdad6]/40 animate-shake';
                } else if (isSelected) {
                  cardStyle = 'ring-2 ring-[#006494] bg-[#cae6ff]/30 scale-[1.02] shadow-sm';
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleRightClick(item.id)}
                    className={`w-full text-left relative rounded-xl p-2 shadow-xs flex items-center gap-2 border transition-all duration-150 active:scale-95 cursor-pointer ${cardStyle}`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#f7f3ed] flex items-center justify-center shrink-0 p-0.5">
                      {item.rightImage ? (
                        <img
                          src={item.rightImage}
                          alt={item.rightTitle}
                          className="w-7 h-10 object-contain drop-shadow"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[#006494] text-[22px]">
                          {item.rightIcon || 'nutrition'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] text-[#411904] font-bold leading-tight truncate">
                        {item.rightTitle}
                      </span>
                      <span className="text-[10px] text-[#52443d] leading-tight truncate">
                        {item.rightSubtitle}
                      </span>
                    </div>

                    <div className="ml-auto pr-0.5">
                      {isMatched ? (
                        <span className="material-symbols-outlined text-[20px] text-[#2E8B57]" style={{ fontVariationSettings: '"FILL" 1' }}>
                          verified
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px] text-[#d7c2ba]">
                          radio_button_unchecked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Educational Insight Banner */}
        <div
          className={`rounded-2xl p-3.5 shadow-sm border relative overflow-hidden flex items-start gap-3 transition-all duration-300 min-h-[96px] mb-3 ${
            currentInsight.isSuccess
              ? 'bg-[#f8fbf8] border-[#2E8B57]/40'
              : 'bg-[#fff8f7] border-[#ba1a1a]/40'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
              currentInsight.isSuccess
                ? 'bg-[#e3f4e8] text-[#2E8B57]'
                : 'bg-[#ffdad6] text-[#ba1a1a]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              {currentInsight.isSuccess ? 'check_circle' : 'error'}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[14px] text-[#411904] font-bold leading-tight">
                {currentInsight.title}
              </span>
              <img src={ASSETS.glicoLogoRed} alt="Glico" className="h-4 w-auto object-contain" />
            </div>
            <p className="text-[12px] text-[#52443d] leading-relaxed">
              {currentInsight.text}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons: Replay & Continue */}
      <div className="flex items-center gap-2.5 w-full shrink-0 pb-2">
        <button
          type="button"
          onClick={resetRound}
          className="h-12 px-4 py-2 text-[#411904] text-[13.5px] font-bold rounded-full border border-[#d7c2ba]/50 bg-[#f7f3ed] hover:bg-[#f1ede7] active:scale-95 flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">replay</span>
          <span>Chơi lại</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNextRound();
          }}
          className={`flex-1 h-12 py-3 px-5 text-white text-[15px] font-extrabold rounded-full active:translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isAllMatched
              ? 'bg-[#2E8B57] shadow-[0_4px_0_#1E5D3A] active:shadow-[0_1px_0_#1E5D3A] animate-pulse'
              : 'bg-[#411904] shadow-[0_4px_0_#3A1C0C] active:shadow-[0_1px_0_#3A1C0C]'
          }`}
        >
          <span>{isAllMatched ? 'TIẾP TỤC BƯỚC 3' : 'BỎ QUA & ĐẾN BƯỚC 3'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
