export type ScreenId = 'home' | 'game1' | 'game2' | 'wheel' | 'claim';

export interface ProductItem {
  id: string;
  name: string;
  subName: string;
  badge: string;
  image: string;
  volume: string;
  highlights: string[];
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

// Public Google CDN images matching prompt HTML
export const ASSETS = {
  treeBackground: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsD9m0_aY5MNxDvyKG0vp6ljQHr4Tq6TRc5b465c6t55DD2xrdz_ij-61J5oJXvTSoFSUFJHrE1DHtJIXyWHcWupI3biybJ2yrYViGnYGEHZIoM-VikRVoO2hpJeNDbH8BdbynVtHRIH1NS87QqeiI53DP6T5ciHIqtsC_fQZbgsCBBkiM9LlA4-ZVh5V2kA0HzWYxWgNN9JAWSPtAfvpcEceuRvcrJC6uGzcWteVAWZywhDHGh_YLWkKdN7D_GVQgHw',
  almondKokaBoxTransparent: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiG080HFgt3CsowGcJ3LWnc9NX42SyXloEQYGUvxC8W8enTbNOFmruyx0JEGWu76msJgbSCB9T7ICUyykv_pezzlwh-3_56ngsSmvbFNPGLKvBOoIht5u6uxaL5RQyTmf664-RUrHC4kC4Gu6akoua_pyPrzEI9N4X8GoW7_4WMx_Y-7h6-IthZtPiww22reiYzcxmUXbt9pQpT39vp2AqVOqMSwpf1rbyG6JSXXE43WrnS0BazR303lleMPjaRGbjN3I',
  almondKokaUnsweetened: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrTWJhbEtvGVw97rVxWQV275hpA1TT_zewcD-FWiaYGz6muTDZowNg0lz0MV9nd0Sus8rDtkx4-duCv4P40XmTEeHQWiz1ETrT1vmAC5S_pcvS8lLzbEWjr2ZA8vUwgijCCM0zRcoSkhffsTOFducBP2jBal6uaBZOAO-QN2CBrbEikmUmZGENGpTAsZVOFNOeXm937e46P-dAnXSizOIHVq5GXvSfIPQDbWcbZ47dNzuT4ME45ZzfIudjztM7yLfwFMA',
  almondKokaOriginal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZXXwBKelCk23xiu7QB1HiUPzMEiVHXxCwk0c1v03RmMigVI-8W0rAUoiszGb64aQ4r-0a-md_8JcuVnwes1Cupg8BnO4tBtWOkn4CqGIrBF6yiotcIAV3tfLy89_jQDu97deU7u8YfMkjdiIsQX1vNyNLNmEqJklDffpz_w9ZWelLGEzY2VY4Ze-Or_v5IGJZArd6ScNBmTS1vA-wG_5InJoRb_ca0pXifE1A99-AsaeE1y2174bV_Jwi0ZrMYjHp1VA',
  almondKokaPackSmall: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjEvayo1dr9OqgPInSU1ezvpTfExipagb6f0axdl8lve649-sZatZLoaPkyK4_0q4EZP6cF2wg31Lbh7785iFjJlxYfxiU6g_3OExQgR8yZNyr88L_HFZFPI8oiirOXg3mEmOv2tpXeYnaoBGotcjnr5SafxhPIs4X4zkyZaJ4RXe2CZncas5QKMBJinhMvUytfhsEEsqHgmkc_MNw1jhBtS88BgpY-Vnq5rBHPBryfRoF-LKAKuAPng',
  no1JapanEmblem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLVcP7MJbuPAorvb85FBXTOH9_AQK4_tCGBONXiGVvBSjE5AVAoL4DZx7wussCW5Z2Vo_gaVKLX7airl3HjnPOdh7-4aMtMG84tL4IVAxva0ZMzBcBYuK3ZpB5ST7OOAn006W-DndHi4GxJ2WTRqVqjD6OoiPh0DIMxjXamoTrniMdsrhnVZf38cr7Rq3InJhtcNTVMrkxrfwLRI48035OUnd9VJfnghvVuIAiqtJFybqiOEw47PNEGAVjLNMQBSlpRpE',
  almondNutHeader: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs_8PQUVZIlT-BA2npmzBiFcvC5x6KYX-p8Fpo7oJtWahLLbtPYeb5ltrIwupNVhvz4qoHVs_fCPe5zS1Yv7NfBgAyY11jucFNY9gcstywy9wW-BqHmYrnBrqyjcJ4QSNqwl9iaajmD7g6yMF-ig-Eje9CBDM7nSTMlMlVFveWFgKEkmRBBSn4ThbOyAufkzXulCmlbQnNkDGO02mbdPwPrBWnqdXMFYfvtG4DSFK8Q9qEcEIry4jXrPOxGk2mMqoK-5U',
  glicoLogoRed: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1uyaAxC2KLDuWOkIyJAm7MWZ2Z_dMaNU2hkjUUd-dKdEyRi9NeGqMCoLc6JmkqN1iNCam2TQv-nyvZtUJUyBTslROOFszaVZIwy9LjfW7tzXCwZClf_W_b5MA-GWAkstSkgbt6OpeUco32Rfe0-UGoZ5rH3gbV9fHCZr6GdfPNZdmwbKAIXOTHIqPK_0ul3kA6QDTEdpGioFK5VDlSzwJ_H90SEVUCox49ZBySTdKcFD-0Cg-dMwWUg',
  glicoLogoSmall: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzbHv-Dud_Man8rb2Wlb3Lpm3x51L7sE97FC1tNwNwCSJYn7S8O6xmNg2d_0nHwxSykG4WcULUg-zDAzhzvAruKw19ZU0W1JuPv_qB4Nj4G2D1k5YGxND4eiFgUGwqog83mdy_0yPUflCjd7v5zPh-M_Jy_5Zmo8CeQ-jcwhuZvlJVj3B69yGsqPJ_tZe_IJ6gXy2GsDDQi7G2nHYWmsjLzBZVDrZxgwKv5KizQXu7UV5qRm8cEEZg9Q',
  // Food items for round 2
  foodSweetPotato: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjSHZRZRBiNTZ0htepcPdLsl8UENTDKGZL0jKGCuRFQn23G3EsR_WkzccscwCPMMhqq-UwycilYtR-5lOzf4HfLv_OQj3LQnYz3Sak9MIisuJwZ9oPJV5D0XYCfcTZbx1QHdUKCXOJrdt6gfmPHww2VQp7o02TVNwYW0PRzwaMWI3AkegXM30ThoyMJricawvNjXTOCeF7yjLVoK_ALtNxUzarbosbRB378r4o1f2qY83v8-1S_h66pA',
  foodAvocado: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8RCl14AfqCREIlvLyF3ERhuB78PhN6iwHuU-FwMkXywiv-1cVIBv4JQlmgJjJxPcxdX6mgqoZF4g1-6O7g9UIPqtZUVAMllCd3eT_AKebSsCtKq3UtP5pDlkigmBQL4MEg6Sf8l2RRkui0kZRGitmjTKrkkM__GmSHvCFE6LssFVmz8T6c41JIVGdG7PLGBqgXcb8elqpsbORRSGv7MTE9ZKtglbuPGjaUPF6MJmj',
  foodSpinach: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsTKbXsjlkzrc21Q4ZklzknRtq1t4jvWBd1cPcQ0MX-J1FsGMCJCpitfBC7B7AUMLBehfe_ae2rPmbFc70Fk-pYrKOhA0_0iJmJPigoeR_5MKqB1BrzzSJlEWA2ecZt6KxCFQpxPsexGTs-NZ7TFZLpY9AHdUAtHa4T0WaxAI9PAHqQW_s34yp1YNKhANXv0yBR2cUL3NtVCSO3F5F3BRxTHW4tgY7Ic6J5l1xRz7E',
  foodStrawberries: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH8e-HihV7YCrrC7iYw0q3JWjYzIzBPjdPGMnLX5pWTfUXKk8muSJ3qUOrPwhc9pmXnMn2VVi1sHrNdBdQbO0pWAKI2wwUTSGBs97srVMtVDfmVHPR6RPTp7MCJelLcnjyUfmhnTN1n7-ufH_xMwYFjeWMNxTUUSQedjrdYO5cBK5okXI5H_ePLinixVF7u91bjGkCqY9SOXPC46kIZI2AyjG0h_1Zndwbl34dW4vG',
  servingAlmondPack: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbbCA2jMQ0XjiFvrDWwJDQcNx7NzbFtAefs3MEsmoraULXWa_Q_Hzcbl6KHUf21q4dR_3k2EIbKbF9COkZJjWbj6Iu0T79JQaDSWStgH24G6cRyKueQmFyb4fL_eumSMfC65d5B1fxPSU4J6iHy0oWpL0MJZMjoGfIuXs-qrYcziv23XqqOwI7-NI7M2SdOmdQCMP_o1erXj8XMTCtZkk-BF2_bGMYx-t-PMOlrqlyB57bgWgxKNVXPA',
  almondBadgeRound: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByc1XFVI1AU92YklejvnDUTZf6bRrnQsv7HdRlJUnC2EYHSrc3fo8NMTw1gsbFXsGiokh-XmwQajDsK2hqv5b_po0jDmTaufY8_pDFcOAV4--SloW4NJeMHLU39pMYDbRciQLWcmQmgBjV--13D3N_PwgzZwxPDHiaISLmxfqKk5QhkBDuq-eagCcQYGK-pPvCQPWAFZpKMASG_7Wkgel16K-vr8hXeNfgNBNaajvmbkESMh1G5lHn0rjOsmyKUcQEfVA'
};

export const PRODUCT_CAROUSEL: ProductItem[] = [
  {
    id: 'unsweetened',
    name: 'Vị Không Đường (Unsweetened)',
    subName: 'Almond Koka Unsweetened',
    badge: 'Ít Calo - Chuẩn Dáng',
    image: ASSETS.almondKokaUnsweetened,
    volume: '180ml',
    highlights: ['100% Vitamin E tự nhiên', '0% Đường bổ sung', 'Giàu chất xơ thực vật']
  },
  {
    id: 'original',
    name: 'Vị Truyền Thống (Original)',
    subName: 'Almond Koka Original',
    badge: 'Bán Chạy Số 1 Nhật Bản',
    image: ASSETS.almondKokaOriginal,
    volume: '180ml',
    highlights: ['Thơm béo hạt hạnh nhân', 'Không Cholesterol', 'Không chứa Lactose']
  },
  {
    id: 'chocolate',
    name: 'Vị Sô-cô-la (Chocolate)',
    subName: 'Almond Koka Chocolate',
    badge: 'Đậm Vị Cacao Hảo Hạng',
    image: ASSETS.almondKokaBoxTransparent,
    volume: '180ml',
    highlights: ['Hòa quyện cacao Bỉ', 'Bổ sung khoáng chất', 'Vị ngon cả nhà đều yêu']
  }
];

export const MATCH_DATA: MatchPair[] = [
  {
    id: 'sweet_potato',
    leftTitle: 'Khoai lang',
    leftSubtitle: 'Giàu Vitamin E',
    leftImage: ASSETS.foodSweetPotato,
    rightTitle: '1.2 củ',
    rightSubtitle: 'Khẩu phần tương đương',
    rightImage: ASSETS.servingAlmondPack,
    factTitle: 'Khoai lang & Vitamin E',
    factText: 'Trong 100g khoai lang nấu chín (giữ nguyên vỏ) chỉ chứa khoảng 0.24 mg Vitamin E. Bạn cần ăn tới 1.2 củ khoai lang lớn mỗi ngày!'
  },
  {
    id: 'avocado',
    leftTitle: 'Quả Bơ Tươi',
    leftSubtitle: 'Chất béo tốt',
    leftImage: ASSETS.foodAvocado,
    rightTitle: '3.7 quả',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'nutrition',
    factTitle: 'Quả Bơ Tươi & Sức Khỏe',
    factText: 'Bơ chứa chất béo không bão hòa đơn lành mạnh, nhưng bạn cần ăn đến 3.7 quả bơ chín mỗi ngày để đạt 100% nhu cầu Vitamin E!'
  },
  {
    id: 'spinach',
    leftTitle: 'Cải bó xôi',
    leftSubtitle: 'Chống oxy hoá',
    leftImage: ASSETS.foodSpinach,
    rightTitle: '9 cành',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'eco',
    factTitle: 'Cải bó xôi (Rau bina)',
    factText: 'Cải bó xôi giàu dưỡng chất xanh, bạn cần dùng 9 cành lớn (~500g rau tươi) mỗi ngày mới đáp ứng đủ lượng Vitamin E bằng 1 ly Almond Koka!'
  },
  {
    id: 'strawberry',
    leftTitle: 'Dâu tây',
    leftSubtitle: 'Khoáng chất cao',
    leftImage: ASSETS.foodStrawberries,
    rightTitle: '1.8kg',
    rightSubtitle: 'Khẩu phần tương đương',
    rightIcon: 'grain',
    factTitle: 'Dâu tây thơm ngon',
    factText: 'Dâu tây dồi dào vitamin C nhưng hàm lượng Vitamin E rất khiêm tốn: bạn phải ăn đến 1.8kg dâu tươi mới đủ nhu cầu chuẩn mỗi ngày!'
  }
];

export const PRIZES: PrizeItem[] = [
  {
    id: 1,
    name: 'Almond Koka Unsweetened 180ml',
    short: 'Almond Koka Không Đường',
    desc: 'Sữa hạt hạnh nhân cao cấp vị nguyên chất thanh nhẹ',
    stock: 850,
    color: '#fffdf0',
    type: 'img',
    imgSrc: ASSETS.almondKokaUnsweetened,
    boxBg: '#06b6d4'
  },
  {
    id: 2,
    name: 'Almond Koka Original 180ml',
    short: 'Almond Koka Truyền Thống',
    desc: 'Sữa hạt hạnh nhân thơm ngậy dồi dào Vitamin E',
    stock: 920,
    color: '#fef3c7',
    type: 'img',
    imgSrc: ASSETS.almondKokaOriginal,
    boxBg: '#0284c7'
  },
  {
    id: 3,
    name: 'Bánh Que Pretz Rong Biển Nori',
    short: 'Pretz Rong Biển',
    desc: 'Bánh que giòn rụm đậm vị rong biển Nhật Bản',
    stock: 450,
    color: '#f0fdf4',
    type: 'box',
    brand: 'PRETZ',
    sub: 'NORI',
    boxBg: '#15803d',
    barColor: '#86efac',
    stickCol: '#fde047'
  },
  {
    id: 4,
    name: 'Bánh Que Pretz Truffle Cheese',
    short: 'Pretz Truffle Cheese',
    desc: 'Bánh que phô mai hòa quyện nấm Truffle quý phái',
    stock: 380,
    color: '#fefce8',
    type: 'box',
    brand: 'PRETZ',
    sub: 'CHEESE',
    boxBg: '#d97706',
    barColor: '#fde047',
    stickCol: '#fed7aa'
  },
  {
    id: 5,
    name: 'Bánh Que Pocky Chocolate 40g',
    short: 'Pocky Sô-cô-la',
    desc: 'Bánh que phủ sô-cô-la Glico danh tiếng',
    stock: 650,
    color: '#fff1f2',
    type: 'box',
    brand: 'Pocky',
    sub: 'CHOCO',
    boxBg: '#be123c',
    barColor: '#451a03',
    stickCol: '#78350f'
  },
  {
    id: 6,
    name: 'Bánh Que Pocky Cookies & Cream 40g',
    short: 'Pocky Cookies & Cream',
    desc: 'Hòa quyện kem sữa ngọt ngào và bánh quy giòn',
    stock: 520,
    color: '#f8fafc',
    type: 'box',
    brand: 'Pocky',
    sub: 'COOKIES',
    boxBg: '#1e293b',
    barColor: '#f1f5f9',
    stickCol: '#334155'
  },
  {
    id: 7,
    name: 'Bánh Que Pocky Dâu Tây Strawberry 39g',
    short: 'Pocky Dâu Tây',
    desc: 'Bánh que phủ kem dâu tây thơm ngon tươi mát',
    stock: 480,
    color: '#fdf2f8',
    type: 'box',
    brand: 'Pocky',
    sub: 'BERRY',
    boxBg: '#db2777',
    barColor: '#fbcfe8',
    stickCol: '#f43f5e'
  },
  {
    id: 8,
    name: 'Bánh Que Pocky Milky Matcha 40g',
    short: 'Pocky Trà Xanh Matcha',
    desc: 'Vị trà xanh matcha Uji Nhật Bản thanh mát hảo hạng',
    stock: 310,
    color: '#ecfdf5',
    type: 'box',
    brand: 'Pocky',
    sub: 'MATCHA',
    boxBg: '#047857',
    barColor: '#a7f3d0',
    stickCol: '#065f46'
  },
  {
    id: 9,
    name: 'Ống Bánh Pejoy Belgium Chocolate',
    short: 'Pejoy Bỉ Chocolate',
    desc: 'Ống bánh giòn nhân sô-cô-la Bỉ đậm đặc bên trong',
    stock: 260,
    color: '#faf5ff',
    type: 'box',
    brand: 'Pejoy',
    sub: 'CHOCO',
    boxBg: '#581c87',
    barColor: '#c084fc',
    stickCol: '#e9d5ff'
  },
  {
    id: 10,
    name: 'Ống Bánh Pejoy Hokkaido Milk',
    short: 'Pejoy Sữa Hokkaido',
    desc: 'Ống bánh giòn nhân sữa tươi Hokkaido béo ngậy',
    stock: 180,
    color: '#f0f9ff',
    type: 'box',
    brand: 'Pejoy',
    sub: 'MILK',
    boxBg: '#0284c7',
    barColor: '#bae6fd',
    stickCol: '#e0f2fe'
  }
];
