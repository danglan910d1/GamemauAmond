// GamemauAmond/src/components/game1/config.ts
/**
 * Cấu hình Minigame Vòng 1 – Hứng Giọt Dinh Dưỡng
 * Toàn bộ thông số hình học được đo trực tiếp trên ảnh ly-hung-sua.png (277 x 378, đã cắt sát viền).
 */
import { ASSETS } from '../../types';

/** Số huy hiệu cần hứng để thắng (mốc đầy 180ml) */
export const TARGET_DROPS = 6;

// ---------- Ly sữa 3D ----------
export const CUP_IMG_W = 277;
export const CUP_IMG_H = 381;
/** Chiều rộng hiển thị của ly trên Arena (px) - Tinh chỉnh gọn gàng, vừa vặn */
export const CUP_W = 94;
export const CUP_H = Math.round((CUP_W * CUP_IMG_H) / CUP_IMG_W); // ≈ 129px
/** Khoảng cách đáy ly tới đáy Arena (px) */
export const CUP_BOTTOM_OFFSET = 14;

/** Vị trí miệng ly theo tỉ lệ chiều cao ảnh (vành ly) */
export const CUP_MOUTH_RATIO_Y = 0.06;
/** Nửa bề rộng miệng ly hứng được (tỉ lệ theo CUP_W) */
export const CUP_MOUTH_HALF_RATIO = 0.42;
/** Nửa bề rộng thân ly cho va chạm chướng ngại vật (tỉ lệ theo CUP_W) */
export const CUP_BODY_HALF_RATIO = 0.4;

/** Vùng lòng ly (polygon clip, % theo khung ảnh) để đổ lớp sữa bên trong */
export const CUP_INNER_CLIP = 'polygon(6% 5%, 94% 5%, 85% 93%, 15% 93%)';

/**
 * Mức sữa (top, % chiều cao ảnh ly) theo số huy hiệu đã hứng 0 → 6.
 * Khớp vạch in sẵn trên ly: MỐC 1 ≈ 61%, MỐC 2 ≈ 38%, ĐẦY 180ml ≈ 16%.
 */
export const LIQUID_LEVELS = [93, 77, 61.5, 50, 38.5, 27, 16.5];

// ---------- CẤU HÌNH ĐỘ KHÓ MINIGAME VÒNG 1 (DỄ DÀNG TỰ CHỈNH SỬA) ----------
/** Kích thước đồng nhất cho mọi huy hiệu / chướng ngại vật (px) */
export const ITEM_SIZE = 50;

/**
 * 1. TỈ LỆ XUẤT HIỆN CHƯỚNG NGẠI VẬT (0.0 đến 1.0)
 * - 0.40: Trung bình (40% chướng ngại vật, 60% giọt sữa)
 * - 0.52: KHÓ (52% chướng ngại vật, 48% giọt sữa) -> Đang áp dụng
 * - 0.60+: Rất khó
 */
export const HAZARD_RATIO = 0.52;

/**
 * 2. KHOẢNG CÁCH THỜI GIAN GIỮA CÁC ĐỢT RƠI (ms) - Số CÀNG NHỎ thì rơi CÀNG DỒN DẬP
 * - SPAWN_INTERVAL_START: Lúc mới bắt đầu chơi (450ms)
 * - SPAWN_INTERVAL_MIN: Lúc gần thắng (300ms, rơi dồn dập kịch tính)
 */
export const SPAWN_INTERVAL_START = 450;
export const SPAWN_INTERVAL_MIN = 300;

/**
 * 3. TỐC ĐỘ RƠI CỦA VẬT THỂ (px / frame @60fps) - Số CÀNG LỚN thì rơi CÀNG NHANH
 * - BASE_SPEED: Tốc độ rơi ban đầu (4.4 px/frame -> rơi nhanh và hồi hộp)
 * - SPEED_STEP: Gia tốc tăng thêm mỗi khi bạn hứng được 1 giọt sữa (+0.24 px/frame)
 */
export const BASE_SPEED = 4.4;
export const SPEED_STEP = 0.24;

export interface SpriteDef {
  src: string;
  label: string;
}

/** 3 Huy hiệu dinh dưỡng – vật thể CẦN HỨNG */
export const NUTRITION_SPRITES: SpriteDef[] = [
  { src: ASSETS.iconVitaminE, label: '+1 Vitamin E' },
  { src: ASSETS.iconZeroCholesterol, label: '+1 0% Cholesterol' },
  { src: ASSETS.iconRichFiber, label: '+1 Chất xơ' },
];

/** 3 Chướng ngại vật – vật thể CẦN TRÁNH */
export const OBSTACLE_SPRITES: SpriteDef[] = [
  { src: ASSETS.obstacleSoybean, label: 'ĐẬU NÀNH' },
  { src: ASSETS.obstacleHighCholesterol, label: 'CHOLESTEROL CAO' },
  { src: ASSETS.obstacleAnimalMilk, label: 'SỮA ĐỘNG VẬT' },
];

/** Thông điệp mở khóa tại các mốc vạch trên ly */
export const MILESTONE_TEXT: Record<number, string> = {
  2: 'Đạt MỐC 1!',
  4: 'Đạt MỐC 2!',
  6: 'ĐẦY 180ml!',
};
