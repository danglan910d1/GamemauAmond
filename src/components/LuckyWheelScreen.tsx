import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  ScreenId,
  PRIZES,
  PrizeItem,
  ASSETS,
  StoreInfo,
  DEFAULT_STORES,
  EMERGENCY_SAFE_STOCK,
} from "../types";
import { APPS_SCRIPT_URL } from "../config";
import { sound } from "../sound";
import WheelCanvas from "./wheel/WheelCanvas";
import WinnerModal from "./wheel/WinnerModal";
import SelectStoreModal from "./game2/SelectStoreModal";

interface LuckyWheelScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onGoHome?: () => void;
  onClaimPrize?: (prize: PrizeItem) => void;
  selectedStore?: StoreInfo | null;
  onSelectStore?: (store: StoreInfo) => void;
}

/**
 * Xử lý dữ liệu tồn kho thông minh:
 * 1. Nếu Sheet có dữ liệu tồn kho thực tế (tổng stock > 0):
 *    -> DÙNG 100% DỮ LIỆU TỪ SHEET (món nào = 0 thì 0% trúng).
 * 2. Nếu Sheet chưa nhập kho (tất cả 10 món đều = 0) hoặc chưa kết nối:
 *    -> KÍCH HOẠT KHO DỰ PHÒNG AN TOÀN (EMERGENCY_SAFE_STOCK):
 *       - Khóa 100% 2 loại Sữa 180ml (stock = 0).
 *       - Cung cấp sẵn các món Snack/Bánh để vòng quay không bị gián đoạn.
 */
const resolveStockMap = (
  rawMap: Record<string, any> | null | undefined
): { list: PrizeItem[]; isUsingFallback: boolean } => {
  if (rawMap && typeof rawMap === "object") {
    const list = PRIZES.map((p) => {
      const rawVal = rawMap[String(p.id)] ?? rawMap[p.id];
      const num = parseInt(String(rawVal), 10);
      return {
        ...p,
        stock: isNaN(num) ? 0 : Math.max(0, num),
      };
    });

    const hasLiveStock = list.some((p) => p.stock > 0);
    if (hasLiveStock) {
      return { list, isUsingFallback: false };
    }
  }

  // Kích hoạt kho dự phòng khẩn cấp (Snack ONLY, 0% sữa 180ml)
  const fallbackList = PRIZES.map((p) => {
    const safeQty = EMERGENCY_SAFE_STOCK[String(p.id)] ?? 0;
    return {
      ...p,
      stock: safeQty,
    };
  });

  return { list: fallbackList, isUsingFallback: true };
};

const getCachedPrizes = (
  storeId: string
): { list: PrizeItem[]; isUsingFallback: boolean; isCached: boolean } => {
  try {
    const raw = localStorage.getItem(`almond_koka_stock_${storeId}`);
    if (raw) {
      const stockMap = JSON.parse(raw);
      const res = resolveStockMap(stockMap);
      return { ...res, isCached: true };
    }
  } catch (e) {
    console.warn("[LuckyWheel] Lỗi đọc cache tồn kho:", e);
  }
  const fallbackRes = resolveStockMap(null);
  return { ...fallbackRes, isCached: false };
};

export const LuckyWheelScreen: React.FC<LuckyWheelScreenProps> = ({
  onNavigate,
  onGoHome,
  selectedStore,
  onSelectStore,
}) => {
  // Xác định đúng thông tin store hiện tại
  const [activeStore, setActiveStore] = useState<StoreInfo>(() => {
    if (selectedStore) return selectedStore;
    try {
      const saved = localStorage.getItem("almond_koka_selected_store");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) return parsed;
      }
    } catch {}
    return DEFAULT_STORES[0];
  });

  useEffect(() => {
    if (selectedStore && selectedStore.id !== activeStore.id) {
      setActiveStore(selectedStore);
    }
  }, [selectedStore]);

  const currentStoreId = activeStore.id;
  const currentStoreName = activeStore.name;

  const initialStockData = useRef(getCachedPrizes(currentStoreId)).current;
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [spinsAvailable, setSpinsAvailable] = useState<number>(1);
  const [prizesList, setPrizesList] = useState<PrizeItem[]>(initialStockData.list);
  const [isStockReady, setIsStockReady] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(initialStockData.isUsingFallback);
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  const [showInspectorModal, setShowInspectorModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Vừa cập nhật");

  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#winner_ori") return PRIZES[1];
      if (window.location.hash === "#winner") return PRIZES[0];
    }
    return null;
  });

  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(() => {
    return (
      typeof window !== "undefined" &&
      (window.location.hash === "#winner" || window.location.hash === "#winner_ori")
    );
  });

  // Khóa đồng bộ chặn đứng mọi khả năng quay trùng/kép trong cùng 1 chu kỳ sự kiện
  const isSpinningRef = useRef<boolean>(false);

  // Nạp tồn kho realtime từ Google Sheets theo đúng cửa hàng đang kích hoạt
  useEffect(() => {
    let mounted = true;
    const storeId = currentStoreId;

    const fetchStock = () => {
      fetch(
        `${APPS_SCRIPT_URL}?action=getStock&storeId=${encodeURIComponent(storeId)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!mounted) return;
          if (data && data.success && data.stock) {
            console.log(
              `[LuckyWheel] Đã đồng bộ tồn kho từ Google Sheet (${storeId}):`,
              data.stock
            );
            const resolved = resolveStockMap(data.stock);
            // Chỉ lưu cache khi Sheet có số liệu thực
            if (!resolved.isUsingFallback) {
              try {
                localStorage.setItem(
                  `almond_koka_stock_${storeId}`,
                  JSON.stringify(data.stock)
                );
              } catch {}
            }

            setPrizesList(resolved.list);
            setIsUsingFallback(resolved.isUsingFallback);
            setIsStockReady(true);
            setLastSyncTime(
              new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            );
          }
        })
        .catch((err) => {
          console.warn("[LuckyWheel] Lỗi tải tồn kho:", err);
        });
    };

    fetchStock();

    return () => {
      mounted = false;
    };
  }, [currentStoreId]);

  const handleRefreshStock = () => {
    setIsRefreshing(true);
    sound.playClick();
    fetch(
      `${APPS_SCRIPT_URL}?action=getStock&storeId=${encodeURIComponent(currentStoreId)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setIsRefreshing(false);
        if (data && data.success && data.stock) {
          const resolved = resolveStockMap(data.stock);
          if (!resolved.isUsingFallback) {
            try {
              localStorage.setItem(
                `almond_koka_stock_${currentStoreId}`,
                JSON.stringify(data.stock)
              );
            } catch {}
          }

          setPrizesList(resolved.list);
          setIsUsingFallback(resolved.isUsingFallback);
          setIsStockReady(true);
          setLastSyncTime(
            new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      })
      .catch((err) => {
        setIsRefreshing(false);
        console.warn("[LuckyWheel] Lỗi làm mới tồn kho:", err);
      });
  };

  const handleConfirmStore = (store: StoreInfo) => {
    setShowStoreModal(false);
    setActiveStore(store);
    try {
      localStorage.setItem("almond_koka_selected_store", JSON.stringify(store));
    } catch {}
    if (onSelectStore) {
      onSelectStore(store);
    }
    const cached = getCachedPrizes(store.id);
    setPrizesList(cached.list);
    setIsUsingFallback(cached.isUsingFallback);
    setIsStockReady(true);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    chipTop: number;
    chipFontSize: number;
    wheelCenterY: number;
    wheelSize: number;
  }>({
    chipTop: 230,
    chipFontSize: 12,
    wheelCenterY: 480,
    wheelSize: 340,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const cW = el.clientWidth || 390;
      const cH = el.clientHeight || 750;

      // wheel-bg-new.png kích thước gốc 768 x 1376
      // Hiển thị dạng background-size: cover, background-position: center top
      const scale = Math.max(cW / 768, cH / 1376);

      // Đáy slogan "Sống thanh xuân từ bên trong": Y ≈ 375 px trên ảnh gốc 768x1376
      // Chip "QUAY LÀ TRÚNG" nằm ngay bên dưới dòng chữ slogan
      const chipTop = Math.round(390 * scale);
      const chipFontSize = Math.max(11, Math.min(13.5, Math.round(scale * 24)));
      const chipBottom = chipTop + 28;

      // Đỉnh của dải cong màu vàng "Cả Nhà Cùng Yêu" ở đáy: Y ≈ 1095 px trên ảnh gốc 768x1376
      const goldTop = Math.min(cH, Math.round(1095 * scale));

      // Khoảng chiều cao khả dụng giữa đáy chip và đỉnh dải màu vàng dưới cùng
      const availableHeight = Math.max(260, goldTop - 8 - (chipBottom + 8));

      // Kim chỉ (pointer) tại 12h nhô lên khỏi mép trên vòng quay khoảng 5%
      // Kích thước vòng quay: BỰ, nằm gọn giữa chip bên trên và dải màu vàng bên dưới
      const maxWheelByHeight = Math.floor(availableHeight / 1.05);
      const targetSize = Math.min(Math.round(cW * 0.92), 370);
      const wheelSize = Math.max(280, Math.min(targetSize, maxWheelByHeight));

      const pointerOverhang = Math.round(wheelSize * 0.05);
      const totalWheelH = wheelSize + pointerOverhang;
      const gap = Math.max(0, availableHeight - totalWheelH);
      const topPadding = 8 + Math.round(gap * 0.35);

      // Tâm vòng quay căn chỉnh hoàn hảo: Đỉnh kim dưới chip, đáy bánh xe nằm trên dải màu vàng
      const wheelCenterY = chipBottom + topPadding + pointerOverhang + Math.round(wheelSize / 2);

      setLayout({
        chipTop,
        chipFontSize,
        wheelCenterY,
        wheelSize,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pickWinningIndex = (): number => {
    // Chỉ ép khi chạy ở chế độ dev có hash #force_ori
    if (import.meta.env.DEV && typeof window !== "undefined" && window.location.hash.includes("force_ori")) {
      console.log("[LuckyWheel] Chế độ DEV test: Ép trúng Almond Koka Original 180ml");
      return 1;
    }

    // 1. Chỉ lọc các món CÒN TỒN KHO (stock > 0)
    const availablePrizes = prizesList
      .map((p, idx) => ({ ...p, originalIndex: idx }))
      .filter((p) => typeof p.stock === "number" && p.stock > 0);

    // Nếu tất cả các món đều hết tồn kho (<= 0), tuyệt đối không quay ra món hết hàng
    if (availablePrizes.length === 0) {
      console.warn("[LuckyWheel] Không có phần quà nào còn tồn kho > 0!");
      return -1;
    }

    const totalStock = availablePrizes.reduce(
      (sum, p) => sum + p.stock,
      0
    );

    if (totalStock <= 0) {
      console.warn("[LuckyWheel] Tổng tồn kho khả dụng <= 0!");
      return -1;
    }

    // 2. Thuật toán Weighted Random: Tỷ lệ trúng tỷ lệ thuận chính xác theo tồn kho thực tế
    // Món nào nhiều tồn kho -> tỷ lệ trúng cao.
    // Món nào ít tồn kho -> hiếm ra.
    // Món nào hết hàng (stock = 0) -> xác suất 0%, không bao giờ trúng.
    const random = Math.random();
    let accum = 0;
    for (let i = 0; i < availablePrizes.length; i++) {
      accum += availablePrizes[i].stock / totalStock;
      if (random <= accum) {
        return availablePrizes[i].originalIndex;
      }
    }

    return availablePrizes[availablePrizes.length - 1].originalIndex;
  };

  const handleSpin = () => {
    // Chặn tuyệt đối nếu đang quay hoặc hết lượt
    if (!isStockReady || isSpinningRef.current || isSpinning || spinsAvailable <= 0) return;

    const winningIndex = pickWinningIndex();
    if (winningIndex < 0 || !prizesList[winningIndex]) {
      console.warn("[LuckyWheel] Không có phần quà hợp lệ để quay!");
      return;
    }

    isSpinningRef.current = true;
    setIsSpinning(true);

    const winning = prizesList[winningIndex];

    const sliceCount = prizesList.length;
    const sliceDegree = 360 / sliceCount;
    const targetSliceCenter = winningIndex * sliceDegree + sliceDegree / 2;
    const stopAngle = (270 - targetSliceCenter + 360) % 360;

    const fullSpins = (6 + Math.floor(Math.random() * 2)) * 360;
    const prevNet = currentRotation % 360;
    const extraNeeded = (stopAngle - prevNet + 360) % 360;
    const delta = fullSpins + extraNeeded;

    const finalRotation = currentRotation + delta;
    setCurrentRotation(finalRotation);

    const tickInterval = setInterval(() => {
      sound.playWheelTick();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSpinsAvailable((prev) => Math.max(0, prev - 1));
      setWonPrize(winning);

      // Giảm tồn kho ngay tại local state & lưu lại vào localStorage
      setPrizesList((prev) => {
        const next = prev.map((p, idx) =>
          idx === winningIndex
            ? { ...p, stock: Math.max(0, p.stock - 1) }
            : p
        );
        try {
          const stockMap: Record<string, number> = {};
          next.forEach((p) => {
            stockMap[String(p.id)] = p.stock;
          });
          localStorage.setItem(`almond_koka_stock_${currentStoreId}`, JSON.stringify(stockMap));
        } catch {}
        return next;
      });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      sound.playWin();

      // Gửi API ghi nhận kết quả và TRỪ TỒN KHO trên Google Sheets (chỉ 1 lần duy nhất)
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'submitResult',
          storeId: currentStoreId,
          giftId: String(winning.id),
          giftName: winning.name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[LuckyWheel] Đã trừ tồn kho thành công:', data);
        })
        .catch((err) => {
          console.warn('[LuckyWheel] Lỗi trừ kho:', err);
        });

      setTimeout(() => {
        setShowWinnerModal(true);
      }, 500);
    }, 4200);
  };

  const handleGoHomeInternal = () => {
    isSpinningRef.current = false;
    sound.playClick();
    setShowWinnerModal(false);
    if (onGoHome) {
      onGoHome();
    } else {
      onNavigate("home");
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full max-w-md mx-auto overflow-hidden select-none"
      style={{
        backgroundImage: `url(${ASSETS.wheelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f6eecb",
      }}
    >
      {/* 
        Huy hiệu trạng thái kho hàng góc trên phải (cho PG/Admin dễ dàng quan sát & kiểm tra)
      */}
      <div className="absolute top-2.5 right-2.5 z-30 flex items-center">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowInspectorModal(true);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border transition-all cursor-pointer backdrop-blur-md ${
            isUsingFallback
              ? "bg-amber-600/90 text-white border-amber-300 animate-pulse"
              : "bg-emerald-700/90 text-white border-emerald-300 hover:brightness-110"
          }`}
          title="Bấm để kiểm tra chi tiết tồn kho & làm mới"
        >
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>{isUsingFallback ? "Kho Dự Phòng" : "Kho Sheet"}</span>
          <span className="material-symbols-outlined text-[14px]">tune</span>
        </button>
      </div>

      {/* 
        1. CHIP "QUAY LÀ TRÚNG":
        - Luôn nằm ngay dưới dòng chữ "Sống thanh xuân từ bên trong"
        - Tự động co giãn theo tỉ lệ background
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
        style={{
          top: `${layout.chipTop}px`,
        }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-gradient-to-r from-[#e60012] via-[#bc000c] to-[#99000a] text-white shadow-md border border-white/80 whitespace-nowrap">
          <span
            className="font-extrabold uppercase text-white tracking-wider leading-none whitespace-nowrap"
            style={{
              fontSize: `${layout.chipFontSize}px`,
            }}
          >
            QUAY LÀ TRÚNG
          </span>
        </div>
      </div>

      {/* 
        2. VÒNG QUAY MAY MẮN:
        - Bự hơn, ôm trọn từ dưới cổ bạn nam xuống sát mép đường cong "Cả Nhà Cùng Yêu"
        - Giữ nguyên toàn bộ 10 nan quạt trên vòng quay
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
        style={{
          top: `${layout.wheelCenterY}px`,
        }}
      >
        <WheelCanvas
          size={layout.wheelSize}
          currentRotation={currentRotation}
          isSpinning={isSpinning}
          isReady={isStockReady}
          isOutOfStock={false}
          onSpin={handleSpin}
        />
      </div>

      {/* Modal kiểm tra tồn kho trực tiếp (Stock Inspector) */}
      {showInspectorModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1e0a04]/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn"
        >
          <div className="w-full max-w-[360px] bg-[#fffdfa] rounded-3xl p-4 sm:p-5 border-2 border-amber-400 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleUp">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 border-b border-[#ebdccd]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-700 text-[20px]">
                  inventory
                </span>
                <h3 className="font-extrabold text-[15px] text-[#4a1d0f]">
                  Kiểm Tra Kho Quà Tặng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInspectorModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Thông tin Cửa Hàng & Trạng Thái Đồng Bộ */}
            <div className="my-2.5 p-2.5 rounded-xl bg-[#fef3c7]/60 border border-[#fde68a] text-[12px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-amber-900 font-medium">Chi nhánh:</span>
                <span className="font-extrabold text-amber-950">{currentStoreName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-900 font-medium">Trạng thái:</span>
                <span
                  className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    isUsingFallback
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {isUsingFallback ? "Kho Dự Phòng (Chưa nhập Sheet)" : "Đồng bộ 100% Google Sheet"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-800/80">
                <span>Cập nhật lúc:</span>
                <span>{lastSyncTime}</span>
              </div>
            </div>

            {/* Danh sách 10 món quà và số lượng còn lại */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[220px]">
              {prizesList.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-lg text-[12px] border ${
                      isOutOfStock
                        ? "bg-red-50/70 border-red-200 text-red-700"
                        : "bg-white border-amber-200/80 text-amber-950 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                      <span className="font-bold text-[11px] text-gray-500 w-4">
                        #{p.id}
                      </span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      <span
                        className={`font-black text-[12px] px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? "bg-red-200 text-red-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {isOutOfStock ? "0 (Hết)" : `${p.stock} cái`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Các nút hành động */}
            <div className="pt-3 mt-2 border-t border-[#ebdccd] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowInspectorModal(false);
                  setShowStoreModal(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#4a1d0f] font-bold text-[12px] transition-all cursor-pointer text-center"
              >
                Đổi Cửa Hàng
              </button>
              <button
                type="button"
                disabled={isRefreshing}
                onClick={handleRefreshStock}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[15px] ${isRefreshing ? "animate-spin" : ""}`}>
                  refresh
                </span>
                <span>{isRefreshing ? "Đang tải..." : "Tải Lại Sheet"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chọn lại cửa hàng */}
      <SelectStoreModal
        isOpen={showStoreModal}
        onConfirm={handleConfirmStore}
        onClose={() => setShowStoreModal(false)}
      />

      {/* Winner Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        wonPrize={wonPrize}
        onGoHome={handleGoHomeInternal}
      />
    </div>
  );
};

export default LuckyWheelScreen;
