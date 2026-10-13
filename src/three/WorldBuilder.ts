import * as THREE from 'three';
import { OSMData, OSMNode, OSMWay, latLonToWorld } from '../utils/GeoUtils';

export interface InteractiveBuilding {
  id: string;
  name: string;
  category: string;
  code: string; // e.g. '#0039'
  color: number;
  center: THREE.Vector3;
  mesh: THREE.Mesh;
  trivia: string;
  tagline: string;
}

export class WorldBuilder {
  private scene: THREE.Scene;
  public buildings: InteractiveBuilding[] = [];
  public roadGroup: THREE.Group;
  public buildingGroup: THREE.Group;
  public landmarkPillGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.roadGroup = new THREE.Group();
    this.buildingGroup = new THREE.Group();
    this.landmarkPillGroup = new THREE.Group();

    this.scene.add(this.roadGroup);
    this.scene.add(this.buildingGroup);
    this.scene.add(this.landmarkPillGroup);
  }

  public async buildFromOSM(osmData: OSMData) {
    // 1. Build node lookup map
    const nodeMap = new Map<number, OSMNode>();
    for (const el of osmData.elements) {
      if (el.type === 'node') {
        nodeMap.set(el.id, el);
      }
    }

    // 2. Materials matching the reference screenshot aesthetic
    // Ground plane: soft light neutral/grey tone
    const groundGeo = new THREE.PlaneGeometry(3000, 3000);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xedf1f5,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.1;
    this.scene.add(ground);

    // Default residential/commercial white-box material
    const defaultBuildingMat = new THREE.MeshStandardMaterial({
      color: 0xf5f7fa,
      roughness: 0.45,
      metalness: 0.1
    });

    // Curated palette for prominent Bagontaas buildings (matches screenshot 2)
    const landmarkPalette = [
      { color: 0x2e86de, code: '#0039', name: 'Barangay Hall' },         // Royal Blue
      { color: 0x10ac84, code: '#0041', name: 'Central Elementary' },     // Forest/Emerald Green
      { color: 0xff9f43, code: '#0025', name: 'Public Market' },          // Warm Orange/Terracotta
      { color: 0x54a0ff, code: '#0085', name: 'Covered Court & Plaza' },  // Sky Blue
      { color: 0x1dd1a1, code: '#0029', name: 'San Isidro Parish' },      // Mint Emerald
      { color: 0xee5253, code: '#0020', name: 'Barangay Health Center' }  // Coral Red
    ];

    let landmarkIndex = 0;

    // 3. Process ways: roads and buildings
    for (const el of osmData.elements) {
      if (el.type !== 'way') continue;
      const way = el as OSMWay;

      // Extract points
      const points: THREE.Vector2[] = [];
      const v3Points: THREE.Vector3[] = [];

      for (const nid of way.nodes) {
        const node = nodeMap.get(nid);
        if (node) {
          const { x, z } = latLonToWorld(node.lat, node.lon);
          points.push(new THREE.Vector2(x, z));
          v3Points.push(new THREE.Vector3(x, 0.05, z));
        }
      }

      if (points.length < 2) continue;

      // --- HIGHWAYS / STREETS ---
      if (way.tags && way.tags.highway) {
        const roadMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0, // Clean subtle street tone
          roughness: 0.95
        });

        // Determine road width based on OSM hierarchy
        const isPrimary = way.tags.highway === 'primary' || way.tags.highway === 'secondary';
        const roadWidth = isPrimary ? 8 : 4;

        for (let i = 0; i < v3Points.length - 1; i++) {
          const p1 = v3Points[i];
          const p2 = v3Points[i + 1];
          const dir = new THREE.Vector3().subVectors(p2, p1);
          const len = dir.length();
          if (len === 0) continue;

          const segGeo = new THREE.PlaneGeometry(roadWidth, len);
          const segMesh = new THREE.Mesh(segGeo, roadMat);
          segMesh.rotation.x = -Math.PI / 2;

          const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          segMesh.position.set(mid.x, 0.02, mid.z);

          // Angle rotation along path
          const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);
          segMesh.rotation.z = -angle;
          segMesh.receiveShadow = true;
          this.roadGroup.add(segMesh);
        }
      }

      // --- BUILDINGS ---
      if (way.tags && (way.tags.building || way.tags.amenity)) {
        if (points.length < 3) continue;

        // Create 2D shape for extrusion
        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          shape.lineTo(points[i].x, points[i].y);
        }
        shape.closePath();

        // Calculate center & size
        let cx = 0, cz = 0;
        points.forEach(p => { cx += p.x; cz += p.y; });
        cx /= points.length;
        cz /= points.length;

        // Is this a prominent named building or landmark?
        const isNamed = !!(way.tags.name || way.tags.amenity);
        let height = isNamed ? 24 + Math.random() * 12 : 8 + (way.id % 7) * 2;
        let mat = defaultBuildingMat;
        let code = `#${(way.id % 1000).toString().padStart(4, '0')}`;
        let bldgColor = 0xf5f7fa;

        if (isNamed || landmarkIndex < landmarkPalette.length) {
          const preset = landmarkPalette[landmarkIndex % landmarkPalette.length];
          bldgColor = preset.color;
          code = preset.code;
          height = 32 + (landmarkIndex % 3) * 6; // Tall hero tower

          mat = new THREE.MeshStandardMaterial({
            color: bldgColor,
            roughness: 0.35,
            metalness: 0.15
          });
          landmarkIndex++;
        }

        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
          depth: height,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.3,
          bevelThickness: 0.3
        };

        try {
          const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          geom.rotateX(Math.PI / 2); // Orient extrusion upward along Y axis

          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.y = 0;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.buildingGroup.add(mesh);

          const bldgName = way.tags.name || (isNamed ? way.tags.amenity! : `Building ${code}`);
          const bldgType = way.tags.amenity || way.tags.building || 'Structure';

          const record: InteractiveBuilding = {
            id: `bldg-${way.id}`,
            name: bldgName,
            category: bldgType,
            code: code,
            color: bldgColor,
            center: new THREE.Vector3(cx, height, cz),
            mesh: mesh,
            trivia: way.tags.name ? `Key historical landmark in Bagontaas (${bldgType}).` : 'Local community establishment in Bagontaas.',
            tagline: `Sector: ${code} · Valencia City`
          };

          this.buildings.push(record);
        } catch {
          // Skip invalid geometry safely
        }
      }
    }

    console.log(`World generated with ${this.buildings.length} 3D buildings.`);
  }
}
