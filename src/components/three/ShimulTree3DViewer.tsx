import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, Sunset, Moon, RotateCcw, Sparkles, Wind } from 'lucide-react';
import { useLanguage } from '../../locales/LanguageContext';

type LightingMode = 'day' | 'golden' | 'twilight';

export const ShimulTree3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBn } = useLanguage();
  const [lighting, setLighting] = useState<LightingMode>('golden');
  const [bloomProgress, setBloomProgress] = useState<number>(0.95);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const flowersGroupRef = useRef<THREE.Group | null>(null);
  const branchGroupRef = useRef<THREE.Group | null>(null);
  const petalsGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    ambient: THREE.AmbientLight;
    hemiLight: THREE.HemisphereLight;
    fillLight: THREE.DirectionalLight;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ─── Ground Plane ───
    const groundGeo = new THREE.CircleGeometry(12, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a22,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.6
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Branch Group
    const branchGroup = new THREE.Group();
    branchGroupRef.current = branchGroup;
    rootGroup.add(branchGroup);

    // ─── Bark Material with variation ───
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.92,
      metalness: 0.02
    });

    const darkBarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a1a12,
      roughness: 0.95,
      metalness: 0.01
    });

    // ─── Helper: Create tapered branch along curve ───
    const createBranch = (
      points: THREE.Vector3[],
      startRadius: number,
      endRadius: number,
      segments: number,
      mat: THREE.MeshStandardMaterial
    ): THREE.Mesh => {
      const curve = new THREE.CatmullRomCurve3(points);
      const radiusFunc = (t: number) => startRadius + (endRadius - startRadius) * t;
      const geo = new THREE.TubeGeometry(curve, segments, 0.1, 8, false);
      const positions = geo.attributes.position;
      const tempVec = new THREE.Vector3();
      for (let i = 0; i < positions.count; i++) {
        tempVec.fromBufferAttribute(positions, i);
        const closestPoint = curve.getPointAt(Math.max(0, Math.min(1, i / positions.count)));
        const dist = tempVec.distanceTo(closestPoint);
        const t = i / positions.count;
        const radius = radiusFunc(t);
        if (dist > radius * 0.3) {
          const scale = radius / Math.max(dist, 0.01);
          tempVec.lerp(closestPoint, 1 - scale);
          positions.setXYZ(i, tempVec.x, tempVec.y, tempVec.z);
        }
      }
      positions.needsUpdate = true;
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // ─── Main Trunk ───
    const trunkPoints = [
      new THREE.Vector3(-5.0, -3.2, -0.3),
      new THREE.Vector3(-3.0, -1.5, 0.2),
      new THREE.Vector3(-0.8, 0.2, 0),
      new THREE.Vector3(1.5, 1.8, 0.3),
      new THREE.Vector3(3.8, 2.8, 0.1),
      new THREE.Vector3(5.5, 3.2, -0.2)
    ];
    const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 50, 0.45, 12, false);
    const trunk = new THREE.Mesh(trunkGeo, barkMaterial);
    trunk.castShadow = true;
    branchGroup.add(trunk);

    // ─── Sub-branches ───
    const branches = [
      // Upward branches
      { points: [new THREE.Vector3(-0.8, 0.2, 0), new THREE.Vector3(-1.5, 2.0, 0.9), new THREE.Vector3(-2.5, 3.5, 1.4)], r: [0.22, 0.06], mat: darkBarkMaterial },
      { points: [new THREE.Vector3(1.5, 1.8, 0.3), new THREE.Vector3(0.8, 3.2, 0.8), new THREE.Vector3(0.2, 4.5, 0.5)], r: [0.2, 0.05], mat: barkMaterial },
      { points: [new THREE.Vector3(3.8, 2.8, 0.1), new THREE.Vector3(4.5, 3.8, 0.6), new THREE.Vector3(5.0, 4.8, 0.3)], r: [0.18, 0.05], mat: darkBarkMaterial },
      // Sideways branches
      { points: [new THREE.Vector3(2.0, 1.5, 0.2), new THREE.Vector3(3.0, 0.5, -0.8), new THREE.Vector3(4.5, -0.2, -1.2)], r: [0.2, 0.05], mat: barkMaterial },
      { points: [new THREE.Vector3(3.5, 2.2, 0.3), new THREE.Vector3(4.8, 1.2, 1.0), new THREE.Vector3(5.8, 0.6, 1.5)], r: [0.16, 0.04], mat: darkBarkMaterial },
      // Downward branch
      { points: [new THREE.Vector3(-2.5, -0.8, 0.1), new THREE.Vector3(-3.5, -1.8, 0.5), new THREE.Vector3(-4.5, -2.5, 0.8)], r: [0.15, 0.04], mat: barkMaterial },
      // Thin twigs
      { points: [new THREE.Vector3(-2.5, 3.5, 1.4), new THREE.Vector3(-2.0, 4.2, 1.8), new THREE.Vector3(-1.8, 5.0, 1.5)], r: [0.06, 0.02], mat: darkBarkMaterial },
      { points: [new THREE.Vector3(0.2, 4.5, 0.5), new THREE.Vector3(-0.5, 5.2, 0.8), new THREE.Vector3(-1.0, 5.8, 0.5)], r: [0.05, 0.015], mat: barkMaterial },
      { points: [new THREE.Vector3(5.0, 4.8, 0.3), new THREE.Vector3(5.5, 5.5, 0.0), new THREE.Vector3(6.0, 6.0, -0.3)], r: [0.05, 0.015], mat: darkBarkMaterial },
      { points: [new THREE.Vector3(4.5, -0.2, -1.2), new THREE.Vector3(5.2, -1.0, -1.5), new THREE.Vector3(6.0, -1.5, -1.2)], r: [0.05, 0.015], mat: barkMaterial },
      { points: [new THREE.Vector3(5.8, 0.6, 1.5), new THREE.Vector3(6.5, 0.2, 1.8), new THREE.Vector3(7.0, -0.3, 2.0)], r: [0.04, 0.012], mat: darkBarkMaterial },
      { points: [new THREE.Vector3(-4.5, -2.5, 0.8), new THREE.Vector3(-5.2, -2.8, 1.2), new THREE.Vector3(-5.8, -3.0, 1.0)], r: [0.04, 0.012], mat: barkMaterial },
    ];

    branches.forEach(b => {
      const mesh = createBranch(b.points, b.r[0], b.r[1], 20, b.mat);
      branchGroup.add(mesh);
    });

    // ─── Flowers Group ───
    const flowersGroup = new THREE.Group();
    flowersGroupRef.current = flowersGroup;
    rootGroup.add(flowersGroup);

    // ─── Flower Materials ───
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xC62828,
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const petalMatDark = new THREE.MeshStandardMaterial({
      color: 0x8B1A1A,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const petalMatLight = new THREE.MeshStandardMaterial({
      color: 0xE53935,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x2e4722,
      roughness: 0.85,
      metalness: 0.0
    });

    const stamenMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      roughness: 0.3,
      metalness: 0.5
    });

    // ─── 3D Petal Shape ───
    const createPetal3D = (material: THREE.MeshStandardMaterial, scale: number): THREE.Group => {
      const petalGroup = new THREE.Group();

      // Main petal body using ExtrudeGeometry for thickness
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      petalShape.bezierCurveTo(0.18, 0.3, 0.35, 0.65, 0.28, 0.95);
      petalShape.bezierCurveTo(0.2, 1.15, 0.08, 1.2, 0, 1.25);
      petalShape.bezierCurveTo(-0.08, 1.2, -0.2, 1.15, -0.28, 0.95);
      petalShape.bezierCurveTo(-0.35, 0.65, -0.18, 0.3, 0, 0);

      const extrudeSettings = {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 12
      };
      const petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
      const petal = new THREE.Mesh(petalGeo, material);
      petal.castShadow = true;

      // Slight curve the petal backward
      petal.rotation.x = -0.25;
      petal.scale.set(scale, scale, scale);
      petalGroup.add(petal);

      return petalGroup;
    };

    // ─── Flower Positions on Branches ───
    const flowerPositions = [
      new THREE.Vector3(-2.5, 3.5, 1.4),
      new THREE.Vector3(-1.5, 2.2, 0.8),
      new THREE.Vector3(-0.5, 0.9, 0.2),
      new THREE.Vector3(1.0, 1.5, 0.4),
      new THREE.Vector3(2.5, 2.0, 0.5),
      new THREE.Vector3(4.8, 3.0, 0.2),
      new THREE.Vector3(4.5, -0.2, -1.2),
      new THREE.Vector3(3.0, 0.5, -0.6),
      new THREE.Vector3(5.8, 0.6, 1.5),
      new THREE.Vector3(-3.5, -1.8, 0.5),
      new THREE.Vector3(0.2, 4.5, 0.5),
      new THREE.Vector3(5.0, 4.8, 0.3),
      new THREE.Vector3(-2.0, 4.2, 1.8),
      new THREE.Vector3(-1.0, 5.8, 0.5),
      new THREE.Vector3(6.0, 6.0, -0.3),
      new THREE.Vector3(6.5, 0.2, 1.8),
      new THREE.Vector3(5.5, -1.0, -1.5),
      new THREE.Vector3(-5.2, -2.8, 1.2),
      new THREE.Vector3(1.2, 3.0, 0.6),
      new THREE.Vector3(3.5, 3.5, 0.4),
    ];

    const petalMats = [petalMat, petalMatDark, petalMatLight];

    flowerPositions.forEach((pos, idx) => {
      const flowerGroup = new THREE.Group();
      flowerGroup.position.copy(pos);

      // Calyx (cup base)
      const calyxGeo = new THREE.CylinderGeometry(0.18, 0.06, 0.22, 10);
      const calyx = new THREE.Mesh(calyxGeo, calyxMat);
      calyx.rotation.x = Math.PI / 2;
      calyx.castShadow = true;
      flowerGroup.add(calyx);

      // Stamens center cluster
      for (let s = 0; s < 12; s++) {
        const stamenGeo = new THREE.CylinderGeometry(0.008, 0.015, 0.2 + Math.random() * 0.15, 4);
        const stamen = new THREE.Mesh(stamenGeo, stamenMat);
        const angle = (s / 12) * Math.PI * 2;
        const r = 0.04 + Math.random() * 0.06;
        stamen.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.15);
        stamen.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        stamen.rotation.z = (Math.random() - 0.5) * 0.3;
        flowerGroup.add(stamen);
      }

      // 5 curved 3D petals
      for (let p = 0; p < 5; p++) {
        const mat = petalMats[idx % 3];
        const petalGroup = createPetal3D(mat, 0.5 + Math.random() * 0.15);
        const angle = (p / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
        petalGroup.rotation.z = angle;
        petalGroup.position.z = 0.08;
        petalGroup.rotation.x = 0.3 + Math.random() * 0.2;
        flowerGroup.add(petalGroup);
      }

      // Random natural orientation
      flowerGroup.rotation.set(
        Math.sin(idx * 1.7) * 0.6,
        Math.cos(idx * 2.3) * 0.9,
        idx * 0.45 + Math.random() * 0.3
      );

      const baseScale = 0.7 + (idx % 4) * 0.12 + Math.random() * 0.1;
      flowerGroup.scale.set(baseScale, baseScale, baseScale);

      flowersGroup.add(flowerGroup);
    });

    // ─── Flower Buds ───
    const budMat = new THREE.MeshStandardMaterial({
      color: 0x8B1A1A,
      roughness: 0.6,
      metalness: 0.05
    });

    const budPositions = [
      new THREE.Vector3(-1.8, 4.8, 1.6),
      new THREE.Vector3(0.5, 5.0, 0.7),
      new THREE.Vector3(5.2, 5.3, 0.1),
      new THREE.Vector3(3.8, 4.2, 0.8),
      new THREE.Vector3(-3.0, 3.8, 1.1),
      new THREE.Vector3(6.2, 5.8, -0.2),
    ];

    budPositions.forEach((pos, idx) => {
      const budGroup = new THREE.Group();
      budGroup.position.copy(pos);

      // Bud body (ellipsoid)
      const budGeo = new THREE.SphereGeometry(0.12, 8, 8);
      budGeo.scale(1, 1.4, 1);
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.castShadow = true;
      budGroup.add(bud);

      // Small calyx around bud
      const miniCalyx = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.1, 6),
        calyxMat
      );
      miniCalyx.position.y = -0.1;
      miniCalyx.rotation.x = Math.PI;
      budGroup.add(miniCalyx);

      budGroup.rotation.set(
        Math.sin(idx * 2.1) * 0.4,
        Math.cos(idx * 1.5) * 0.6,
        (Math.random() - 0.5) * 0.5
      );

      const s = 0.8 + Math.random() * 0.4;
      budGroup.scale.set(s, s, s);
      flowersGroup.add(budGroup);
    });

    // ─── Falling Petals Particle System ───
    const petalsGroup = new THREE.Group();
    petalsGroupRef.current = petalsGroup;
    rootGroup.add(petalsGroup);

    const fallingPetalGeo = new THREE.PlaneGeometry(0.08, 0.12);
    const fallingPetalMat = new THREE.MeshStandardMaterial({
      color: 0xC62828,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.5
    });

    interface FallingPetal {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      life: number;
      maxLife: number;
    }

    const fallingPetals: FallingPetal[] = [];
    const MAX_PETALS = 40;

    for (let i = 0; i < MAX_PETALS; i++) {
      const petal = new THREE.Mesh(fallingPetalGeo, fallingPetalMat.clone());
      petal.visible = false;
      petalsGroup.add(petal);
      fallingPetals.push({
        mesh: petal,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          -0.005 - Math.random() * 0.01,
          (Math.random() - 0.5) * 0.008
        ),
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.03,
          Math.random() * 0.02,
          Math.random() * 0.04
        ),
        life: Math.random() * 200,
        maxLife: 150 + Math.random() * 100
      });
    }

    // ─── Lighting ───
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.0);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffa726, 2.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8899bb, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    lightsRef.current = { dirLight, ambient, hemiLight, fillLight };

    // ─── Interaction ───
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      rootGroup.rotation.y += deltaX * 0.006;
      rootGroup.rotation.x += deltaY * 0.006;
      rotationVelocity = { x: deltaY * 0.003, y: deltaX * 0.003 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsRotating(false);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);
    domElement.addEventListener('touchend', onTouchEnd);

    // ─── Animation Loop ───
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Auto-rotation
      if (isRotating && !isDragging) {
        rootGroup.rotation.y += 0.003;
        rootGroup.rotation.x = Math.sin(time * 0.5) * 0.06;
      } else if (!isDragging) {
        rootGroup.rotation.y += rotationVelocity.y;
        rootGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.93;
        rotationVelocity.y *= 0.93;
      }

      // Branch breeze
      branchGroup.rotation.z = Math.sin(time * 1.0) * 0.015;
      branchGroup.rotation.x = Math.sin(time * 0.7 + 1.0) * 0.008;
      flowersGroup.rotation.z = Math.sin(time * 1.0 + 0.3) * 0.02;
      flowersGroup.rotation.x = Math.sin(time * 0.8 + 0.5) * 0.01;

      // Falling petals
      if (bloomProgress > 0.3) {
        fallingPetals.forEach(petal => {
          petal.life++;
          if (petal.life > petal.maxLife) {
            // Reset petal
            petal.mesh.position.set(
              (Math.random() - 0.5) * 8,
              3 + Math.random() * 4,
              (Math.random() - 0.5) * 4
            );
            petal.life = 0;
            petal.maxLife = 150 + Math.random() * 100;
            petal.velocity.set(
              (Math.random() - 0.5) * 0.01,
              -0.005 - Math.random() * 0.01,
              (Math.random() - 0.5) * 0.008
            );
            petal.mesh.visible = true;
          }

          if (petal.mesh.visible) {
            // Wind sway
            const windX = Math.sin(time * 2 + petal.life * 0.05) * 0.003;
            const windZ = Math.cos(time * 1.5 + petal.life * 0.03) * 0.002;
            petal.mesh.position.x += petal.velocity.x + windX;
            petal.mesh.position.y += petal.velocity.y;
            petal.mesh.position.z += petal.velocity.z + windZ;
            petal.mesh.rotation.x += petal.rotSpeed.x;
            petal.mesh.rotation.y += petal.rotSpeed.y;
            petal.mesh.rotation.z += petal.rotSpeed.z;

            // Fade out near ground
            if (petal.mesh.position.y < -3) {
              petal.mesh.visible = false;
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  // Handle Dynamic Lighting Mode Changes
  useEffect(() => {
    if (!lightsRef.current) return;
    const { dirLight, ambient, hemiLight, fillLight } = lightsRef.current;

    if (lighting === 'day') {
      dirLight.color.setHex(0xffffff);
      dirLight.intensity = 2.4;
      ambient.color.setHex(0xfff8ee);
      ambient.intensity = 1.2;
      hemiLight.color.setHex(0xd0e8f2);
      hemiLight.groundColor.setHex(0x315c3b);
      fillLight.color.setHex(0x99bbdd);
      fillLight.intensity = 0.5;
    } else if (lighting === 'golden') {
      dirLight.color.setHex(0xff9800);
      dirLight.intensity = 3.0;
      ambient.color.setHex(0xffeedb);
      ambient.intensity = 0.9;
      hemiLight.color.setHex(0xffb74d);
      hemiLight.groundColor.setHex(0x173a2b);
      fillLight.color.setHex(0xcc8844);
      fillLight.intensity = 0.3;
    } else if (lighting === 'twilight') {
      dirLight.color.setHex(0x7e57c2);
      dirLight.intensity = 1.4;
      ambient.color.setHex(0x1a237e);
      ambient.intensity = 0.7;
      hemiLight.color.setHex(0x3949ab);
      hemiLight.groundColor.setHex(0x0a1912);
      fillLight.color.setHex(0x5566aa);
      fillLight.intensity = 0.3;
    }
  }, [lighting]);

  // Handle Bloom Progress Scale
  useEffect(() => {
    if (!flowersGroupRef.current) return;
    const flowersGroup = flowersGroupRef.current;

    flowersGroup.children.forEach((child, idx) => {
      const targetScale = Math.max(0.02, bloomProgress * (0.6 + (idx % 4) * 0.1 + Math.sin(idx) * 0.05));
      child.scale.set(targetScale, targetScale, targetScale);
      child.visible = bloomProgress > 0.05;
    });
  }, [bloomProgress]);

  return (
    <div
      className="relative w-full bg-linear-to-b from-[#173A2B]/90 to-[#10291E] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl overflow-hidden text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Ambience Glow */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
          lighting === 'golden' ? 'bg-[#C62828]/25' : lighting === 'day' ? 'bg-[#4B86A8]/25' : 'bg-[#7e57c2]/20'
        }`}
      />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C62828]/20 border border-[#C62828]/40 text-xs text-[#ff8a80] font-medium tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {isBn ? 'ইন্টারেক্টিভ ৩ডি বোটানিক্যাল ভিউয়ার' : 'Interactive 3D Botanical Model'}
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">
            {isBn ? 'শিমুল বৃক্ষের রক্তিম প্রস্ফুটন' : 'Scarlet Blossom of Bombax ceiba'}
          </h3>
        </div>

        {/* Lighting Selector Buttons */}
        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setLighting('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              lighting === 'day' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
            title="Daylight"
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'দিনের আলো' : 'Daylight'}</span>
          </button>
          <button
            onClick={() => setLighting('golden')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              lighting === 'golden' ? 'bg-[#C62828]/50 text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
            title="Golden Hour"
          >
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>{isBn ? 'গোধূলি আলো' : 'Sunset'}</span>
          </button>
          <button
            onClick={() => setLighting('twilight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              lighting === 'twilight' ? 'bg-purple-900/60 text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
            title="Twilight"
          >
            <Moon className="w-3.5 h-3.5 text-blue-300" />
            <span>{isBn ? 'রাত্রির রূপ' : 'Twilight'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[320px] md:h-[400px] my-2 cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
        <div ref={containerRef} className="w-full h-full" />

        {/* Interaction Hint Overlay */}
        <div className={`absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white/75 flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-60'}`}>
          <RotateCcw className="w-3 h-3 text-[#ff8a80] animate-spin" style={{ animationDuration: '8s' }} />
          <span>{isBn ? 'ঘুরিয়ে দেখতে ড্র্যাগ বা সোয়াইপ করুন' : 'Drag or swipe to rotate 3D branch'}</span>
        </div>
      </div>

      {/* Bottom Controls: Bloom Stage Slider & Reset */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-4 border-t border-white/10 bg-black/20 p-4 rounded-2xl">
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <Wind className="w-3.5 h-3.5" />
              {isBn ? 'প্রস্ফুটন পর্যায় (Bloom Stage Slider)' : 'Bloom Stage Progression'}
            </span>
            <span className="font-semibold text-[#ff8a80]">
              {bloomProgress < 0.35
                ? (isBn ? 'শীতকালীন পাতাঝরা পর্যায়' : 'Winter Dormancy')
                : bloomProgress < 0.75
                ? (isBn ? 'কুঁড়ির প্রস্ফুটন' : 'Early Budding')
                : (isBn ? 'বসন্তের পূর্ণ রক্তিম রূপ (Peak Bloom)' : 'Peak Scarlet Spring')}
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.01"
            value={bloomProgress}
            onChange={(e) => setBloomProgress(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C62828]"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setBloomProgress(0.95);
              setLighting('golden');
              setIsRotating(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBn ? 'রিসেট' : 'Reset View'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
