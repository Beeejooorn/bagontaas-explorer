import Phaser from 'phaser';

export interface CharacterOption {
  key: string;
  name: string;
  role: string;
}

export class MenuScene extends Phaser.Scene {
  private characters: CharacterOption[] = [
    { key: 'player-juan', name: 'JUAN', role: 'Local Explorer' },
    { key: 'player-maria', name: 'MARIA', role: 'Student Resident' },
    { key: 'player-datu', name: 'DATU', role: 'Community Elder' },
    { key: 'player-tala', name: 'TALA', role: 'Bukidnon Adventurer' }
  ];
  private selectedIndex = 0;
  private charPreview!: Phaser.GameObjects.Sprite;
  private nameText!: Phaser.GameObjects.Text;
  private roleText!: Phaser.GameObjects.Text;

  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Background Gradient / Backdrop
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a24).setOrigin(0, 0);

    // Subtle panning isometric road background pattern
    for (let i = 0; i < 20; i++) {
      const tile = this.add.sprite(i * 64, (i % 2 === 0 ? 80 : 112), 'tile-road');
      tile.setAlpha(0.25);
    }

    // Title Block
    this.add.text(cx, cy - 170, '🗺️ BAGONTAAS EXPLORER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '22px',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0.5);

    this.add.text(cx, cy - 130, 'A Pixel RPG of Bagontaas, Valencia City', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#00cec9'
    }).setOrigin(0.5, 0.5);

    // Character Selection Card
    const card = this.add.rectangle(cx, cy, 320, 180, 0x222233, 0.9);
    card.setStrokeStyle(2, 0xf1c40f, 0.8);

    this.add.text(cx, cy - 70, 'SELECT YOUR RESIDENT', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ecf0f1'
    }).setOrigin(0.5, 0.5);

    // Character Preview Sprite (Scaled up 2x)
    this.charPreview = this.add.sprite(cx, cy - 15, this.characters[0].key);
    this.charPreview.setScale(2.2);

    // Left Arrow Button
    const leftBtn = this.add.text(cx - 100, cy - 15, '◄', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color: '#f1c40f'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

    leftBtn.on('pointerdown', () => this.prevCharacter());

    // Right Arrow Button
    const rightBtn = this.add.text(cx + 100, cy - 15, '►', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color: '#f1c40f'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

    rightBtn.on('pointerdown', () => this.nextCharacter());

    // Character Name & Role
    this.nameText = this.add.text(cx, cy + 35, this.characters[0].name, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '13px',
      color: '#f1c40f'
    }).setOrigin(0.5, 0.5);

    this.roleText = this.add.text(cx, cy + 55, this.characters[0].role, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '9px',
      color: '#bdc3c7'
    }).setOrigin(0.5, 0.5);

    // START GAME Button
    const startBtn = this.add.rectangle(cx, cy + 130, 220, 44, 0x27ae60, 1).setInteractive({ useHandCursor: true });
    startBtn.setStrokeStyle(2, 0xffffff, 0.9);

    this.add.text(cx, cy + 130, 'ENTER TOWN [START]', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff'
    }).setOrigin(0.5, 0.5);

    startBtn.on('pointerover', () => startBtn.setFillStyle(0x2ecc71));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0x27ae60));
    startBtn.on('pointerdown', () => this.startGame());

    // Keyboard Shortcuts (Arrow keys & Enter/Space)
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-LEFT', () => this.prevCharacter());
      this.input.keyboard.on('keydown-A', () => this.prevCharacter());
      this.input.keyboard.on('keydown-RIGHT', () => this.nextCharacter());
      this.input.keyboard.on('keydown-D', () => this.nextCharacter());
      this.input.keyboard.on('keydown-ENTER', () => this.startGame());
      this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    }

    // Window resize handler
    this.scale.on('resize', () => {
      bg.setSize(this.scale.width, this.scale.height);
    });
  }

  private prevCharacter() {
    this.selectedIndex = (this.selectedIndex - 1 + this.characters.length) % this.characters.length;
    this.updatePreview();
  }

  private nextCharacter() {
    this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
    this.updatePreview();
  }

  private updatePreview() {
    const char = this.characters[this.selectedIndex];
    this.charPreview.setTexture(char.key);
    this.nameText.setText(char.name);
    this.roleText.setText(char.role);
  }

  private startGame() {
    const selected = this.characters[this.selectedIndex];
    this.scene.start('GameScene', { characterKey: selected.key, characterName: selected.name });
  }
}
