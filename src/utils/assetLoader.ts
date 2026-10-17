// GamemauAmond/src/utils/assetLoader.ts
import { ScreenId, ASSETS, PRODUCT_CAROUSEL, MATCH_DATA, PRIZES } from '../types';

/**
 * Bộ nhớ đệm lưu trữ các HTMLImageElement đã nạp sẵn
 */
export const imageCache = new Map<string, HTMLImageElement>();

/**
 * Lấy ảnh đã tải trước từ cache
 */
export const getPreloadedImage = (src?: string): HTMLImageElement | undefined => {
  if (!src) return undefined;
  return imageCache.get(src);
};

/**
 * Nạp trước 1 hình ảnh đơn lẻ và đưa vào imageCache
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(new Image());
      return;
    }

    if (imageCache.has(src)) {
      const existing = imageCache.get(src)!;
      if (existing.complete) {
        resolve(existing);
        return;
      }
    }

    const img = new Image();
    img.src = src;

    if (img.complete) {
      imageCache.set(src, img);
      resolve(img);
      return;
    }

    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => {
      // Dù lỗi vẫn resolve để không treo app
      imageCache.set(src, img);
      resolve(img);
    };

    // Timeout 3.5s dự phòng cho mạng chập chờn
    setTimeout(() => {
      resolve(img);
    }, 3500);
  });
};

/**
 * Danh sách tài nguyên hình ảnh theo từng màn hình
 */
export const SCREEN_ASSETS: Record<ScreenId, string[]> = {
  home: [
    ASSETS.treeBackground,
    ASSETS.no1JapanEmblem,
    ASSETS.almondNutHeader,
    ASSETS.almondKokaLogo,
    ASSETS.iconVitaminE,
    ASSETS.iconZeroCholesterol,
    ASSETS.iconRichFiber,
    ...PRODUCT_CAROUSEL.map((p) => p.image),
  ],
  game1: [
    ASSETS.game1BgCard,
    ASSETS.lyHungSua,
    ASSETS.iconVitaminE,
    ASSETS.iconZeroCholesterol,
    ASSETS.iconRichFiber,
    ASSETS.obstacleSoybean,
    ASSETS.obstacleAnimalMilk,
    ASSETS.obstacleHighCholesterol,
    ASSETS.almondNutHeader,
    ASSETS.almondKokaOriginal,
  ],
  game2: [
    ASSETS.game2BgCard,
    ASSETS.almondNutHeader,
    ASSETS.almondKokaOriginal,
    ...MATCH_DATA.map((m) => m.leftImage),
  ],
  wheel: [
    ASSETS.wheelBg,
    ASSETS.almondKokaLogo,
    ASSETS.almondNutHeader,
    ...PRIZES.map((p) => p.imgSrc).filter((src): src is string => Boolean(src)),
  ],
  claim: [
    ASSETS.wheelBg,
    ASSETS.almondKokaLogo,
    ASSETS.almondNutHeader,
    ...PRIZES.map((p) => p.imgSrc).filter((src): src is string => Boolean(src)),
  ],
};

/**
 * Tải trước toàn bộ tài nguyên cho một màn hình cụ thể
 */
export const preloadScreenAssets = async (screen: ScreenId): Promise<void> => {
  const assets = SCREEN_ASSETS[screen] || [];
  const uniqueAssets = Array.from(new Set(assets.filter(Boolean)));
  await Promise.all(uniqueAssets.map((url) => preloadImage(url)));
};

/**
 * Tải trước toàn bộ tài nguyên của toàn bộ game trong nền
 */
export const preloadAllAppAssets = async (): Promise<void> => {
  const allUrls = Object.values(SCREEN_ASSETS).flat();
  const unique = Array.from(new Set(allUrls.filter(Boolean)));
  await Promise.all(unique.map((url) => preloadImage(url)));
};
