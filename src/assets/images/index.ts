// GamemauAmond/src/assets/images/index.ts
/**
 * ============================================================
 * REGISTRY TÀI NGUYÊN HÌNH ẢNH CỤC BỘ (LOCAL ASSETS REGISTRY)
 * Dự án: Glico Almond Koka Event Minigames
 * ============================================================
 * Đã cập nhật theo Brand Guidelines và yêu cầu:
 * - Loại bỏ hoàn toàn các sản phẩm vị Socola.
 * - Sử dụng các hình ảnh icon dinh dưỡng (.jpg) và logo header mới nhất.
 * - 4 dòng sản phẩm chính: 180ml (Original, Unsweetened) & 1L (Original, Unsweetened).
 * ============================================================
 */

// 1. Ảnh nền (Backgrounds) - assets/images/backgrounds/
import treeBackground from './backgrounds/tree-background.jpg';
import welcomeBg from './backgrounds/welcome-bg.jpg';
import wheelBg from './backgrounds/wheel-bg-new.png';
import game1BgDay from './backgrounds/game1-bg-day.jpg';
import game1BgDusk from './backgrounds/game1-bg-dusk.jpg';
import game1BgCard from './backgrounds/game1-bg-card.jpg';
import game2BgCard from './backgrounds/game2-bg-card.jpg';

// 2. Sản phẩm (Products) - assets/images/products/
// Chỉ giữ lại 4 dòng sản phẩm chính của Glico Almond Koka (Đã loại bỏ hoàn toàn vị Socola)
import almondKokaOriginal180ml from './products/almond-koka-original-180ml.png';
import almondKokaUnsweetened180ml from './products/almond-koka-unsweetened-180ml.png';
import almondKokaOriginal1L from './products/almond-koka-original-1l.png';
import almondKokaUnsweetened1L from './products/almond-koka-unsweetened-1l.png';
import almondKoka3Nuts180ml from './products/almond-koka-3nuts-180ml.png';

// 3. Nhận diện thương hiệu (Branding) - assets/images/branding/
import almondKokaLogo from './branding/almond-koka-logo.png';
import almondNutHeader from './branding/almond-nut-header.png';
import glicoLogoRed from './branding/glico-logo-red.png';
import glicoLogoWhite from './branding/glico-logo-white.png';
import glicoLogoSmall from './branding/glico-logo-small.png';
import no1JapanEmblem from './branding/no1-japan-emblem.png';

// 4. Nguyên liệu & Đạo cụ minigame (Game Items) - assets/images/game-items/
import lyHungSua from './game-items/ly-hung-sua.png';
import almondBadgeRound from './game-items/almond-badge-round.svg';
import sweetPotato from './game-items/sweet-potato.png';
import avocado from './game-items/avocado.png';
import spinach from './game-items/spinach.png';
import strawberry from './game-items/strawberry.png';
import servingAlmondPack from './game-items/serving-almond-pack.svg';
// Chướng ngại vật Minigame Vòng 1 (cần tránh) - Ảnh huy hiệu thật 100% tách nền
import obstacleSoybean from './game-items/obstacle-soybean.png';
import obstacleHighCholesterol from './game-items/obstacle-high-cholesterol.png';
import obstacleAnimalMilk from './game-items/obstacle-animal-milk.png';

// 5. Icon Dinh dưỡng (Icons) - assets/images/icons/ (Đã tách nền trong suốt)
import iconVitaminE from './icons/vitamin-e.png';
import iconZeroCholesterol from './icons/zero-cholesterol.png';
import iconRichFiber from './icons/rich-fiber.png';

// 6. Hình ảnh Quà Tặng Vòng Quay (Prizes) - assets/images/SKU_VQ_ALMONKOKA/
import prizeAlmondOriginal from './SKU_VQ_PERFECT/Almond Koka Original_180ML.png';
import prizeAlmondUnsweetened from './SKU_VQ_PERFECT/Almond Koka Unsweetened_180ML.png';
import prizePretzNori from './SKU_VQ_PERFECT/Pretz Nori Seaweed.png';
import prizePretzCheese from './SKU_VQ_PERFECT/Pretz Truffle Cheese.png';
import prizePockyChoco from './SKU_VQ_PERFECT/Pocky Chocolate flavour 40 gram.png';
import prizePockyCookies from './SKU_VQ_PERFECT/Pocky Cookies & cream flavour 40 gram.png';
import prizePockyBerry from './SKU_VQ_PERFECT/Pocky Strawberry flavour 39 gram.png';
import prizePockyMatcha from './SKU_VQ_PERFECT/Pocky Milky Matcha flavour 40 gram.png';
import prizePejoyChoco from './SKU_VQ_PERFECT/Pejoy Belgium Chocolate.png';
import prizePejoyMilk from './SKU_VQ_PERFECT/Pejoy Hokkaido Milk.png';

export const LOCAL_ASSETS = {
  backgrounds: {
    treeBackground,
    welcomeBg,
    wheelBg,
    game1BgDay,
    game1BgDusk,
    game1BgCard,
    game2BgCard,
  },
  products: {
    original180ml: almondKokaOriginal180ml,
    unsweetened180ml: almondKokaUnsweetened180ml,
    original1L: almondKokaOriginal1L,
    unsweetened1L: almondKokaUnsweetened1L,
    threeNuts180ml: almondKoka3Nuts180ml,
  },
  branding: {
    almondKokaLogo,
    almondNutHeader,
    glicoLogoRed,
    glicoLogoWhite,
    glicoLogoSmall,
    no1JapanEmblem,
  },
  gameItems: {
    lyHungSua,
    almondBadgeRound,
    sweetPotato,
    avocado,
    spinach,
    strawberry,
    servingAlmondPack,
    obstacleSoybean,
    obstacleHighCholesterol,
    obstacleAnimalMilk,
  },
  icons: {
    vitaminE: iconVitaminE,
    zeroCholesterol: iconZeroCholesterol,
    richFiber: iconRichFiber,
  },
  prizes: {
    almondOriginal: prizeAlmondOriginal,
    almondUnsweetened: prizeAlmondUnsweetened,
    pretzNori: prizePretzNori,
    pretzCheese: prizePretzCheese,
    pockyChoco: prizePockyChoco,
    pockyCookies: prizePockyCookies,
    pockyBerry: prizePockyBerry,
    pockyMatcha: prizePockyMatcha,
    pejoyChoco: prizePejoyChoco,
    pejoyMilk: prizePejoyMilk,
  },
};

export default LOCAL_ASSETS;
