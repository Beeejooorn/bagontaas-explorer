import { InteractiveBuilding } from './three/WorldBuilder';
import { Engine3D } from './three/Engine3D';
import { OSMData } from './utils/GeoUtils';

export class App {
  private engine: Engine3D;
  private hudContainer!: HTMLElement;
  private dialogModal!: HTMLElement;
  private promptPill!: HTMLElement;
  private visitedBuildings = new Set<string>();

  constructor() {
    const container = document.getElementById('game-container')!;
    this.engine = new Engine3D(container);

    this.createUI();
    this.loadData();
  }

  private createUI() {
    // 1. Sleek Modern HUD (Top-bar)
    this.hudContainer = document.createElement('div');
    this.hudContainer.id = 'hud-container';
    this.hudContainer.style.position = 'absolute';
    this.hudContainer.style.top = '16px';
    this.hudContainer.style.left = '20px';
    this.hudContainer.style.right = '20px';
    this.hudContainer.style.display = 'flex';
    this.hudContainer.style.justifyContent = 'space-between';
    this.hudContainer.style.alignItems = 'center';
    this.hudContainer.style.pointerEvents = 'none';
    this.hudContainer.style.zIndex = '1000';

    this.hudContainer.innerHTML = `
      <div style="background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); padding: 10px 18px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); pointer-events: auto;">
        <h1 style="font-size: 13px; font-weight: 800; color: #1e293b; letter-spacing: -0.2px; margin: 0;">🗺️ BAGONTAAS 3D EXPLORER</h1>
        <p id="directory-counter" style="font-size: 11px; color: #64748b; font-family: monospace; margin: 4px 0 0 0;">DIRECTORY: 0 / 6 LANDMARKS DISCOVERED</p>
      </div>

      <div style="background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: flex; gap: 8px; pointer-events: auto;">
        <button id="btn-dawn" style="padding: 6px 12px; border: none; background: #fff3e0; color: #e65100; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">🌅 Dawn</button>
        <button id="btn-noon" style="padding: 6px 12px; border: none; background: #e0f2fe; color: #0369a1; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">☀️ Noon</button>
        <button id="btn-sunset" style="padding: 6px 12px; border: none; background: #fce7f3; color: #be185d; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">🌇 Sunset</button>
        <button id="btn-night" style="padding: 6px 12px; border: none; background: #e2e8f0; color: #1e293b; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">🌙 Night</button>
      </div>
    `;
    document.body.appendChild(this.hudContainer);

    // Event listeners for time controls
    document.getElementById('btn-dawn')?.addEventListener('click', () => this.engine.setTimeOfDay('DAWN'));
    document.getElementById('btn-noon')?.addEventListener('click', () => this.engine.setTimeOfDay('NOON'));
    document.getElementById('btn-sunset')?.addEventListener('click', () => this.engine.setTimeOfDay('SUNSET'));
    document.getElementById('btn-night')?.addEventListener('click', () => this.engine.setTimeOfDay('NIGHT'));

    // 2. Interaction Prompt Pill (Floating near bottom)
    this.promptPill = document.createElement('div');
    this.promptPill.id = 'prompt-pill';
    this.promptPill.style.position = 'absolute';
    this.promptPill.style.bottom = '40px';
    this.promptPill.style.left = '50%';
    this.promptPill.style.transform = 'translateX(-50%)';
    this.promptPill.style.background = '#2563eb';
    this.promptPill.style.color = '#ffffff';
    this.promptPill.style.padding = '10px 22px';
    this.promptPill.style.borderRadius = '30px';
    this.promptPill.style.fontSize = '12px';
    this.promptPill.style.fontWeight = '700';
    this.promptPill.style.boxShadow = '0 8px 24px rgba(37,99,235,0.35)';
    this.promptPill.style.display = 'none';
    this.promptPill.style.zIndex = '1000';
    this.promptPill.style.pointerEvents = 'none';
    document.body.appendChild(this.promptPill);

    // 3. Dialog Modal
    this.dialogModal = document.createElement('div');
    this.dialogModal.id = 'dialog-modal';
    this.dialogModal.style.position = 'absolute';
    this.dialogModal.style.bottom = '30px';
    this.dialogModal.style.left = '50%';
    this.dialogModal.style.transform = 'translateX(-50%)';
    this.dialogModal.style.width = 'min(580px, 90vw)';
    this.dialogModal.style.background = 'rgba(255, 255, 255, 0.96)';
    this.dialogModal.style.backdropFilter = 'blur(12px)';
    this.dialogModal.style.padding = '22px 26px';
    this.dialogModal.style.borderRadius = '18px';
    this.dialogModal.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
    this.dialogModal.style.border = '1px solid #e2e8f0';
    this.dialogModal.style.display = 'none';
    this.dialogModal.style.zIndex = '1001';
    document.body.appendChild(this.dialogModal);

    // Engine proximity hooks
    this.engine.onProximityChange = (b) => {
      if (b) {
        this.promptPill.innerText = `[ E / SPACE ] Inspect ${b.name}`;
        this.promptPill.style.display = 'block';
      } else {
        this.promptPill.style.display = 'none';
      }
    };

    this.engine.onInspectBuilding = (b) => {
      this.showDialog(b);
    };
  }

  private showDialog(b: InteractiveBuilding) {
    this.visitedBuildings.add(b.id);
    const counter = document.getElementById('directory-counter');
    if (counter) {
      counter.innerText = `DIRECTORY: ${this.visitedBuildings.size} / 6 LANDMARKS DISCOVERED`;
    }

    this.promptPill.style.display = 'none';
    this.dialogModal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <span style="display: inline-block; background: #${b.color.toString(16).padStart(6, '0')}; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-bottom: 6px;">${b.code}</span>
          <h2 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">${b.name}</h2>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">${b.tagline}</p>
        </div>
        <button id="close-modal" style="background: #f1f5f9; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 700; color: #475569;">Close [E]</button>
      </div>
      <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 12px 0 0 0;">${b.trivia}</p>
    `;
    this.dialogModal.style.display = 'block';

    document.getElementById('close-modal')?.addEventListener('click', () => {
      this.dialogModal.style.display = 'none';
    });
  }

  private async loadData() {
    try {
      const res = await fetch('./assets/maps/bagontaas-osm-full.json');
      const data: OSMData = await res.json();
      await this.engine.loadOSM(data);
    } catch (err) {
      console.error('Failed to load OSM full data:', err);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
