export type ScreenId = 'home' | 'game1' | 'game2' | 'wheel' | 'claim';

export interface ProductItem {
  id: string;
  name: string;
  subName: string;
  badge: string;
  image: string;
  volume: string;
  highlights: string[];
  badgeBg?: string;
  badgeIcon?: string;
  badgeText?: string;
}

export interface MatchPair {
  id: string;
  leftTitle: string;
  leftSubtitle: string;
  leftImage: string;
  rightTitle: string;
  rightSubtitle: string;
  rightIcon?: string;
  rightImage?: string;
  factTitle: string;
  factText: string;
}

export interface PrizeItem {
  id: number;
  name: string;
  short: string;
  desc: string;
  stock: number;
  color: string;
  type: 'img' | 'box';
  imgSrc?: string;
  brand?: string;
  sub?: string;
  boxBg?: string;
  barColor?: string;
  stickCol?: string;
}

export interface DropItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  isHazard: boolean;
  size: number;
  /** Chỉ số sprite: huy hiệu dinh dưỡng (0-2) hoặc chướng ngại vật (0-2) */
  variant: number;
  /** Góc xoay nhẹ khi rơi (deg) */
  rotation: number;
}

export interface SplashEffect {
  id: number;
  x: number;
  y: number;
  text: string;
}

import { LOCAL_ASSETS } from './assets/images';


// Local Assets - 100% Offline & Vercel Build Ready (No external CDN dependencies)
export const ASSETS = {
  treeBackground: LOCAL_ASSETS.backgrounds.treeBackground,
  wheelBg: LOCAL_ASSETS.backgrounds.wheelBg,
  game1BgCard: LOCAL_ASSETS.backgrounds.game1BgCard,
  game2BgCard: LOCAL_ASSETS.backgrounds.game2BgCard,
  lyHungSua: LOCAL_ASSETS.gameItems.lyHungSua,
  obstacleSoybean: LOCAL_ASSETS.gameItems.obstacleSoybean,
  obstacleHighCholesterol: LOCAL_ASSETS.gameItems.obstacleHighCholesterol,
  obstacleAnimalMilk: LOCAL_ASSETS.gameItems.obstacleAnimalMilk,
  almondKokaBoxTransparent: LOCAL_ASSETS.products.original180ml,
  almondKokaUnsweetened: LOCAL_ASSETS.products.unsweetened180ml,
  almondKokaOriginal: LOCAL_ASSETS.products.original180ml,
  almondKokaUnsweetened1L: LOCAL_ASSETS.products.unsweetened1L,
  almondKokaOriginal1L: LOCAL_ASSETS.products.original1L,
  almondKokaPackSmall: LOCAL_ASSETS.products.original180ml,
  no1JapanEmblem: LOCAL_ASSETS.branding.no1JapanEmblem,
  almondNutHeader: LOCAL_ASSETS.branding.almondNutHeader,
  almondKokaLogo: LOCAL_ASSETS.branding.almondKokaLogo,
  glicoLogoRed: LOCAL_ASSETS.branding.glicoLogoRed,
  glicoLogoSmall: LOCAL_ASSETS.branding.glicoLogoSmall,
  // Food items for round 2
  foodSweetPotato: LOCAL_ASSETS.gameItems.sweetPotato,
  foodAvocado: LOCAL_ASSETS.gameItems.avocado,
  foodSpinach: LOCAL_ASSETS.gameItems.spinach,
  foodStrawberries: LOCAL_ASSETS.gameItems.strawberry,
  servingAlmondPack: LOCAL_ASSETS.gameItems.servingAlmondPack,
  almondBadgeRound: LOCAL_ASSETS.gameItems.almondBadgeRound,
  // Icons
  iconVitaminE: LOCAL_ASSETS.icons.vitaminE,
  iconZeroCholesterol: LOCAL_ASSETS.icons.zeroCholesterol,
  iconRichFiber: LOCAL_ASSETS.icons.richFiber,
};

// Bộ 4 SKU sản phẩm chính Almond Koka (Đúng chuẩn thứ tự & màu sắc badge)
export const PRODUCT_CAROUSEL: ProductItem[] = [
  {
    id: 'sku_1_ori_180',
    name: '180ml • Vị Nguyên Bản (Original)',
    subName: 'Almond Koka Original 180ml',
    badge: 'Bán Chạy Số 1 Nhật Bản',
    badgeText: '180ml • Vị Nguyên Bản (Original)',
    badgeBg: 'bg-[#0284c7]', // Màu xanh dương
    badgeIcon: 'eco',
    image: LOCAL_ASSETS.products.original180ml,
    volume: '180ml',
    highlights: ['Thơm béo hạt hạnh nhân', 'Không Cholesterol', 'Không chứa Lactose']
  },
  {
    id: 'sku_2_unsweet_180',
    name: '180ml • Vị Không Đường (Unsweetened)',
    subName: 'Almond Koka Unsweetened 180ml',
    badge: 'Ít Calo - Chuẩn Dáng',
    badgeText: '180ml • Vị Không Đường (Unsweetened)',
    badgeBg: 'bg-[#0d9488]', // Màu xanh ngọc
    badgeIcon: 'eco',
    image: LOCAL_ASSETS.products.unsweetened180ml,
    volume: '180ml',
    highlights: ['100% Vitamin E tự nhiên', '0% Đường bổ sung', 'Giàu chất xơ thực vật']
  },
  {
    id: 'sku_3_ori_1l',
    name: '1L • Vị Nguyên Bản (Original)',
    subName: 'Almond Koka Original 1000ml',
    badge: 'Family Pack 1000ml',
    badgeText: '1L • Vị Nguyên Bản (Original)',
    badgeBg: 'bg-[#0284c7]', // Màu xanh dương + Icon gia đình
    badgeIcon: 'family_restroom',
    image: LOCAL_ASSETS.products.original1L,
    volume: '1 Lít',
    highlights: ['Hương vị thơm béo tự nhiên', 'Dinh dưỡng trọn vẹn gia đình', '100% Hạt hạnh nhân California']
  },
  {
    id: 'sku_4_unsweet_1l',
    name: '1L • Vị Không Đường (Unsweetened)',
    subName: 'Almond Koka Unsweetened 1000ml',
    badge: 'Family Pack 1000ml',
    badgeText: '1L • Vị Không Đường (Unsweetened)',
    badgeBg: 'bg-[#0d9488]', // Màu xanh ngọc + Icon gia đình
    badgeIcon: 'family_restroom',
    image: LOCAL_ASSETS.products.unsweetened1L,
    volume: '1 Lít',
    highlights: ['0% Đường bổ sung', 'Bổ sung Vitamin E dồi dào', 'Phù hợp pha chế & làm bánh']
  }
];

export interface StoreInfo {
  id: string;
  region: 'HCM' | 'HN';
  name: string;
}

export const DEFAULT_STORES: StoreInfo[] = [
  // TP. Hồ Chí Minh
  { id: 'STORE_HCM_01', region: 'HCM', name: 'Mê Linh Point' },
  // Hà Nội
  { id: 'STORE_HN_01', region: 'HN', name: 'Lancaster' },
];

export const MATCH_DATA: MatchPair[] = [
  {
    id: 'sweet_potato',
    leftTitle: 'Khoai lang',
    leftSubtitle: 'Giàu Vitamin E',
    leftImage: ASSETS.foodSweetPotato,
    rightTitle: '1.2',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'restaurant',
    factTitle: 'Khoai lang & Vitamin E',
    factText: 'Trong 100g khoai lang nấu chín (giữ nguyên vỏ) chỉ chứa khoảng 0.24 mg Vitamin E. Bạn cần ăn tới 1.2 củ khoai lang lớn mỗi ngày!'
  },
  {
    id: 'avocado',
    leftTitle: 'Quả Bơ Tươi',
    leftSubtitle: 'Chất béo tốt',
    leftImage: ASSETS.foodAvocado,
    rightTitle: '3.7',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'restaurant',
    factTitle: 'Quả Bơ Tươi & Sức Khỏe',
    factText: 'Bơ chứa chất béo không bão hòa đơn lành mạnh, nhưng bạn cần ăn đến 3.7 quả bơ chín mỗi ngày để đạt 100% nhu cầu Vitamin E!'
  },
  {
    id: 'spinach',
    leftTitle: 'Cải bó xôi',
    leftSubtitle: 'Chống oxy hoá',
    leftImage: ASSETS.foodSpinach,
    rightTitle: '9',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'restaurant',
    factTitle: 'Cải bó xôi (Rau bina)',
    factText: 'Cải bó xôi giàu dưỡng chất xanh, bạn cần dùng 9 cành lớn (~500g rau tươi) mỗi ngày mới đáp ứng đủ lượng Vitamin E bằng 1 ly Almond Koka!'
  },
  {
    id: 'strawberry',
    leftTitle: 'Dâu tây',
    leftSubtitle: 'Khoáng chất cao',
    leftImage: ASSETS.foodStrawberries,
    rightTitle: '1.8',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'restaurant',
    factTitle: 'Dâu tây thơm ngon',
    factText: 'Dâu tây dồi dào vitamin C nhưng hàm lượng Vitamin E rất khiêm tốn: bạn phải ăn đến 1.8kg dâu tươi mới đủ nhu cầu chuẩn mỗi ngày!'
  },
  {
    id: 'almond_koka',
    leftTitle: 'Sữa Almond Koka',
    leftSubtitle: '100% Vitamin E',
    leftImage: ASSETS.almondKokaOriginal,
    rightTitle: '1',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'restaurant',
    factTitle: 'Sữa Almond Koka 180ml',
    factText: 'Chỉ 1 hộp Almond Koka 180ml đáp ứng trọn vẹn 100% nhu cầu Vitamin E tự nhiên mỗi ngày!'
  }
];

export const PRIZES: PrizeItem[] = [
  {
    id: 1,
    name: 'Almond Koka Unsweetened 180ml',
    short: 'Almond Koka Unsweetened',
    desc: 'Unsweetened premium almond milk, light and refreshing',
    stock: 850,
    color: '#fffdf0',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.almondUnsweetened,
    boxBg: '#06b6d4'
  },
  {
    id: 2,
    name: 'Almond Koka Original 180ml',
    short: 'Almond Koka Original',
    desc: 'Creamy and nutty almond milk rich in Vitamin E',
    stock: 920,
    color: '#fef3c7',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.almondOriginal,
    boxBg: '#0284c7'
  },
  {
    id: 3,
    name: 'Pretz Nori Seaweed',
    short: 'Pretz Nori Seaweed',
    desc: 'Crispy biscuit sticks with savory Japanese seaweed',
    stock: 450,
    color: '#f0fdf4',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pretzNori,
    brand: 'PRETZ',
    sub: 'NORI',
    boxBg: '#15803d'
  },
  {
    id: 4,
    name: 'Pretz Truffle Cheese',
    short: 'Pretz Truffle Cheese',
    desc: 'Crispy biscuit sticks infused with truffle & cheese',
    stock: 380,
    color: '#fefce8',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pretzCheese,
    brand: 'PRETZ',
    sub: 'CHEESE',
    boxBg: '#d97706'
  },
  {
    id: 5,
    name: 'Pocky Chocolate flavour 40g',
    short: 'Pocky Chocolate',
    desc: 'Crispy biscuit stick dipped in rich smooth chocolate',
    stock: 650,
    color: '#fff1f2',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pockyChoco,
    brand: 'Pocky',
    sub: 'CHOCO',
    boxBg: '#be123c'
  },
  {
    id: 6,
    name: 'Pocky Cookies & Cream flavour 40g',
    short: 'Pocky Cookies & Cream',
    desc: 'Crispy biscuit stick with milk cream & cookie crumbles',
    stock: 520,
    color: '#f8fafc',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pockyCookies,
    brand: 'Pocky',
    sub: 'COOKIES',
    boxBg: '#1e293b'
  },
  {
    id: 7,
    name: 'Pocky Strawberry flavour 39g',
    short: 'Pocky Strawberry',
    desc: 'Fruity strawberry cream over crunchy biscuit stick',
    stock: 480,
    color: '#fdf2f8',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pockyBerry,
    brand: 'Pocky',
    sub: 'BERRY',
    boxBg: '#db2777'
  },
  {
    id: 8,
    name: 'Pocky Milky Matcha flavour 40g',
    short: 'Pocky Milky Matcha',
    desc: 'Authentic Japanese Uji matcha cream over biscuit stick',
    stock: 310,
    color: '#ecfdf5',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pockyMatcha,
    brand: 'Pocky',
    sub: 'MATCHA',
    boxBg: '#047857'
  },
  {
    id: 9,
    name: 'Pejoy Belgium Chocolate',
    short: 'Pejoy Belgium Chocolate',
    desc: 'Crispy biscuit shell filled with decadent Belgian chocolate',
    stock: 260,
    color: '#faf5ff',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pejoyChoco,
    brand: 'Pejoy',
    sub: 'CHOCO',
    boxBg: '#581c87'
  },
  {
    id: 10,
    name: 'Pejoy Madagascar Vanilla Cream',
    short: 'Pejoy Madagascar Vanilla',
    desc: 'Crispy biscuit shell filled with aromatic Madagascar vanilla cream',
    stock: 180,
    color: '#fffbeb',
    type: 'img',
    imgSrc: LOCAL_ASSETS.prizes.pejoyVanilla,
    brand: 'Pejoy',
    sub: 'VANILLA',
    boxBg: '#d97706'
  }
];
