// Web Audio API lightweight sound effects + Background Music (BGM) for arcade experience

class SoundEffects {
  private ctx: AudioContext | null = null;
  private _enabled: boolean = true;
  private bgmAudio: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.bgmAudio = new Audio('/assets/sound/Stunts Cheer.mp4');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.55;
        this.bgmAudio.preload = 'auto';

        // Đảm bảo lặp liên tục không bao giờ dừng
        this.bgmAudio.addEventListener('ended', () => {
          if (this._enabled && this.bgmAudio) {
            this.bgmAudio.currentTime = 0;
            this.bgmAudio.play().catch(() => {});
          }
        });

        // Thử phát ngay nếu chính sách trình duyệt cho phép
        this.bgmAudio.play().catch(() => {
          // Autoplay bị chặn tạm thời, sẽ tự phát ngay khi người dùng chạm màn hình
        });
      } catch {
        // Audio loading exception
      }
      this.attachGestureUnlock();
    }
  }

  private attachGestureUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.unlockAudio();
      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlock);
      });
    };
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  /**
   * Kích hoạt AudioContext và bắt đầu phát nhạc nền BGM ngay khi người dùng tương tác
   */
  public unlockAudio() {
    try {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this._enabled && this.bgmAudio) {
        if (this.bgmAudio.paused) {
          this.bgmAudio.loop = true;
          this.bgmAudio.play().catch(() => {});
        }
      }
      this.isUnlocked = true;
    } catch {
      // Safe catch
    }
  }

  /**
   * Đảm bảo nhạc nền BGM luôn phát liên tục xuyên suốt game
   */
  public playBgm() {
    if (!this._enabled || !this.bgmAudio) return;
    try {
      if (this.bgmAudio.paused) {
        this.bgmAudio.loop = true;
        this.bgmAudio.play().catch(() => {});
      }
    } catch {
      // Silent catch
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(val: boolean) {
    this._enabled = val;
    if (!val) {
      // Tắt tiếng: tạm dừng BGM và suspend AudioContext
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } else {
      // Bật tiếng: mở khóa và phát lại BGM ngay
      this.unlockAudio();
      if (this.bgmAudio) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }

  /**
   * Dừng toàn bộ âm thanh (khi người dùng tắt âm)
   */
  stopAll() {
    try {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } catch {
      // Safe catch
    }
  }

  private initCtx() {
    try {
      if (!this._enabled) return;
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended' && this._enabled) {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // AudioContext initialization fallback
    }
  }

  /**
   * Âm thanh click button sắc nét, rõ ràng
   */
  playClick() {
    this.playBgm(); // Đảm bảo BGM luôn phát khi có thao tác
    if (!this._enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Silent catch
    }
  }

  /**
   * Âm thanh khi hứng trúng giọt sữa vàng / ghép trúng cặp thẻ
   */
  playDropCatch() {
    this.playBgm();
    if (!this._enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch {
      // Silent catch
    }
  }

  /**
   * Âm thanh khi va chạm chướng ngại vật hoặc ghép sai
   */
  playError() {
    this.playBgm();
    if (!this._enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Silent catch
    }
  }

  /**
   * Âm thanh chiến thắng: Hợp âm Synth chuông vàng hòa cùng nhạc nền
   */
  playWin() {
    this.playBgm();
    if (!this._enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, High C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Silent catch
    }
  }

  /**
   * Tiếng tick khi bánh xe quay qua từng nan quạt
   */
  playWheelTick() {
    if (!this._enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Silent catch
    }
  }
}

export const sound = new SoundEffects();
export default sound;
