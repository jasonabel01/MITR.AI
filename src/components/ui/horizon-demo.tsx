"use client";

import React from "react";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, Zap, Globe, Flame } from "lucide-react";

export function HorizonHeroDemo() {
  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-white relative">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MitrAI</span>
        </Link>
      </div>

      {/* 3D Horizon Hero Component */}
      <HorizonHeroSection
        title="HORIZON"
        subtitle="3D Interactive Cyber-Sanctuary & Sub-2ms Safety Shield"
        badgeText="POWERED BY THREE.JS • GSAP • PARALLAX POST-PROCESSING"
        onEnterSanctuary={() => {
          window.location.href = "/#sanctuary";
        }}
        onOpenSandbox={() => {
          window.location.href = "/";
        }}
      />

      {/* Feature Showcase Grid below 3D Horizon */}
      <section className="relative z-40 bg-[#070a12] py-24 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
              3D Architecture Matrix
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Next-Generation Mental Health Infrastructure
            </h2>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Move your cursor over the 3D horizon above to experience real-time Three.js mouse parallax with dynamic wave terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Aho-Corasick &lt; 2ms</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deterministic regex trie halting crisis transmission in sub-2ms with one-tap Tele-MANAS hotline integration.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-teal-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Vernacular Indic NLP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Colloquial Hinglish and Indic dialect translation preserving emotional tone, nuance, and psychological safety.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-red-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero-Trace RAM Burn</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Volatile circular buffers dissolved immediately upon exit. Zero persistent disk storage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HorizonHeroDemo;
