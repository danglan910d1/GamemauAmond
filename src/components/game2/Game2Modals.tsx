// GamemauAmond/src/components/game2/Game2Modals.tsx
import React from "react";
import { ASSETS } from "../../types";
import Button from "../ui/Button";

/* ============================================================
   1. INTRO MODAL DẪN CHUYỆN (BẬT TRƯỚC KHI VÀO CHƠI VÒNG 2)
   ============================================================ */
export interface Game2IntroModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const Game2IntroModal: React.FC<Game2IntroModalProps> = ({
  isOpen,
  onStart,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#fdfbf7] rounded-[36px] p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp pt-4">
        {/* Visual đỉnh: Hộp sữa Almond Koka 180ml với hiệu ứng hào quang */}
        <div className="relative mb-3 flex items-center justify-center">
          <img
            src={ASSETS.almondKokaOriginal}
            alt="Almond Koka 180ml"
            className="h-28 sm:h-32 w-auto object-contain drop-shadow-xl"
          />
          <div className="absolute -top-1 -right-2 text-2xl animate-bounce">
            💡
          </div>
        </div>

        {/* Chip giới thiệu */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] shadow-xs mb-3">
          <span className="typo-caption tracking-tight leading-none text-[12px] sm:text-[12.5px] font-bold uppercase">
            VÒNG 2 • GHÉP ĐÔI DINH DƯỠNG
          </span>
        </div>

        {/* Đoạn text dẫn chuyện theo đúng yêu cầu */}
        <h2 className="font-bold text-[#3c2415] tracking-tight leading-[1.4] text-[16px] sm:text-[17px] mb-5 px-1">
          Mỗi ngày bạn cần{" "}
          <span className="text-[#b45309] font-bold">100 mg Vitamin E</span>.
          Bạn có biết nguồn dưỡng chất đó đến từ đâu không?
        </h2>

        {/* Nút CTA BẮT ĐẦU VÒNG 2 */}
        <Button
          variant="primary"
          size="lg"
          icon="play_arrow"
          onClick={onStart}
          className="w-full py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[18px] shadow-xl"
        >
          BẮT ĐẦU VÒNG 2
        </Button>
      </div>
    </div>
  );
};

/* ============================================================
   2. POPUP THÀNH CÔNG (KHI GHÉP ĐỦ 5/5 CẶP)
   ============================================================ */
export interface Game2WonModalProps {
  isOpen: boolean;
  onNextRound: () => void;
}

export const Game2WonModal: React.FC<Game2WonModalProps> = ({
  isOpen,
  onNextRound,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#fdfbf7] rounded-[36px] p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp pt-2">
        {/* Hộp sữa Almond Koka nhô lên phía trên đỉnh (như GameWonModal) */}
        <div className="relative -mt-20 mb-2 flex items-center justify-center">
          <img
            src={ASSETS.almondKokaOriginal}
            alt="Hộp sữa Almond Koka"
            className="h-32 sm:h-36 w-auto object-contain drop-shadow-2xl"
          />
          <div className="absolute -top-1 -right-2 text-2xl animate-bounce">
            ✨
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-[18px]">
              verified
            </span>
          </div>
        </div>

        {/* Chip ✨ XUẤT SẮC ĐẠT 100% ✨ */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-md border border-white/60 mb-3">
          <span className="typo-caption tracking-tight leading-none text-[12px] sm:text-[12.5px] font-bold uppercase">
            ✨ XUẤT SẮC ĐẠT 100% ✨
          </span>
        </div>

        {/* Tiêu đề chính */}
        <h2 className="font-bold text-[#3c2415] tracking-tight leading-[1.25] text-[22px] sm:text-[23px] mb-3">
          Bạn đã ghép nối
          <br />
          thành công!
        </h2>

        {/* Thông điệp giáo dục súc tích */}
        <div className="bg-[#fff9f0] rounded-2xl p-3 border border-[#eedecf] mb-5 w-full">
          <p className="typo-body text-[#5c4436] text-[12.5px] leading-[1.35] font-semibold">
            Chỉ với{" "}
            <span className="text-[#b45309] font-bold">
              1 hộp Almond Koka 180ml
            </span>{" "}
            mỗi ngày, bạn đã bổ sung đủ{" "}
            <span className="text-[#b45309] font-bold">100% Vitamin E</span> tự
            nhiên và dồi dào chất xơ!
          </p>
        </div>

        {/* Nút CTA: NHẬN THƯỞNG (chuyển sang Vòng Quay) */}
        <Button
          variant="primary"
          size="lg"
          icon="military_tech"
          onClick={onNextRound}
          className="w-full py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[18px] shadow-xl"
        >
          NHẬN THƯỞNG
        </Button>
      </div>
    </div>
  );
};

/* ============================================================
   3. POPUP THẤT BẠI (KHI GHÉP SAI HOẶC BỎ CUỘC)
   ============================================================ */
export interface Game2OverModalProps {
  isOpen: boolean;
  onGoHome: () => void;
}

export const Game2OverModal: React.FC<Game2OverModalProps> = ({
  isOpen,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#2d120a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#fdfbf7] rounded-[36px] p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col items-center text-center relative animate-scaleUp">
        {/* Visual đỉnh: Hộp sữa Almond Koka 180ml */}
        <div className="relative mb-3 flex items-center justify-center">
          <img
            src={ASSETS.almondKokaOriginal}
            alt="Almond Koka 180ml"
            className="h-32 sm:h-36 w-auto object-contain drop-shadow-xl"
          />
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#dc2626] border-2 border-white text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[19px] font-bold leading-none">
              close
            </span>
          </div>
        </div>

        {/* Chip đỏ THẤT BẠI */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#fee2e2] border border-[#fca5a5] text-[#b91c1c] shadow-xs mb-3">
          <span className="typo-caption tracking-tight leading-none text-[12px] sm:text-[12.5px] font-bold uppercase">
            THẤT BẠI
          </span>
        </div>

        {/* Tiêu đề chính */}
        <h2 className="font-bold text-[#3c2415] tracking-tight leading-[1.25] text-[22px] sm:text-[23px] mb-5">
          Hãy uống 1 ly
          <br />
          Almond Koka và
          <br />
          quay lại nhé!
        </h2>

        {/* Nút CTA duy nhất: VỀ TRANG CHỦ (không cho chơi lại) */}
        <Button
          variant="primary"
          size="lg"
          icon="home"
          iconColor="text-[#f59e0b]"
          onClick={onGoHome}
          className="w-full py-3.5 sm:py-4 uppercase font-bold tracking-wider text-[17px] sm:text-[18px] shadow-xl"
        >
          VỀ TRANG CHỦ
        </Button>
      </div>
    </div>
  );
};
