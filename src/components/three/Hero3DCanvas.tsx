import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  interactive?: boolean;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle / Petal Geometry
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 45 : 110;

    // Create custom petal shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.4, 0.6, 0.8, 1.2, 0, 2.0);
    petalShape.bezierCurveTo(-0.8, 1.2, -0.4, 0.6, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);
    
    // Gradient shader or refined material for scarlet Shimul petals
    const petalMaterials = [
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xC62828), // Shimul Red
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88
      }),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x9B1B1B), // Deep Crimson
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.82
      }),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xE53935), // Vibrant Coral Red
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.92
      })
    ];

    const petals: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      speedZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      initialX: number;
    }[] = [];

    const group = new THREE.Group();

    for (let i = 0; i < petalCount; i++) {
      const mat = petalMaterials[i % petalMaterials.length];
      const mesh = new THREE.Mesh(petalGeo, mat);
      
      const scale = 0.35 + Math.random() * 0.55;
      mesh.scale.set(scale, scale, scale);

      mesh.position.x = (Math.random() - 0.5) * 55;
      mesh.position.y = (Math.random() - 0.5) * 40;
      mesh.position.z = (Math.random() - 0.5) * 35;

      mesh.rotation.x = Math.random() * Math.PI * 2;
      mesh.rotation.y = Math.random() * Math.PI * 2;
      mesh.rotation.z = Math.random() * Math.PI * 2;

      group.add(mesh);

      petals.push({
        mesh,
        speedX: -0.015 - Math.random() * 0.03, // Gentle leftward river breeze
        speedY: -0.02 - Math.random() * 0.04, // Falling down
        speedZ: (Math.random() - 0.5) * 0.02,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        initialX: mesh.position.x
      });
    }

    scene.add(group);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x4b86a8, 0.8);
    backLight.position.set(-10, -10, -10);
    scene.add(backLight);

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 4;
      targetY = -y * 3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Animate petals
      petals.forEach((p) => {
        // Natural swaying oscillation
        p.mesh.position.x += p.speedX + Math.sin(time + p.mesh.position.y * 0.5) * 0.015;
        p.mesh.position.y += p.speedY;
        p.mesh.position.z += p.speedZ;

        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;
        p.mesh.rotation.z += p.rotSpeedZ;

        // Reset if petal falls below boundary
        if (p.mesh.position.y < -22) {
          p.mesh.position.y = 22;
          p.mesh.position.x = (Math.random() - 0.3) * 50;
          p.mesh.position.z = (Math.random() - 0.5) * 30;
        }
        if (p.mesh.position.x < -30) {
          p.mesh.position.x = 30;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* CSS Animated Fallback for low-end devices */}
        <div className="absolute w-full h-full bg-radial from-[#c6282811] via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
};
