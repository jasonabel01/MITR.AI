"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Shield,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Radio,
  Globe,
  Flame,
  PhoneCall,
  ChevronDown,
  MonitorPlay
} from "lucide-react";

interface HorizonHeroProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  onEnterSanctuary?: () => void;
  onOpenSandbox?: () => void;
  primaryColor?: string;
  horizonColor?: string;
}

export const HorizonHeroSection: React.FC<HorizonHeroProps> = ({
  title = "MITRAI",
  subtitle = "Real-Time Indic Peer Sanctuary & Crisis Shield",
  badgeText = "ZERO-AUTH • ZERO-TRACE • SUB-2MS SAFETY SHIELD",
  onEnterSanctuary,
  onOpenSandbox,
  primaryColor = "#10B981",
  horizonColor = "#064e3b",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Three.js Horizon Scene Setup ──
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.035);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Terrain Plane with Custom Vertex Displacement
    const planeGeo = new THREE.PlaneGeometry(36, 48, 64, 64);
    planeGeo.rotateX(-Math.PI / 2);

    // Create wave height pattern
    const pos = planeGeo.attributes.position;
    const count = pos.count;
    const initialY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Higher mountains on sides, canyon in center
      const distFromCenter = Math.abs(x);
      const canyon = Math.max(0, distFromCenter - 2.5) * 0.45;
      const height = (Math.sin(x * 0.5) * Math.cos(z * 0.4) * 0.6 + canyon) * 1.4;
      pos.setY(i, height);
      initialY[i] = height;
    }
    planeGeo.computeVertexNormals();

    // Wireframe Mesh for Futuristic Horizon Look
    const planeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x10b981),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const terrainMesh = new THREE.Mesh(planeGeo, planeMat);
    terrainMesh.position.set(0, -1.2, -10);
    scene.add(terrainMesh);

    // 3. Glowing Horizon Sun / Core
    const sunGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x059669),
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 0.4, -22);
    scene.add(sun);

    // Secondary glowing outer ring
    const ringGeo = new THREE.RingGeometry(3.6, 3.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x34d399),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.4, -21.8);
    scene.add(ring);

    // 4. Floating Ambient Particle Field
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i + 1] = Math.random() * 8 - 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 30 - 5;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: new THREE.Color(0x6ee7b7),
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 1.8;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / windowHalfX;
      mouseY = (e.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Undulate terrain speed
      const positions = planeGeo.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const newY = initialY[i] + Math.sin(elapsedTime * 1.8 + z * 0.3 + x * 0.2) * 0.18;
        positions.setY(i, newY);
      }
      positions.needsUpdate = true;

      // Pulse sun & ring
      ring.rotation.z = elapsedTime * 0.2;
      sun.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.03);

      // Rotate particle field
      particles.rotation.y = elapsedTime * 0.02;

      // Smooth camera interpolation
      targetCameraX = mouseX * 0.8;
      targetCameraY = 1.8 - mouseY * 0.4;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -8);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // ── GSAP Intro Animations ──
  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0B0F19] text-[#F1F5F9] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* ── 3D Canvas Background ── */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Ambient Top Glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/60 to-transparent pointer-events-none z-10" />

      {/* ── Header & Navigation ── */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/25">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            MitrAI <span className="text-emerald-400 font-light text-base">(SafeSpeak)</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a href="#sanctuary" className="hover:text-emerald-400 transition-colors">
            Sanctuary
          </a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            Safety Shield
          </a>
          <a href="#helplines" className="hover:text-emerald-400 transition-colors">
            Helplines (14416)
          </a>
          <a href="/hero-demo" className="hover:text-emerald-400 transition-colors">
            Kinetic Hero
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all cursor-pointer backdrop-blur-md"
            >
              <MonitorPlay className="w-4 h-4 text-emerald-400" />
              <span>Judge Sandbox</span>
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Slide-Out Animated Mobile Drawer Menu ── */}
      {menuOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-72 bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-bold text-white">Navigation</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium text-slate-300">
              <a
                href="#sanctuary"
                onClick={() => setMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                The Sanctuary
              </a>
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                Safety Architecture
              </a>
              <a
                href="#helplines"
                onClick={() => setMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                24/7 Helplines (Tele-MANAS)
              </a>
              <a
                href="/hero-demo"
                onClick={() => setMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                Kinetic Video Hero
              </a>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {onOpenSandbox && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSandbox();
                }}
                className="w-full py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MonitorPlay className="w-4 h-4 text-emerald-400" />
                <span>Launch Judge Sandbox</span>
              </button>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                onEnterSanctuary?.();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Enter Sanctuary</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main Hero Content Overlay ── */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center space-y-6 my-auto"
      >
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold tracking-wider shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{badgeText}</span>
        </div>

        {/* Monumental Hero Headline */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
          style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {title}
        </h1>

        {/* Subtitle & Value Proposition */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          {subtitle}. Speak freely in your natural dialect — our in-stream AI preserves your authentic emotion while an active circuit-breaker guards your safety.
        </p>

        {/* Hero Action Button Cluster */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onEnterSanctuary}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Enter The Sanctuary</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer backdrop-blur-md hover:border-emerald-500/40 shadow-xl"
            >
              <MonitorPlay className="w-4 h-4 text-emerald-400" />
              <span>Live Dual-Peer Sandbox</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Bottom Horizon Telemetry Bar ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            3D Horizon Engine Active
          </span>
          <span className="text-slate-600">•</span>
          <span>Aho-Corasick &lt; 2ms</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Dialects: Hinglish, Hindi, Tamil, Telugu, English</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Tele-MANAS: 14416</span>
        </div>
      </div>
    </div>
  );
};

export default HorizonHeroSection;
