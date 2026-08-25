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

  // References for live 3D updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const flowersGroupRef = useRef<THREE.Group | null>(null);
  const branchGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    ambient: THREE.AmbientLight;
    hemiLight: THREE.HemisphereLight;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Branch Group
    const branchGroup = new THREE.Group();
    branchGroupRef.current = branchGroup;
    rootGroup.add(branchGroup);

    // Procedural Tree Branch Material
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.85,
      metalness: 0.05
    });

    // Create realistic sculptural branch curves
    const curvePoints = [
      new THREE.Vector3(-4.5, -3, -0.5),
      new THREE.Vector3(-2.5, -1.2, 0.2),
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(2.8, 1.6, 0.5),
      new THREE.Vector3(4.8, 2.8, 0.2)
    ];
    const mainCurve = new THREE.CatmullRomCurve3(curvePoints);
    const mainBranchGeo = new THREE.TubeGeometry(mainCurve, 40, 0.35, 12, false);
    const mainBranch = new THREE.Mesh(mainBranchGeo, barkMaterial);
    mainBranch.castShadow = true;
    branchGroup.add(mainBranch);

    // Secondary sub-branches
    const subCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.3, 0),
      new THREE.Vector3(-1.2, 1.8, 0.8),
      new THREE.Vector3(-2.2, 3.0, 1.2)
    ]);
    const subGeo1 = new THREE.TubeGeometry(subCurve1, 20, 0.2, 8, false);
    const subBranch1 = new THREE.Mesh(subGeo1, barkMaterial);
    branchGroup.add(subBranch1);

    const subCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.8, 1.2, 0.3),
      new THREE.Vector3(2.5, 0.2, -0.6),
      new THREE.Vector3(3.8, -0.4, -1.0)
    ]);
    const subGeo2 = new THREE.TubeGeometry(subCurve2, 20, 0.18, 8, false);
    const subBranch2 = new THREE.Mesh(subGeo2, barkMaterial);
    branchGroup.add(subBranch2);

    const subCurve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.2, 2.0, 0.4),
      new THREE.Vector3(4.2, 1.0, 0.9),
      new THREE.Vector3(5.2, 0.5, 1.4)
    ]);
    const subGeo3 = new THREE.TubeGeometry(subCurve3, 20, 0.15, 8, false);
    const subBranch3 = new THREE.Mesh(subGeo3, barkMaterial);
    branchGroup.add(subBranch3);

    // Flowers Group
    const flowersGroup = new THREE.Group();
    flowersGroupRef.current = flowersGroup;
    rootGroup.add(flowersGroup);

    // Flower Blossom Construction Function
    const flowerPositions = [
      new THREE.Vector3(-2.2, 3.0, 1.2),
      new THREE.Vector3(-1.4, 2.0, 0.7),
      new THREE.Vector3(-0.2, 0.8, 0.2),
      new THREE.Vector3(1.2, 1.3, 0.4),
      new THREE.Vector3(2.8, 1.8, 0.6),
      new THREE.Vector3(4.8, 2.9, 0.2),
      new THREE.Vector3(3.8, -0.4, -1.0),
      new THREE.Vector3(2.6, 0.2, -0.5),
      new THREE.Vector3(5.2, 0.5, 1.4),
      new THREE.Vector3(-2.6, -1.0, 0.3),
      new THREE.Vector3(0.6, 0.5, -0.2),
      new THREE.Vector3(3.6, 2.4, 0.3)
    ];

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xC62828,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x2e4722,
      roughness: 0.8
    });

    const stamenMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      roughness: 0.3,
      metalness: 0.4
    });

    // Create 5-petaled classic Bombax ceiba bloom
    flowerPositions.forEach((pos, idx) => {
      const flowerMesh = new THREE.Group();
      flowerMesh.position.copy(pos);

      // Calyx cup
      const calyxGeo = new THREE.CylinderGeometry(0.2, 0.08, 0.25, 8);
      const calyx = new THREE.Mesh(calyxGeo, calyxMat);
      calyx.rotation.x = Math.PI / 2;
      flowerMesh.add(calyx);

      // Stamens center
      const stamenGeo = new THREE.ConeGeometry(0.12, 0.4, 8);
      const stamen = new THREE.Mesh(stamenGeo, stamenMat);
      stamen.position.z = 0.2;
      stamen.rotation.x = Math.PI / 2;
      flowerMesh.add(stamen);

      // 5 Petals
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      petalShape.bezierCurveTo(0.25, 0.4, 0.5, 0.8, 0, 1.2);
      petalShape.bezierCurveTo(-0.5, 0.8, -0.25, 0.4, 0, 0);
      const singlePetalGeo = new THREE.ShapeGeometry(petalShape);

      for (let p = 0; p < 5; p++) {
        const petal = new THREE.Mesh(singlePetalGeo, petalMat);
        petal.position.z = 0.1;
        const angle = (p / 5) * Math.PI * 2;
        petal.rotation.z = angle;
        petal.rotation.x = 0.35; // Flared outward
        petal.scale.set(0.65, 0.65, 0.65);
        flowerMesh.add(petal);
      }

      // Random natural tilt
      flowerMesh.rotation.set(
        Math.sin(idx) * 0.5,
        Math.cos(idx) * 0.8,
        (idx * 0.4)
      );

      const baseScale = 0.85 + (idx % 3) * 0.15;
      flowerMesh.scale.set(baseScale, baseScale, baseScale);

      flowersGroup.add(flowerMesh);
    });

    // Lighting setup
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffa726, 2.4);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    lightsRef.current = { dirLight, ambient, hemiLight };

    // Interaction & Drag Orbit Handling
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

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;

      rotationVelocity = { x: deltaY * 0.004, y: deltaX * 0.004 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile devices
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

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);
    domElement.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle auto-rotation when not dragging
      if (isRotating && !isDragging) {
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x = Math.sin(time * 0.6) * 0.08;
      } else if (!isDragging) {
        // Inertia damping
        rootGroup.rotation.y += rotationVelocity.y;
        rootGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.92;
        rotationVelocity.y *= 0.92;
      }

      // Gentle branch breathing breeze
      branchGroup.rotation.z = Math.sin(time * 1.2) * 0.025;
      flowersGroup.rotation.z = Math.sin(time * 1.2 + 0.2) * 0.03;

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
    const { dirLight, ambient, hemiLight } = lightsRef.current;

    if (lighting === 'day') {
      dirLight.color.setHex(0xffffff);
      dirLight.intensity = 2.6;
      ambient.color.setHex(0xfff8ee);
      ambient.intensity = 1.4;
      hemiLight.color.setHex(0xd0e8f2);
      hemiLight.groundColor.setHex(0x315c3b);
    } else if (lighting === 'golden') {
      dirLight.color.setHex(0xff9800); // Warm Sunset Golden
      dirLight.intensity = 3.0;
      ambient.color.setHex(0xffeedb);
      ambient.intensity = 1.0;
      hemiLight.color.setHex(0xffb74d);
      hemiLight.groundColor.setHex(0x173a2b);
    } else if (lighting === 'twilight') {
      dirLight.color.setHex(0x7e57c2); // Mystic Twilight Violet/Cyan
      dirLight.intensity = 1.5;
      ambient.color.setHex(0x1a237e);
      ambient.intensity = 0.8;
      hemiLight.color.setHex(0x3949ab);
      hemiLight.groundColor.setHex(0x0a1912);
    }
  }, [lighting]);

  // Handle Bloom Progress Scale
  useEffect(() => {
    if (!flowersGroupRef.current) return;
    const flowersGroup = flowersGroupRef.current;

    flowersGroup.children.forEach((flower, idx) => {
      // Scale flower based on bloom progress
      const targetScale = Math.max(0.05, bloomProgress * (0.8 + (idx % 3) * 0.15));
      flower.scale.set(targetScale, targetScale, targetScale);
      flower.visible = bloomProgress > 0.08;
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
          <span>{isBn ? 'ঘুরিয়ে দেখতে ড্র্যাগ বা সোয়াইপ করুন' : 'Drag or swipe to rotate 3D branch'}</span>
        </div>
      </div>

      {/* Bottom Controls: Bloom Stage Slider & Reset */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-4 border-t border-white/10 bg-black/20 p-4 rounded-2xl">
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <Wind className="w-3.5 h-3.5" />
              {isBn ? 'প্রস্ফুটন পর্যায় (Bloom Stage Slider)' : 'Bloom Stage Progression'}
            </span>
            <span className="font-semibold text-[#ff8a80]">
              {bloomProgress < 0.35 
                ? (isBn ? 'শীতকালীন পাতাঝরা পর্যায়' : 'Winter Dormancy')
                : bloomProgress < 0.75
                ? (isBn ? 'কুঁড়ির প্রস্ফুটন' : 'Early Budding')
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
