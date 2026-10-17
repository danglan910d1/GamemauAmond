import React, { useState, useMemo, useEffect } from 'react';
import { StoreInfo, DEFAULT_STORES, ASSETS } from '../../types';
import { APPS_SCRIPT_URL } from '../../config';
import Button from '../ui/Button';
import { sound } from '../../sound';

export interface SelectStoreModalProps {
  isOpen: boolean;
  onConfirm: (store: StoreInfo) => void;
  onClose?: () => void;
}

export const SelectStoreModal: React.FC<SelectStoreModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const [stores, setStores] = useState<StoreInfo[]>(() => {
    try {
      const saved = localStorage.getItem('almond_koka_admin_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_STORES;
  });

  const [selectedRegion, setSelectedRegion] = useState<'HCM' | 'HN'>('HCM');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    const initial = DEFAULT_STORES.find(s => s.region === 'HCM');
    return initial ? initial.id : '';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Nạp danh sách cửa hàng mới nhất từ Google Apps Script
  useEffect(() => {
    let mounted = true;
    fetch(`${APPS_SCRIPT_URL}?action=getStores`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.stores) && data.stores.length > 0) {
          setStores(data.stores);
          try {
            localStorage.setItem('almond_koka_admin_stores', JSON.stringify(data.stores));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback dùng stores hiện tại
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Tự động chọn cửa hàng mặc định của khu vực khi chuyển vùng
  useEffect(() => {
    const storeInRegion = stores.find((s) => s.region.toUpperCase() === selectedRegion.toUpperCase());
    if (storeInRegion) {
      setSelectedStoreId(storeInRegion.id);
    }
  }, [selectedRegion, stores]);

  // Lọc danh sách cửa hàng theo khu vực và tìm kiếm
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchRegion = store.region.toUpperCase() === selectedRegion.toUpperCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        store.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [stores, selectedRegion, searchQuery]);

  // Chọn khu vực (HN hoặc HCM)
  const handleSelectRegion = (region: 'HCM' | 'HN') => {
    sound.playClick();
    setSelectedRegion(region);
    setSearchQuery('');
  };

  const handleSelectStore = (storeId: string) => {
    sound.playClick();
    setSelectedStoreId(storeId);
  };

  const handleConfirm = () => {
    if (!selectedStoreId) return;
    const store = stores.find((s) => s.id === selectedStoreId);
    if (!store) return;
    sound.playClick();
    onConfirm(store);
  };

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#2d120a]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none"
    >
      <div className="w-full max-w-[370px] sm:max-w-[400px] bg-[#fdfbf7] rounded-[32px] p-5 sm:p-6 border-2 border-[#eedecf] shadow-2xl flex flex-col relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Logo Glico bên góc phải trên */}
        <div className="absolute top-4 right-4 z-10 flex items-center">
          <img
            src={ASSETS.glicoLogoRed}
            alt="Glico"
            className="h-7 sm:h-8 object-contain filter drop-shadow-xs"
          />
        </div>

        {/* Nút đóng nếu có */}
        {onClose && (
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#ebdccd] text-[#6b5847] flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}

        {/* Header Icon Hạt Hạnh Nhân có Logo Almond Koka + Brand */}
        <div className="flex flex-col items-center text-center mb-4 pt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#fffdf5] via-[#fef3c7] to-white p-2.5 flex items-center justify-center shadow-lg border-2 border-[#f59e0b] mb-2.5">
            <img
              src={ASSETS.almondNutHeader}
              alt="Almond Koka"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-xs mb-2">
            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider">
              BƯỚC CHỌN ĐỊA ĐIỂM
            </span>
          </div>

          <h2 className="font-extrabold text-[#3c2415] text-[22px] sm:text-[24px] leading-tight">
            Chọn Điểm Nhận Quà
          </h2>
          <p className="text-[13.5px] sm:text-[14px] text-[#78350f] mt-1 leading-snug">
            Vui lòng chọn khu vực và cửa hàng bạn muốn đến nhận thưởng
          </p>
        </div>

        {/* 1. CHỌN KHU VỰC (HN hoặc HCM) */}
        <div className="mb-4">
          <label className="block text-[13.5px] sm:text-[14px] font-bold text-[#4a1d0f] uppercase tracking-wide mb-2">
            1. Khu vực Tỉnh / Thành Phố *
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectRegion('HCM')}
              className={`py-3 px-3.5 rounded-2xl border-2 font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRegion === 'HCM'
                  ? 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white border-[#b45309] shadow-md scale-[1.02]'
                  : 'bg-white text-[#5c4436] border-[#e7ded4] hover:bg-[#faf4ed]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                location_city
              </span>
              TP. Hồ Chí Minh
            </button>

            <button
              type="button"
              onClick={() => handleSelectRegion('HN')}
              className={`py-3 px-3.5 rounded-2xl border-2 font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRegion === 'HN'
                  ? 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white border-[#b45309] shadow-md scale-[1.02]'
                  : 'bg-white text-[#5c4436] border-[#e7ded4] hover:bg-[#faf4ed]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                apartment
              </span>
              Hà Nội
            </button>
          </div>
        </div>

        {/* 2. CHỌN CỬA HÀNG */}
        <div className="mb-5 flex-1 min-h-0">
          <label className="block text-[13.5px] sm:text-[14px] font-bold text-[#4a1d0f] uppercase tracking-wide mb-2">
            2. Điểm tổ chức / Cửa Hàng ({selectedRegion}) *
          </label>

          {/* Ô tìm kiếm nhanh */}
          <div className="relative mb-2.5">
            <input
              type="text"
              placeholder="Tìm kiếm tên cửa hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e7ded4] rounded-xl px-3.5 py-2.5 pl-10 text-[14.5px] sm:text-[15px] text-[#3c2415] placeholder-[#a89283] focus:outline-none focus:border-[#d97706] transition-colors"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a89283] text-[20px] pointer-events-none">
              search
            </span>
          </div>

          {/* Danh sách cuộn các cửa hàng */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-[#eedecf] rounded-2xl p-2 bg-[#fbf8f4]">
            {filteredStores.length === 0 ? (
              <div className="py-6 text-center text-[13.5px] text-[#8c7465]">
                Không tìm thấy cửa hàng phù hợp
              </div>
            ) : (
              filteredStores.map((store) => {
                const isSelected = selectedStoreId === store.id;
                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => handleSelectStore(store.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#fef3c7] border-[#d97706] text-[#78350f] font-bold shadow-xs'
                        : 'bg-white border-[#ebdccd]/80 hover:bg-[#fff9f0] text-[#3c2415]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 ${
                          isSelected ? 'text-[#d97706]' : 'text-[#a89283]'
                        }`}
                      >
                        store
                      </span>
                      <span className="text-[14px] sm:text-[15px] font-semibold leading-tight truncate">
                        {store.name}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#d97706] bg-[#d97706]'
                          : 'border-[#d1c2b4] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Cửa hàng đang chọn tóm tắt */}
        {currentStore && (
          <div className="bg-[#fff9f0] border border-[#eedecf] rounded-xl px-3.5 py-2.5 mb-4 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#d97706] text-[20px] shrink-0">
              check_circle
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#b45309] uppercase">
                Đã chọn điểm nhận quà:
              </span>
              <span className="text-[13.5px] sm:text-[14.5px] font-bold text-[#3c2415] truncate">
                {currentStore.name} ({currentStore.region})
              </span>
            </div>
          </div>
        )}

        {/* Nút Xác Nhận & Vào Vòng Quay */}
        <Button
          variant="primary"
          size="lg"
          icon="arrow_forward"
          disabled={!selectedStoreId}
          onClick={handleConfirm}
          className={`w-full py-4 uppercase font-bold tracking-wider text-[16px] sm:text-[17px] shadow-xl ${
            !selectedStoreId ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          XÁC NHẬN & QUAY THƯỞNG
        </Button>
      </div>
    </div>
  );
};

export default SelectStoreModal;
