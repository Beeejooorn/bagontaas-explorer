import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Generate placeholder procedural textures for initial testing
    this.createProceduralTextures();
  }

  create() {
    this.scene.start('GameScene');
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

    // Grass edge detail
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
    roadGfx.lineStyle(1, 0x626567, 0.9);
    roadGfx.strokePath();
    roadGfx.generateTexture('tile-road', 64, 32);
    roadGfx.destroy();

    // 3. Isometric Building Block (64x64)
    const buildingGfx = this.make.graphics({ x: 0, y: 0 });
    // Roof (Isometric diamond on top: y 0..32)
    buildingGfx.fillStyle(0xd35400, 1); // terracotta roof
    buildingGfx.beginPath();
    buildingGfx.moveTo(32, 0);
    buildingGfx.lineTo(64, 16);
    buildingGfx.lineTo(32, 32);
    buildingGfx.lineTo(0, 16);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Left wall (y 16..48)
    buildingGfx.fillStyle(0xf5eedc, 1); // warm cream
    buildingGfx.beginPath();
    buildingGfx.moveTo(0, 16);
    buildingGfx.lineTo(32, 32);
    buildingGfx.lineTo(32, 56);
    buildingGfx.lineTo(0, 40);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Right wall (y 16..48)
    buildingGfx.fillStyle(0xe5d8be, 1); // shaded cream
    buildingGfx.beginPath();
    buildingGfx.moveTo(32, 32);
    buildingGfx.lineTo(64, 16);
    buildingGfx.lineTo(64, 40);
    buildingGfx.lineTo(32, 56);
    buildingGfx.closePath();
    buildingGfx.fillPath();

    // Building borders
    buildingGfx.lineStyle(1, 0x5a4a42, 0.6);
    buildingGfx.beginPath();
    buildingGfx.moveTo(32, 32);
    buildingGfx.lineTo(32, 56);
    buildingGfx.strokePath();

    buildingGfx.generateTexture('tile-building', 64, 64);
    buildingGfx.destroy();

    // 4. Character Sprite (32x48 pixel adventurer)
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    // Shadow
    playerGfx.fillStyle(0x000000, 0.35);
    playerGfx.fillEllipse(16, 44, 20, 8);
    // Body (Shirt)
    playerGfx.fillStyle(0x2980b9, 1); // Blue tropical polo
    playerGfx.fillRoundedRect(8, 20, 16, 18, 4);
    // Head / Face
    playerGfx.fillStyle(0xf1c40f, 1); // Straw hat / skin
    playerGfx.fillCircle(16, 14, 8);
    playerGfx.fillStyle(0xe67e22, 1); // Hat brim
    playerGfx.fillRect(4, 12, 24, 4);
    // Pants
    playerGfx.fillStyle(0x34495e, 1);
    playerGfx.fillRect(10, 36, 12, 8);

    playerGfx.generateTexture('player-sprite', 32, 48);
    playerGfx.destroy();
  }
}
