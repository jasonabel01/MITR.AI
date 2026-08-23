"use client";

import React, { useRef, useState } from "react";
import {
  Shield,
  Sparkles,
  Globe,
  Radio,
  HeartHandshake,
  Activity,
  Flame,
  ArrowRight,
  PhoneCall,
  MonitorPlay,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Volume2,
  ChevronDown,
  Box,
  Video
} from "lucide-react";
import { EscapeHero } from "@/components/ui/escape-hero";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { WorkPageHero } from "@/components/ui/work-page-hero";
import { SanctuaryLanding } from "@/components/SanctuaryLanding";
import { Language, IntentTag } from "@/lib/types";

interface ProductLandingProps {
  alias: string;
  onRefreshAlias: () => void;
  selectedLang: Language;
  onSelectLang: (lang: Language) => void;
  selectedTags: IntentTag[];
  onToggleTag: (tag: IntentTag) => void;
  onFindPeer: () => void;
  onOpenSandbox: () => void;
}

export const ProductLanding: React.FC<ProductLandingProps> = ({
  alias,
  onRefreshAlias,
  selectedLang,
  onSelectLang,
  selectedTags,
  onToggleTag,
  onFindPeer,
  onOpenSandbox,
}) => {
  const sanctuaryRef = useRef<HTMLDivElement>(null);
  const [heroMode, setHeroMode] = useState<"escape" | "horizon" | "video">("escape");

  const scrollToSanctuary = () => {
    sanctuaryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-[#F1F5F9] relative flex flex-col">
      {/* ── Fixed Floating Navigation Bar (Only active on Horizon / Video mode to prevent double navbar on Escape) ── */}
      {heroMode !== "escape" && (
        <header className="fixed top-0 inset-x-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                MitrAI <span className="text-emerald-400 font-light text-sm">(SafeSpeak)</span>
              </span>
            </div>

            {/* Quick Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#hero" className="hover:text-emerald-400 transition-colors">
                Overview
              </a>
              <a href="#sanctuary" className="hover:text-emerald-400 transition-colors">
                The Sanctuary
              </a>
              <a href="#features" className="hover:text-emerald-400 transition-colors">
                Safety Architecture
              </a>
              <a href="#helplines" className="hover:text-emerald-400 transition-colors">
                24/7 Helplines
              </a>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenSandbox}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" />
                <span>Judge Sandbox</span>
              </button>

              <button
                onClick={scrollToSanctuary}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Enter Sanctuary</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ── 1. Hero Section (Escape Hero as Primary, with 3D Horizon & Kinetic video support) ── */}
      <section id="hero" className={`relative w-full ${heroMode !== "escape" ? "pt-16" : ""}`}>
        {heroMode === "escape" ? (
          <div className="relative w-full">
            <EscapeHero
              onEnterSanctuary={scrollToSanctuary}
              onSearch={(q) => scrollToSanctuary()}
              onOpenSandbox={onOpenSandbox}
            />
          </div>
        ) : heroMode === "horizon" ? (
          <HorizonHeroSection
            title="MITRAI"
            subtitle="3D Interactive Indic Peer Sanctuary & Sub-2ms Safety Shield"
            badgeText="ZERO-AUTH • THREE.JS 3D HORIZON • SUB-2MS CIRCUIT BREAKER"
            onEnterSanctuary={scrollToSanctuary}
            onOpenSandbox={onOpenSandbox}
          />
        ) : (
          <div className="relative w-full">
            <WorkPageHero
              videoSrc="https://res.cloudinary.com/dsuwzuaxp/video/upload/video1_horxtt.mp4"
              topWord="healing"
              rightWord="your"
              bottomWord="truth"
              accentColor="#10B981"
              textColor="#F1F5F9"
              backgroundColor="#0B0F19"
              showClocks={true}
              clocks={[
                { tz: "Asia/Kolkata", label: "INDIA" },
                { tz: "America/New_York", label: "NEW YORK" },
                { tz: "Asia/Dubai", label: "DUBAI" },
                { tz: "Europe/London", label: "LONDON" },
              ]}
              scrollDistance="+=150%"
            />
            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 text-slate-400 text-xs animate-bounce pointer-events-none">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                Scroll to Expand & Enter
              </span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        )}
      </section>

      {/* ── 2. Interactive Sanctuary Station (Screen 1) ── */}
      <section
        id="sanctuary"
        ref={sanctuaryRef}
        className="relative z-40 bg-[#0B0F19] py-20 px-4 border-t border-white/10 overflow-hidden min-h-[90vh] flex flex-col justify-center"
      >
        {/* Full-Bleed Sanctuary Artwork Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/sanctuary-bg.jpg"
            alt="Sanctuary Forest Station"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.7] contrast-[1.05]"
          />
          {/* Multi-layered dark gradient for high readability and seamless blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/60 to-[#0B0F19]" />
          <div className="absolute inset-0 bg-[#0B0F19]/40 backdrop-blur-[2px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-4 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wide shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>LIVE INTERACTIVE SANCTUARY TERMINAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Step Inside The Sanctuary
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Choose your dialect and intent tags below. Click <strong>"Find a Safe Peer"</strong> to launch the real-time encrypted queue.
          </p>
        </div>

        <div className="relative z-10">
          <SanctuaryLanding
            alias={alias}
            onRefreshAlias={onRefreshAlias}
            selectedLang={selectedLang}
            onSelectLang={onSelectLang}
            selectedTags={selectedTags}
            onToggleTag={onToggleTag}
            onFindPeer={onFindPeer}
            onOpenSandbox={onOpenSandbox}
          />
        </div>
      </section>

      {/* ── 3. Safety Architecture, Helplines & Footer with Continuous Dynamic Background ── */}
      <div className="relative z-40 overflow-hidden border-t border-white/10">
        {/* Full-Bleed Pixel Art Artwork Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/features-bg.jpg"
            alt="Late Night Pixel Art Room"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.7] contrast-[1.1]"
          />
          {/* Deep dark gradient overlays for rich contrast & readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#070a12]/80 to-[#05070c]" />
          <div className="absolute inset-0 bg-[#070a12]/40 backdrop-blur-[2px]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />
        </div>

        {/* ── 3A. Engineering Pillars ── */}
        <section id="features" className="relative z-10 py-24 px-6 md:px-16">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full inline-block">
                Engineering Pillars
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                Zero-Trace Privacy & In-Stream AI Guardrails
              </h2>
              <p className="text-slate-300 max-w-2xl text-base md:text-lg leading-relaxed">
                Engineered from the ground up for high emotional safety, zero persistent storage, and sub-2ms deterministic crisis prevention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-[#0c131d]/90 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/70 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.6)] group flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Sub-2ms Deterministic Filter
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Aho-Corasick Crisis Breaker
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Scans self-harm and suicidal ideation across English and Indic transliterations in sub-2ms. Immediately halts transmission to peer and presents one-tap emergency helpline cards.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Latency: &lt; 2ms</span>
                  <span className="text-emerald-400 font-mono font-semibold">Deterministic Trie</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-[#0c131d]/90 backdrop-blur-xl border border-teal-500/30 hover:border-teal-400/70 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.6)] group flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform shadow-md">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-teal-400 uppercase font-bold tracking-wider">
                    Indic Colloquial NLP
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                    Emotion-Preserving Translation
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Translates code-mixed Hinglish and colloquial Indic phrasing while preserving the original emotional nuance, vulnerability, and valence without clinical distortion.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Dialects: Hinglish, Hindi, Ta, Te</span>
                  <span className="text-teal-400 font-mono font-semibold">Dual-Bubble Stream</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-[#0c131d]/90 backdrop-blur-xl border border-red-500/30 hover:border-red-400/70 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.6)] group flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform shadow-md">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-red-400 uppercase font-bold tracking-wider">
                    Zero Persistent Storage
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                    Ephemeral RAM Session Burn
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Zero database writes. All message packets stream exclusively through ephemeral in-memory circular buffers. Upon room exit, all memory is permanently dissolved.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Disk Persistence: 0 Bytes</span>
                  <span className="text-red-400 font-mono font-semibold">Memory Dissolved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3B. 24/7 Verified Crisis Helpline Directory ── */}
        <section id="helplines" className="relative z-10 py-20 px-6 md:px-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest text-red-400 font-mono font-bold bg-red-500/10 border border-red-500/30 px-3.5 py-1.5 rounded-full inline-block">
                Emergency Safety Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                Instant National Support Helplines
              </h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                If you or someone you know is in acute distress, confidential, toll-free help is available 24/7 in multiple Indian languages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Helpline 1 */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-red-500/20 via-[#0c131d]/95 to-[#0c131d]/95 border border-red-500/50 space-y-4 shadow-[0_12px_36px_rgba(239,68,68,0.15)] backdrop-blur-xl">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500 text-white font-bold uppercase shadow-sm">
                    National Primary
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Tele-MANAS</h3>
                  <p className="text-xs text-slate-300 mt-1">Govt. of India 24/7 Mental Health Helpline (20+ Languages)</p>
                </div>
                <div className="text-3xl font-mono font-extrabold text-red-400">14416</div>
                <a
                  href="tel:14416"
                  className="w-full py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 14416 Toll-Free</span>
                </a>
              </div>

              {/* Helpline 2 */}
              <div className="p-6 rounded-3xl bg-[#0c131d]/90 border border-white/15 space-y-4 shadow-xl backdrop-blur-xl">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase">
                    Toll-Free 24/7
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">KIRAN Helpline</h3>
                  <p className="text-xs text-slate-300 mt-1">Depression, Anxiety & Crisis Intervention Hotline</p>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-200">1800-599-0019</div>
                <a
                  href="tel:18005990019"
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call KIRAN</span>
                </a>
              </div>

              {/* Helpline 3 */}
              <div className="p-6 rounded-3xl bg-[#0c131d]/90 border border-white/15 space-y-4 shadow-xl backdrop-blur-xl">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase">
                    Call & WhatsApp
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Vandrevala Foundation</h3>
                  <p className="text-xs text-slate-300 mt-1">Free 24/7 Mental Health Counseling Support</p>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-200">+91 9999 666 555</div>
                <a
                  href="tel:+919999666555"
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Counselor</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3C. Footer ── */}
        <footer className="relative z-10 py-8 text-center text-xs text-slate-400 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">MitrAI (SafeSpeak)</span>
              <span>— Real-time Indic Peer Support & Crisis Shield</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span>Zero DB Persistence</span>
              <span>•</span>
              <span>DPDP / HIPAA Compliant Blueprint</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">RAM Ephemeral</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
