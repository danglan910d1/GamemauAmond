import { useState, useEffect } from 'react';
import { ScreenId, PrizeItem, PRIZES, ASSETS, StoreInfo, DEFAULT_STORES } from './types';
import { APPS_SCRIPT_URL } from './config';
import { sound } from './sound';
import { preloadScreenAssets, preloadAllAppAssets } from './utils/assetLoader';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { Game1Screen } from './components/Game1Screen';
import { Game2Screen } from './components/Game2Screen';
import { LuckyWheelScreen } from './components/LuckyWheelScreen';
import { ClaimScreen } from './components/ClaimScreen';

const SCREEN_IDS: ScreenId[] = ['home', 'game1', 'game2', 'wheel', 'claim'];

// Hỗ trợ mở thẳng 1 màn hình qua URL hash để QA nhanh (VD: http://localhost:3000/#game1)
const getInitialScreen = (): ScreenId => {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  if (hash.startsWith('game1')) return 'game1';
  if (hash.startsWith('game2')) return 'game2';
  if (hash.startsWith('wheel') || hash === 'winner') return 'wheel';
  return SCREEN_IDS.includes(hash as ScreenId) ? (hash as ScreenId) : 'home';
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(getInitialScreen);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(PRIZES[0]);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(() => {
    try {
      const saved = localStorage.getItem('almond_koka_selected_store');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STORES[0];
  });
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(true);

  // Khởi động: Nạp trước tài nguyên màn hình ban đầu + nạp nền toàn bộ game
  useEffect(() => {
    let mounted = true;
    preloadScreenAssets(currentScreen).finally(() => {
      if (mounted) {
        setIsLoadingScreen(false);
      }
    });

    // Nạp trước ngầm toàn bộ hình ảnh các màn hình tiếp theo
    preloadAllAppAssets();

    // Nạp trước tồn kho từ Google Sheets cho cả 2 khu vực vào localStorage
    DEFAULT_STORES.forEach((st) => {
      fetch(`${APPS_SCRIPT_URL}?action=getStock&storeId=${encodeURIComponent(st.id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.stock) {
            try {
              localStorage.setItem('almond_koka_stock_' + st.id, JSON.stringify(data.stock));
            } catch {}
          }
        })
        .catch(() => {});
    });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playClick();
    }
  };

  /**
   * Điều hướng màn hình: Đảm bảo nạp 100% tài nguyên ảnh xong mới xuất hiện màn hình đó
   */
  const navigateTo = async (screen: ScreenId) => {
    setIsLoadingScreen(true);
    try {
      await preloadScreenAssets(screen);
    } catch {
      // Bỏ qua lỗi fallback
    }
    setCurrentScreen(screen);
    setIsLoadingScreen(false);
  };

  const handleStartGame = () => {
    navigateTo('game1');
  };

  const handleToGame2 = () => {
    navigateTo('game2');
  };

  const handleToWheel = async (store?: StoreInfo) => {
    const targetStore = store || selectedStore || DEFAULT_STORES[0];
    if (store) {
      setSelectedStore(store);
      try {
        localStorage.setItem('almond_koka_selected_store', JSON.stringify(store));
      } catch {}
    }
    setIsLoadingScreen(true);
    try {
      const assetPromise = preloadScreenAssets('wheel');
      const stockPromise = fetch(
        `${APPS_SCRIPT_URL}?action=getStock&storeId=${encodeURIComponent(targetStore.id)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.stock) {
            try {
              localStorage.setItem('almond_koka_stock_' + targetStore.id, JSON.stringify(data.stock));
            } catch {}
          }
        })
        .catch((err) => console.warn('[App] Lỗi tải tồn kho:', err));

      await Promise.all([assetPromise, stockPromise]);
    } catch {}
    setCurrentScreen('wheel');
    setIsLoadingScreen(false);
  };

  const handleClaimPrize = (prize: PrizeItem) => {
    setWonPrize(prize);
    navigateTo('claim');
  };

  const handleGoHome = () => {
    navigateTo('home');
  };

  return (
    <div className="min-h-screen w-full bg-[#ede5d8] flex items-center justify-center sm:p-4">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[440px] h-[100dvh] sm:h-[884px] bg-[#fdf9f3] flex flex-col shadow-2xl sm:rounded-[36px] overflow-hidden border border-[#d7c2ba]/50 relative">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />

        {/* Dynamic Screens */}
        <main className="flex-1 w-full flex flex-col overflow-hidden relative">
          {/* Màn hình chờ tải tài nguyên: Chờ load 100% ảnh mới hiển thị màn hình đích */}
          {isLoadingScreen && (
            <div className="absolute inset-0 z-50 bg-[#fdf9f3]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fadeIn select-none">
              <div className="relative mb-3 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#d97706]/20 via-[#fef3c7] to-white flex items-center justify-center animate-pulseSlow shadow-md border-2 border-[#eedecf]">
                  <img
                    src={ASSETS.almondNutHeader}
                    alt="Almond Koka"
                    className="w-10 h-10 object-contain drop-shadow-sm animate-bounce"
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] shadow-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-[#d97706] animate-ping" />
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Đang chuẩn bị màn chơi...
                </span>
              </div>
              <p className="text-[13px] text-[#78350f] font-semibold text-center">
                Đang tải tài nguyên hình ảnh chất lượng cao
              </p>
            </div>
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              onStart={handleStartGame}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'game1' && (
            <Game1Screen
              onNextRound={handleToGame2}
              onGoHome={handleGoHome}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'game2' && (
            <Game2Screen
              onNextRound={handleToWheel}
              onGoHome={handleGoHome}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'wheel' && (
            <LuckyWheelScreen
              onGoHome={handleGoHome}
              onClaimPrize={handleClaimPrize}
              onNavigate={navigateTo}
              selectedStore={selectedStore}
              onSelectStore={(st) => setSelectedStore(st)}
            />
          )}

          {currentScreen === 'claim' && (
            <ClaimScreen
              prize={wonPrize}
              onReturnWheel={handleToWheel}
              onGoHome={handleGoHome}
              onNavigate={navigateTo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
