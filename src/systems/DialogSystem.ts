import Phaser from 'phaser';
import { BuildingData } from '../data/buildings';

export class DialogSystem {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private titleText: Phaser.GameObjects.Text;
  private typeText: Phaser.GameObjects.Text;
  private descText: Phaser.GameObjects.Text;
  private promptText: Phaser.GameObjects.Text;
  private bgRect: Phaser.GameObjects.Rectangle;
  private isOpen = false;
  private onClosedCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(9999);
    this.container.setVisible(false);

    const width = 640;
    const height = 140;

    // Outer glow border
    const borderGlow = this.scene.add.rectangle(0, 0, width + 8, height + 8, 0xf1c40f, 0.8);
    // Background box
    this.bgRect = this.scene.add.rectangle(0, 0, width, height, 0x1a1a24, 0.95);
    this.bgRect.setStrokeStyle(2, 0xffffff, 0.9);

    // Dialog elements
    this.titleText = this.scene.add.text(-width / 2 + 20, -height / 2 + 16, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#f1c40f'
    });

    this.typeText = this.scene.add.text(-width / 2 + 20, -height / 2 + 38, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '9px',
      color: '#00cec9'
    });

    this.descText = this.scene.add.text(-width / 2 + 20, -height / 2 + 58, '', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ecf0f1',
      wordWrap: { width: width - 40 }
    });

    this.promptText = this.scene.add.text(width / 2 - 20, height / 2 - 20, '[ SPACE / E ] Close', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#bdc3c7'
    }).setOrigin(1, 1);

    this.container.add([borderGlow, this.bgRect, this.titleText, this.typeText, this.descText, this.promptText]);

    // Position dialog at bottom center of viewport
    this.updatePosition();
    this.scene.scale.on('resize', this.updatePosition, this);
  }

  private updatePosition() {
    const { width, height } = this.scene.scale;
    this.container.setPosition(width / 2, height - 100);
  }

  showBuilding(building: BuildingData, onClosed?: () => void) {
    this.titleText.setText(`🏛️ ${building.name}`);
    this.typeText.setText(`CATEGORY: ${building.type.toUpperCase()}`);
    this.descText.setText(`${building.tagline}\n\n💡 "${building.trivia}"`);
    this.onClosedCallback = onClosed;

    this.container.setVisible(true);
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.scene.scale.height - 100,
      duration: 150,
      ease: 'Power2'
    });
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 120,
      onComplete: () => {
        this.container.setVisible(false);
        if (this.onClosedCallback) {
          this.onClosedCallback();
          this.onClosedCallback = undefined;
        }
      }
    });
  }

  get active(): boolean {
    return this.isOpen;
  }
}
