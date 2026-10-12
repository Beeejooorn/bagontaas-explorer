import Phaser from 'phaser';
import { Player } from '../game-objects/Player';
import { AmbientVehicle } from '../game-objects/AmbientVehicle';
import { DialogSystem } from '../systems/DialogSystem';
import { DayNightSystem, TimeOfDay } from '../systems/DayNightSystem';
import { DirectorySystem } from '../systems/DirectorySystem';
import { BAGONTAAS_BUILDINGS, BuildingData } from '../data/buildings';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private dialogSystem!: DialogSystem;
  private dayNightSystem!: DayNightSystem;
  private directorySystem!: DirectorySystem;
  private vehicles: AmbientVehicle[] = [];

  private buildingZones: { building: BuildingData; sprite: Phaser.GameObjects.Sprite; zone: Phaser.Geom.Circle }[] = [];
  private hudText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private nearbyBuilding: BuildingData | null = null;
  private characterKey = 'player-juan';
  private characterName = 'Juan';

  constructor() {
    super('GameScene');
  }

  init(data: { characterKey?: string; characterName?: string }) {
    if (data.characterKey) this.characterKey = data.characterKey;
    if (data.characterName) this.characterName = data.characterName;
  }

  create() {
    // 1. Create Tile World (Isometric Ground & Roads)
    this.createWorld();

    // 2. Spawn Player near Barangay Hall with chosen character
    this.player = new Player(this, 1200, 800, this.characterKey);

    // 3. Spawn Ambient Tricycles on the Main Highway
    const trike1 = new AmbientVehicle(this, 900, 700, 800, 1500, 110);
    const trike2 = new AmbientVehicle(this, 1400, 950, 850, 1600, 90);
    this.vehicles.push(trike1, trike2);

    // 4. Setup Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setBounds(0, 0, 2400, 1600);
    this.physics.world.setBounds(0, 0, 2400, 1600);

    // 5. Initialize Core Systems
    this.dialogSystem = new DialogSystem(this);
    this.dayNightSystem = new DayNightSystem(this);
    this.directorySystem = new DirectorySystem();

    // 6. Build HUD & Controls
    this.createHUD();

    // 6. Setup Interaction Key Listeners (E & SPACE)
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-E', () => this.handleInteract());
      this.input.keyboard.on('keydown-SPACE', () => this.handleInteract());

      // Hotkeys for time-of-day switcher: 1=Dawn, 2=Noon, 3=Sunset, 4=Night, 5=Realtime
      this.input.keyboard.on('keydown-ONE', () => this.setTimeMode('DAWN'));
      this.input.keyboard.on('keydown-TWO', () => this.setTimeMode('NOON'));
      this.input.keyboard.on('keydown-THREE', () => this.setTimeMode('SUNSET'));
      this.input.keyboard.on('keydown-FOUR', () => this.setTimeMode('NIGHT'));
      this.input.keyboard.on('keydown-FIVE', () => this.setTimeMode('REALTIME'));
    }
  }

  private createWorld() {
    // Render isometric grid
    const tileW = 64;
    const tileH = 32;
    const rows = 50;
    const cols = 50;
    const originX = 1200;
    const originY = 100;

    // Build base grass & roads
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isoX = originX + (c - r) * (tileW / 2);
        const isoY = originY + (c + r) * (tileH / 2);

        // Major Highway / Road crossing simulation
        const isMainHighway = (c >= 22 && c <= 25) || (r >= 22 && r <= 24);
        const texture = isMainHighway ? 'tile-road' : 'tile-grass';

        const tile = this.add.sprite(isoX, isoY, texture);
        tile.setOrigin(0.5, 0.5);
        tile.setDepth(0); // Ground layer
      }
    }

    // Place Bagontaas Landmarks
    BAGONTAAS_BUILDINGS.forEach((b) => {
      const isoX = originX + (b.gridX - b.gridY) * (tileW / 2);
      const isoY = originY + (b.gridX + b.gridY) * (tileH / 2);

      const bldgSprite = this.add.sprite(isoX, isoY - 16, 'tile-building');
      bldgSprite.setOrigin(0.5, 0.75);
      bldgSprite.setDepth(isoY); // Isometric depth sorting

      // Interactive proximity zone
      const zone = new Phaser.Geom.Circle(isoX, isoY, 70);
      this.buildingZones.push({ building: b, sprite: bldgSprite, zone });

      // Landmark Label
      const label = this.add.text(isoX, isoY - 56, b.name.split(' ')[0], {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
        color: '#ffffff',
        backgroundColor: '#111118bb',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5, 0.5);
      label.setDepth(isoY + 10);
    });
  }

  private createHUD() {
    const { width } = this.scale;

    // Discovery Counter (Top Left)
    this.hudText = this.add.text(20, 20, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '11px',
      color: '#f1c40f',
      backgroundColor: '#111118cc',
      padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(9990);

    // Time Switcher Guide (Top Right)
    const timeGuide = this.add.text(width - 20, 20, 'TIME [1:Dawn 2:Noon 3:Dusk 4:Night 5:Real]', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '9px',
      color: '#00cec9',
      backgroundColor: '#111118cc',
      padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(9990);

    // Proximity Interaction Prompt (Center Bottom)
    this.promptText = this.add.text(width / 2, this.scale.height - 180, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#d35400ee',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(9990).setVisible(false);

    this.scale.on('resize', () => {
      timeGuide.setPosition(this.scale.width - 20, 20);
      this.promptText.setPosition(this.scale.width / 2, this.scale.height - 180);
    });

    this.updateHUD();
  }

  private updateHUD() {
    const visited = this.directorySystem.getVisitedCount();
    const total = this.directorySystem.getTotalCount();
    const mode = this.dayNightSystem.getCurrentMode();
    this.hudText.setText(`🗺️ ${this.characterName.toUpperCase()} | DIRECTORY: ${visited}/${total} FOUND | TIME: ${mode}`);
  }

  private setTimeMode(mode: TimeOfDay) {
    this.dayNightSystem.setTimeMode(mode);
    this.updateHUD();
  }

  private handleInteract() {
    if (this.dialogSystem.active) {
      this.dialogSystem.close();
      return;
    }

    if (this.nearbyBuilding) {
      const isNew = this.directorySystem.markVisited(this.nearbyBuilding.id);
      this.updateHUD();
      this.dialogSystem.showBuilding(this.nearbyBuilding);
      if (isNew) {
        this.cameras.main.flash(200, 241, 196, 15); // Golden flash on discovery
      }
    }
  }

  update() {
    this.player.update();
    this.dayNightSystem.update();
    for (const v of this.vehicles) {
      v.update();
    }

    // Proximity Check to Buildings
    let foundNear: BuildingData | null = null;
    const px = this.player.x;
    const py = this.player.y;

    for (const item of this.buildingZones) {
      if (Phaser.Geom.Circle.Contains(item.zone, px, py)) {
        foundNear = item.building;
        break;
      }
    }

    this.nearbyBuilding = foundNear;
    if (foundNear && !this.dialogSystem.active) {
      this.promptText.setText(`[ E ] Inspect ${foundNear.name}`);
      this.promptText.setVisible(true);
    } else {
      this.promptText.setVisible(false);
    }
  }
}
