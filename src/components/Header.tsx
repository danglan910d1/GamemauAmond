// GamemauAmond/src/components/Header.tsx
import React from "react";
import { ScreenId, ASSETS } from "../types";
import { sound } from "../sound";

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
  title,
}) => {
  const getScreenTitle = () => {
    if (title) return title;
    switch (currentScreen) {
      case "home":
        return "Almond Koka";
      case "game1":
        return "Minigame Vòng 1";
      case "game2":
        return "Minigame Vòng 2";
      case "wheel":
        return "Vòng Quay May Mắn";
      case "claim":
        return "Xác Nhận Đổi Quà";
      default:
        return "Almond Koka";
    }
  };

  const handleBack = () => {
    sound.playClick();
    switch (currentScreen) {
      case "claim":
        onNavigate("wheel");
        break;
      case "wheel":
        onNavigate("game2");
        break;
      case "game2":
        onNavigate("game1");
        break;
      case "game1":
        onNavigate("home");
        break;
      default:
        break;
    }
  };

  return (
    <header className="w-full shrink-0 z-40 bg-[#fdf9f3]/95 backdrop-blur-md pt-safe border-b border-[#ebdccd]/80 shadow-[0_1px_6px_rgba(74,29,15,0.06)]">
      <div className="h-14 px-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {currentScreen !== "home" && (
            <button
              type="button"
              aria-label="Quay lại"
              onClick={handleBack}
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-[#4a1d0f] hover:bg-[#ebdccd]/60 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </button>
          )}

          {/* Icon Hạt Hạnh Nhân Chuẩn Brand - Đã xóa nền thừa, trọn vẹn, không cắt góc */}
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-6 flex items-center justify-center shrink-0">
              <img
                src={ASSETS.almondNutHeader}
                alt="Almond Koka"
                className="h-full w-auto object-contain filter drop-shadow-xs"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] text-[#4a1d0f] tracking-tight leading-none">
                {currentScreen === "home" ? "ALMOND KOKA" : getScreenTitle()}
              </span>
              <span className="text-[10px] font-semibold text-[#856b5d] leading-none mt-0.5">
                {currentScreen === "home"
                  ? "アーモンド効果 • Sống Thanh Xuân"
                  : "Almond Koka"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            type="button"
            aria-label="Bật/Tắt âm"
            onClick={onToggleSound}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#4a1d0f] hover:bg-[#ebdccd]/60 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              {soundEnabled ? "volume_up" : "volume_off"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
