import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.createProceduralTextures();
  }

  create() {
    // Navigate to MenuScene first according to implementation plan
    this.scene.start('MenuScene');
  }

  private createProceduralTextures() {
    // 1. Isometric Grass Diamond (64x32)
    const grassGfx = this.make.graphics({ x: 0, y: 0 });
    grassGfx.fillStyle(0x4ca658, 1);
    grassGfx.beginPath();
    grassGfx.moveTo(32, 0);
    grassGfx.lineTo(64, 16);
    grassGfx.lineTo(32, 32);
    grassGfx.lineTo(0, 16);
    grassGfx.closePath();
    grassGfx.fillPath();

    grassGfx.lineStyle(1, 0x3d8c47, 0.8);
    grassGfx.strokePath();
    grassGfx.generateTexture('tile-grass', 64, 32);
    grassGfx.destroy();

    // 2. Isometric Road Tile (64x32)
    const roadGfx = this.make.graphics({ x: 0, y: 0 });
    roadGfx.fillStyle(0x7f8c8d, 1);
    roadGfx.beginPath();
    roadGfx.moveTo(32, 0);
    roadGfx.lineTo(64, 16);
    roadGfx.lineTo(32, 32);
    roadGfx.lineTo(0, 16);
    roadGfx.closePath();
    roadGfx.fillPath();
    // Yellow centerline dash
    roadGfx.lineStyle(1, 0xf1c40f, 0.8);
    roadGfx.beginPath();
    roadGfx.moveTo(28, 14);
    roadGfx.lineTo(36, 18);
    roadGfx.strokePath();

    roadGfx.generateTexture('tile-road', 64, 32);
    roadGfx.destroy();

    // 3. Isometric Building Block (64x64)
    const buildingGfx = this.make.graphics({ x: 0, y: 0 });
    // Terracotta roof
    buildingGfx.fillStyle(0xd35400, 1);
    buildingGfx.beginPath();
    buildingGfx.moveTo(32, 0);
    buildingGfx.lineTo(64, 16);
    buildingGfx.lineTo(32, 32);
    buildingGfx.lineTo(0, 16);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Left wall
    buildingGfx.fillStyle(0xf5eedc, 1);
    buildingGfx.beginPath();
    buildingGfx.moveTo(0, 16);
    buildingGfx.lineTo(32, 32);
    buildingGfx.lineTo(32, 56);
    buildingGfx.lineTo(0, 40);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Right wall
    buildingGfx.fillStyle(0xe5d8be, 1);
    buildingGfx.beginPath();
    buildingGfx.moveTo(32, 32);
    buildingGfx.lineTo(64, 16);
    buildingGfx.lineTo(64, 40);
    buildingGfx.lineTo(32, 56);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Windows with warm glow
    buildingGfx.fillStyle(0xf39c12, 0.9);
    buildingGfx.fillRect(10, 28, 8, 10);
    buildingGfx.fillRect(44, 28, 8, 10);

    buildingGfx.generateTexture('tile-building', 64, 64);
    buildingGfx.destroy();

    // 4. Character Sprites (4 variants for Character Selection)
    const characters = [
      { key: 'player-juan', poloColor: 0x2980b9, hatColor: 0xf39c12, name: 'Juan' },
      { key: 'player-maria', poloColor: 0xe74c3c, hatColor: 0xf1c40f, name: 'Maria' },
      { key: 'player-datu', poloColor: 0x27ae60, hatColor: 0xd35400, name: 'Datu' },
      { key: 'player-tala', poloColor: 0x8e44ad, hatColor: 0xf5eedc, name: 'Tala' }
    ];

    characters.forEach((c) => {
      const pGfx = this.make.graphics({ x: 0, y: 0 });
      // Shadow
      pGfx.fillStyle(0x000000, 0.35);
      pGfx.fillEllipse(16, 44, 20, 8);
      // Body / Polo
      pGfx.fillStyle(c.poloColor, 1);
      pGfx.fillRoundedRect(8, 20, 16, 18, 4);
      // Head
      pGfx.fillStyle(0xf1c40f, 1);
      pGfx.fillCircle(16, 14, 8);
      // Hat / Salakot
      pGfx.fillStyle(c.hatColor, 1);
      pGfx.beginPath();
      pGfx.moveTo(16, 4);
      pGfx.lineTo(28, 14);
      pGfx.lineTo(4, 14);
      pGfx.closePath();
      pGfx.fillPath();
      // Pants
      pGfx.fillStyle(0x34495e, 1);
      pGfx.fillRect(10, 36, 12, 8);

      pGfx.generateTexture(c.key, 32, 48);
      if (c.key === 'player-juan') {
        pGfx.generateTexture('player-sprite', 32, 48);
      }
      pGfx.destroy();
    });

    // 5. Philippine Tricycle Vehicle Sprite (48x36)
    const trikeGfx = this.make.graphics({ x: 0, y: 0 });
    // Ground Shadow
    trikeGfx.fillStyle(0x000000, 0.4);
    trikeGfx.fillRoundedRect(4, 26, 40, 10, 4);
    // Passenger Sidecar (Stainless / Color metal cab)
    trikeGfx.fillStyle(0x27ae60, 1); // Vibrant green sidecar
    trikeGfx.fillRoundedRect(4, 8, 24, 22, 3);
    // Roof of Sidecar
    trikeGfx.fillStyle(0xf1c40f, 1); // Yellow canopy
    trikeGfx.fillRect(2, 6, 28, 4);
    // Sidecar window
    trikeGfx.fillStyle(0xdff9fb, 0.85);
    trikeGfx.fillRect(8, 12, 14, 8);
    // Motorbike body (attached to right side)
    trikeGfx.fillStyle(0xe74c3c, 1); // Red motorcycle
    trikeGfx.fillRect(28, 14, 16, 14);
    // Headlight
    trikeGfx.fillStyle(0xfeca57, 1);
    trikeGfx.fillCircle(44, 20, 3);
    // Wheels
    trikeGfx.fillStyle(0x2d3436, 1);
    trikeGfx.fillCircle(14, 30, 4);
    trikeGfx.fillCircle(38, 30, 4);

    trikeGfx.generateTexture('vehicle-tricycle', 48, 36);
    trikeGfx.destroy();
  }
}
