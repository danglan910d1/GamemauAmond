import React from 'react';
import { ScreenId, ASSETS } from '../types';
import { sound } from '../sound';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  onToggleSound,
  title
}) => {
  const getScreenTitle = () => {
    if (title) return title;
    switch (currentScreen) {
      case 'home':
        return 'Almond Koka';
      case 'game1':
        return 'Minigame Vòng 1';
      case 'game2':
        return 'Minigame Vòng 2';
      case 'wheel':
        return 'Vòng Quay May Mắn';
      case 'claim':
        return 'Xác Nhận Đổi Quà';
      default:
        return 'Almond Koka';
    }
  };

  const handleBack = () => {
    sound.playClick();
    switch (currentScreen) {
      case 'claim':
        onNavigate('wheel');
        break;
      case 'wheel':
        onNavigate('game2');
        break;
      case 'game2':
        onNavigate('game1');
        break;
      case 'game1':
        onNavigate('home');
        break;
      default:
        break;
    }
  };

  return (
    <header className="w-full shrink-0 z-40 bg-[#fdf9f3]/95 backdrop-blur-md pt-safe border-b border-[#ebdccd]/80 shadow-[0_1px_6px_rgba(74,29,15,0.06)]">
      <div className="h-14 px-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' ? (
            <button
              type="button"
              aria-label="Quay lại"
              onClick={handleBack}
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-[#4a1d0f] hover:bg-[#ebdccd]/60 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center -ml-1">
              <span className="material-symbols-outlined text-[22px] text-[#4a1d0f]">spa</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <img
              src={ASSETS.almondNutHeader}
              alt="Almond Koka No.1"
              className="h-7 w-auto object-contain drop-shadow-xs"
            />
            <h1 className="font-bold text-[17px] text-[#4a1d0f] tracking-tight truncate max-w-[190px]">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            type="button"
            aria-label="Bật/Tắt âm"
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#4a1d0f] hover:bg-[#ebdccd]/60 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>
        </div>
      </div>

      {/* Screen Quick Tabs bar */}
      <div className="px-3 pb-2 pt-0.5 max-w-md mx-auto flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-bold">
        {[
          { id: 'home', label: 'Trang Chủ' },
          { id: 'game1', label: 'Vòng 1' },
          { id: 'game2', label: 'Vòng 2' },
          { id: 'wheel', label: 'Vòng Quay' },
          { id: 'claim', label: 'Đổi Quà' }
        ].map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate(tab.id as ScreenId);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[#5c2e16] text-white shadow-xs'
                  : 'bg-white/80 text-[#85746c] hover:bg-white border border-[#dfcebd]/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
