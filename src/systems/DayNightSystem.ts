import Phaser from 'phaser';

export type TimeOfDay = 'DAWN' | 'NOON' | 'SUNSET' | 'NIGHT' | 'REALTIME';

export class DayNightSystem {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle;
  private mode: TimeOfDay = 'REALTIME';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width, height } = this.scene.scale;

    this.overlay = this.scene.add.rectangle(0, 0, width, height, 0x05051a, 0);
    this.overlay.setOrigin(0, 0);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(9000); // Behind HUD and dialog, above game world

    this.scene.scale.on('resize', () => {
      this.overlay.setSize(this.scene.scale.width, this.scene.scale.height);
    });
  }

  setTimeMode(mode: TimeOfDay) {
    this.mode = mode;
    this.update();
  }

  getCurrentMode(): TimeOfDay {
    return this.mode;
  }

  getLightConfig(): { alpha: number; color: number } {
    if (this.mode === 'DAWN') {
      return { alpha: 0.35, color: 0xfa8231 }; // Warm morning amber
    }
    if (this.mode === 'NOON') {
      return { alpha: 0.0, color: 0xffffff }; // Clear midday sun
    }
    if (this.mode === 'SUNSET') {
      return { alpha: 0.45, color: 0xeb3b5a }; // Vibrant tropical twilight
    }
    if (this.mode === 'NIGHT') {
      return { alpha: 0.72, color: 0x0c1033 }; // Deep midnight blue
    }

    // Default: REALTIME based on Philippine Standard Time (PST/PHT = UTC+8)
    const now = new Date();
    // Philippines time offset: UTC+8
    const utcHours = now.getUTCHours() + 8;
    const phtHour = (utcHours % 24) + now.getUTCMinutes() / 60;

    if (phtHour >= 5 && phtHour < 7) {
      // Dawn transition
      return { alpha: 0.35, color: 0xf39c12 };
    } else if (phtHour >= 7 && phtHour < 17) {
      // Daylight
      return { alpha: 0.0, color: 0xffffff };
    } else if (phtHour >= 17 && phtHour < 19) {
      // Golden hour & Sunset
      return { alpha: 0.45, color: 0xd35400 };
    } else {
      // Nighttime
      return { alpha: 0.7, color: 0x0b0e2b };
    }
  }

  update() {
    const config = this.getLightConfig();
    this.overlay.setFillStyle(config.color);
    this.overlay.setAlpha(config.alpha);
  }
}
