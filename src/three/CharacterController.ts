import * as THREE from 'three';

export class CharacterController {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  private speed = 45;
  private keys: Record<string, boolean> = {};

  constructor(scene: THREE.Scene, startPos: THREE.Vector3) {
    this.mesh = new THREE.Group();
    this.position = startPos.clone();
    this.mesh.position.copy(this.position);

    // Create a stylized 3D avatar that fits the architectural block aesthetic
    // Body capsule/cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x34495e,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.2;
    body.castShadow = true;
    this.mesh.add(body);

    // Accent head / helmet (vibrant orange explorer badge)
    const headGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xff9f43,
      roughness: 0.2
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.8;
    head.castShadow = true;
    this.mesh.add(head);

    // Shadow blob
    const shadowGeo = new THREE.CircleGeometry(1.2, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    this.mesh.add(shadow);

    scene.add(this.mesh);

    window.addEventListener('keydown', (e) => { this.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.key.toLowerCase()] = false; });
  }

  public update(delta: number): THREE.Vector3 {
    let moveX = 0;
    let moveZ = 0;

    // Isometric 45-degree aligned controls (W moves North-West, S South-East, A South-West, D North-East)
    if (this.keys['w'] || this.keys['arrowup']) {
      moveX -= 1;
      moveZ -= 1;
    }
    if (this.keys['s'] || this.keys['arrowdown']) {
      moveX += 1;
      moveZ += 1;
    }
    if (this.keys['a'] || this.keys['arrowleft']) {
      moveX -= 1;
      moveZ += 1;
    }
    if (this.keys['d'] || this.keys['arrowright']) {
      moveX += 1;
      moveZ -= 1;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;

      this.mesh.position.x += moveX * this.speed * delta;
      this.mesh.position.z += moveZ * this.speed * delta;

      // Rotate player mesh toward movement angle
      const targetAngle = Math.atan2(moveX, moveZ);
      this.mesh.rotation.y = targetAngle;
    }

    this.position.copy(this.mesh.position);
    return this.position;
  }
}
