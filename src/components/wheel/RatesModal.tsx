// GamemauAmond/src/components/wheel/RatesModal.tsx
import React from 'react';
import { PRIZES } from '../../types';

export interface RatesModalProps {
  isOpen: boolean;
  totalStock: number;
  onClose: () => void;
}

export const RatesModal: React.FC<RatesModalProps> = ({ isOpen, totalStock, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#31302d]/60 backdrop-blur-xs flex items-end justify-center transition-opacity"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl p-4 shadow-2xl max-h-[82vh] flex flex-col animate-slideUp">
        <div className="w-10 h-1 bg-[#e6e2dc] rounded-full mx-auto mb-3 shrink-0" />

        <div className="flex items-center justify-between pb-2.5 border-b border-[#f1ede7] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#bc000c] text-[22px]">balance</span>
            <div>
              <h3 className="text-[16px] font-bold text-[#4a1d0f] leading-tight">
                Cơ Chế & Tỷ Lệ Kho Tồn
              </h3>
              <p className="text-[11px] text-[#52443d]">Minh bạch theo số lượng quà khả dụng</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#4a1d0f] active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-[#f7f3ed] p-2 rounded-xl my-2 flex items-center justify-between text-[11px] text-[#4a1d0f] shrink-0 border border-[#e6e2dc]">
          <span>Tổng tồn kho toàn chiến dịch:</span>
          <span className="font-extrabold text-[#bc000c] text-[13px]">
            {totalStock.toLocaleString()} sản phẩm
          </span>
        </div>

        {/* List 10 items */}
        <div className="overflow-y-auto space-y-1.5 pr-0.5 flex-1">
          {PRIZES.map((item, idx) => {
            const pct = ((item.stock / totalStock) * 100).toFixed(2);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#f1ede7] text-[#4a1d0f]"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#bc000c] flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-[#e6e2dc]">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="text-[12px] truncate text-[#4a1d0f] font-bold leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#52443d]">
                      Tồn kho: <b>{item.stock}</b>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#bc000c]/10 text-[#bc000c] text-[11px] font-extrabold shrink-0">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#4a1d0f] text-white font-bold text-[13px] active:scale-98 cursor-pointer"
          >
            ĐÃ HIỂU & TIẾP TỤC
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatesModal;
