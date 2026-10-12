import Phaser from 'phaser';

export class AmbientVehicle extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private minX: number;
  private maxX: number;
  private startY: number;
  private direction: number; // 1 = right/down, -1 = left/up

  constructor(scene: Phaser.Scene, x: number, y: number, minX: number, maxX: number, speed = 100) {
    super(scene, x, y, 'vehicle-tricycle');
    this.scene = scene;
    this.minX = minX;
    this.maxX = maxX;
    this.startY = y;
    this.speed = speed;
    this.direction = 1;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.8);
    this.setVelocityX(this.speed);
  }

  update() {
    if (!this.body) return;

    // Tricycle follows isometric road slope (dy = dx * 0.5)
    if (this.x > this.maxX) {
      this.direction = -1;
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.x < this.minX) {
      this.direction = 1;
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    }

    // Follow road angle
    this.y = this.startY + (this.x - this.minX) * 0.5 * this.direction;
    this.setDepth(this.y);
  }
}
