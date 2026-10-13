import * as THREE from 'three';
import { WorldBuilder, InteractiveBuilding } from './WorldBuilder';
import { CharacterController } from './CharacterController';
import { OSMData } from '../utils/GeoUtils';

export class Engine3D {
  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public renderer: THREE.WebGLRenderer;
  private dirLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  public worldBuilder: WorldBuilder;
  public character!: CharacterController;
  private clock = new THREE.Clock();

  // Floating label overlays
  private labelsContainer: HTMLElement;
  private pillElements: { element: HTMLElement; pos: THREE.Vector3 }[] = [];

  // Dialog & interaction hooks
  public onInspectBuilding?: (b: InteractiveBuilding) => void;
  public onProximityChange?: (b: InteractiveBuilding | null) => void;
  private activeNearbyBuilding: InteractiveBuilding | null = null;

  constructor(container: HTMLElement) {
    // 1. Scene setup with clean minimalist architectural atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f3f7);
    this.scene.fog = new THREE.FogExp2(0xf0f3f7, 0.0018);

    // 2. Isometric Orthographic Camera for crisp CAD / architectural look
    const aspect = window.innerWidth / window.innerHeight;
    const d = 110;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      2000
    );

    // Isometric 45-degree angle
    this.camera.position.set(160, 180, 160);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer with high-fidelity soft shadows and pixel ratio
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Studio Directional Lighting (Crisp architectural block shadows)
    this.setupLighting();

    // 5. HTML Floating Pills Container
    this.labelsContainer = document.createElement('div');
    this.labelsContainer.id = 'floating-pills-container';
    this.labelsContainer.style.position = 'absolute';
    this.labelsContainer.style.top = '0';
    this.labelsContainer.style.left = '0';
    this.labelsContainer.style.width = '100%';
    this.labelsContainer.style.height = '100%';
    this.labelsContainer.style.pointerEvents = 'none';
    this.labelsContainer.style.overflow = 'hidden';
    container.appendChild(this.labelsContainer);

    this.worldBuilder = new WorldBuilder(this.scene);

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'e' || e.code === 'Space') {
        if (this.activeNearbyBuilding && this.onInspectBuilding) {
          this.onInspectBuilding(this.activeNearbyBuilding);
        }
      }
    });

    this.animate();
  }

  private setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xdde2ea, 0.9);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(150, 260, 120);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 800;
    const shadowD = 220;
    this.dirLight.shadow.camera.left = -shadowD;
    this.dirLight.shadow.camera.right = shadowD;
    this.dirLight.shadow.camera.top = shadowD;
    this.dirLight.shadow.camera.bottom = -shadowD;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);
  }

  public setTimeOfDay(mode: 'DAWN' | 'NOON' | 'SUNSET' | 'NIGHT') {
    if (mode === 'DAWN') {
      this.scene.background = new THREE.Color(0xfde2b8);
      this.dirLight.color.setHex(0xffaa5b);
      this.dirLight.intensity = 1.0;
      this.hemiLight.intensity = 0.7;
    } else if (mode === 'NOON') {
      this.scene.background = new THREE.Color(0xf0f3f7);
      this.dirLight.color.setHex(0xffffff);
      this.dirLight.intensity = 1.3;
      this.hemiLight.intensity = 0.9;
    } else if (mode === 'SUNSET') {
      this.scene.background = new THREE.Color(0xfbc2a6);
      this.dirLight.color.setHex(0xe17055);
      this.dirLight.intensity = 1.1;
      this.hemiLight.intensity = 0.6;
    } else if (mode === 'NIGHT') {
      this.scene.background = new THREE.Color(0x131722);
      this.dirLight.color.setHex(0x57606f);
      this.dirLight.intensity = 0.3;
      this.hemiLight.intensity = 0.2;
    }
  }

  public async loadOSM(osmData: OSMData) {
    await this.worldBuilder.buildFromOSM(osmData);

    // Center player on the community core
    const startPos = new THREE.Vector3(0, 0, 0);
    this.character = new CharacterController(this.scene, startPos);

    // Create floating pills for prominent buildings (matches reference screenshot 2)
    this.createFloatingPills();
  }

  private createFloatingPills() {
    this.labelsContainer.innerHTML = '';
    this.pillElements = [];

    // Filter buildings that have codes or are named
    for (const b of this.worldBuilder.buildings) {
      if (b.code.startsWith('#00')) {
        const pill = document.createElement('div');
        pill.className = 'landmark-pill';
        pill.style.position = 'absolute';
        pill.style.padding = '4px 8px';
        pill.style.background = 'rgba(255, 255, 255, 0.95)';
        pill.style.borderRadius = '12px';
        pill.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        pill.style.fontSize = '10px';
        pill.style.fontWeight = '700';
        pill.style.color = '#2d3436';
        pill.style.fontFamily = 'monospace';
        pill.style.transform = 'translate(-50%, -100%)';
        pill.style.pointerEvents = 'auto';
        pill.style.cursor = 'pointer';
        pill.innerText = b.code;

        pill.onclick = () => {
          if (this.onInspectBuilding) this.onInspectBuilding(b);
        };

        this.labelsContainer.appendChild(pill);
        this.pillElements.push({ element: pill, pos: b.center.clone().add(new THREE.Vector3(0, 4, 0)) });
      }
    }
  }

  private updateFloatingPills() {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    for (const item of this.pillElements) {
      const v = item.pos.clone().project(this.camera);
      // Check if inside camera view
      if (v.z < 1) {
        const x = (v.x * halfW) + halfW;
        const y = -(v.y * halfH) + halfH;
        item.element.style.left = `${x}px`;
        item.element.style.top = `${y}px`;
        item.element.style.display = 'block';
      } else {
        item.element.style.display = 'none';
      }
    }
  }

  private onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 110;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.character) {
      const playerPos = this.character.update(delta);

      // Smooth camera tracking maintaining the isometric 45-degree angle
      const targetCamX = playerPos.x + 160;
      const targetCamZ = playerPos.z + 160;
      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.08;
      this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.08;
      this.camera.lookAt(playerPos.x, 0, playerPos.z);

      // Check proximity to buildings
      let nearest: InteractiveBuilding | null = null;
      let minDist = 22; // meters

      for (const b of this.worldBuilder.buildings) {
        const dist = new THREE.Vector2(playerPos.x - b.center.x, playerPos.z - b.center.z).length();
        if (dist < minDist) {
          nearest = b;
          break;
        }
      }

      if (nearest !== this.activeNearbyBuilding) {
        this.activeNearbyBuilding = nearest;
        if (this.onProximityChange) {
          this.onProximityChange(nearest);
        }
      }
    }

    this.updateFloatingPills();
    this.renderer.render(this.scene, this.camera);
  };
}
