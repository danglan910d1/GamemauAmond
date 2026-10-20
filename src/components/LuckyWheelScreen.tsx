import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { ScreenId, PRIZES, PrizeItem, ASSETS, StoreInfo, DEFAULT_STORES } from "../types";
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

const getCachedPrizes = (storeId: string): { list: PrizeItem[]; ready: boolean } => {
  try {
    const raw = localStorage.getItem(`almond_koka_stock_${storeId}`);
    if (raw) {
      const stockMap = JSON.parse(raw);
      if (stockMap && typeof stockMap === "object") {
        const list = PRIZES.map((p) => {
          const rawVal = stockMap[String(p.id)] ?? stockMap[p.id];
          const num = parseInt(String(rawVal), 10);
          return {
            ...p,
            stock: isNaN(num) ? 0 : Math.max(0, num),
          };
        });
        const hasStock = list.some((p) => p.stock > 0);
        return { list, ready: hasStock };
      }
    }
  } catch (e) {
    console.warn("[LuckyWheel] Lỗi đọc cache tồn kho:", e);
  }
  return {
    list: PRIZES.map((p) => ({ ...p, stock: 0 })),
    ready: false,
  };
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

  const initialStockData = getCachedPrizes(currentStoreId);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [spinsAvailable, setSpinsAvailable] = useState<number>(1);
  const [prizesList, setPrizesList] = useState<PrizeItem[]>(initialStockData.list);
  const [isStockReady, setIsStockReady] = useState<boolean>(initialStockData.ready);
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tính tổng tồn kho khả dụng hiện tại của cửa hàng
  const totalAvailableStock = prizesList.reduce(
    (sum, p) => sum + (typeof p.stock === "number" && p.stock > 0 ? p.stock : 0),
    0
  );
  // Cửa hàng chưa nhập kho hoặc đã hết sạch toàn bộ quà
  const isOutOfStock = isStockReady && totalAvailableStock <= 0;

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

    // Cập nhật lại từ cache nếu có
    const cached = getCachedPrizes(storeId);
    if (cached.ready) {
      setPrizesList(cached.list);
      setIsStockReady(true);
    }

    let retryCount = 0;
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
            try {
              localStorage.setItem(
                `almond_koka_stock_${storeId}`,
                JSON.stringify(data.stock)
              );
            } catch {}

            setPrizesList(
              PRIZES.map((p) => {
                const liveQty = data.stock[String(p.id)] ?? data.stock[p.id];
                const qty = parseInt(String(liveQty), 10);
                return {
                  ...p,
                  stock: isNaN(qty) ? 0 : Math.max(0, qty),
                };
              })
            );
            setIsStockReady(true);
          } else if (retryCount < 2 && mounted) {
            retryCount++;
            setTimeout(fetchStock, 1500);
          }
        })
        .catch((err) => {
          console.warn("[LuckyWheel] Không thể kết nối Google Sheets để lấy tồn kho:", err);
          if (retryCount < 2 && mounted) {
            retryCount++;
            setTimeout(fetchStock, 1500);
          }
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
          try {
            localStorage.setItem(
              `almond_koka_stock_${currentStoreId}`,
              JSON.stringify(data.stock)
            );
          } catch {}

          setPrizesList(
            PRIZES.map((p) => {
              const liveQty = data.stock[String(p.id)] ?? data.stock[p.id];
              const qty = parseInt(String(liveQty), 10);
              return {
                ...p,
                stock: isNaN(qty) ? 0 : Math.max(0, qty),
              };
            })
          );
          setIsStockReady(true);
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
    setIsStockReady(cached.ready);
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

    // 1. Chỉ lọc các món CÒN TỒN KHO TRÊN GOOGLE SHEETS (stock > 0)
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

    // 2. Thuật toán Weighted Random: Tỷ lệ trúng tỷ lệ thuận chính xác theo tồn kho của Sheet
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
    // Chặn tuyệt đối nếu chưa tải xong tồn kho, hoặc cửa hàng chưa có kho, hoặc đang quay, hoặc hết lượt
    if (!isStockReady || isOutOfStock || isSpinningRef.current || isSpinning || spinsAvailable <= 0) return;

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
        - Chỉ kích hoạt quay khi đã sẵn sàng dữ liệu kho & kho còn quà
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
          isOutOfStock={isOutOfStock}
          onSpin={handleSpin}
        />
      </div>

      {/* Cảnh báo khi cửa hàng CHƯA NHẬP KHO hoặc ĐÃ HẾT QUÀ */}
      {isOutOfStock && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-[#3b1204]/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border-2 border-amber-500/80 flex flex-col items-center text-center animate-fadeIn">
          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[13px] mb-1">
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>CHƯA CÓ KHO QUÀ TẶNG</span>
          </div>
          <p className="text-[12px] text-amber-100/90 leading-snug mb-2.5">
            Chi nhánh <span className="font-bold text-white underline">{currentStoreName}</span> hiện chưa có dữ liệu tồn kho.
          </p>
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowStoreModal(true);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[12px] shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Đổi Cửa Hàng
            </button>
            <button
              type="button"
              disabled={isRefreshing}
              onClick={handleRefreshStock}
              className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[12px] flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[15px] ${isRefreshing ? "animate-spin" : ""}`}>
                refresh
              </span>
              <span>{isRefreshing ? "Đang tải..." : "Tải Lại"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Thông báo trạng thái đồng bộ tồn kho (nếu mạng chậm chưa tải xong) */}
      {!isStockReady && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 bg-amber-950/85 backdrop-blur-sm text-amber-100 text-[11px] font-semibold rounded-full shadow-lg border border-amber-500/30 whitespace-nowrap">
          <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
          <span>Đang đồng bộ kho quà tặng...</span>
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
