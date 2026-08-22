"use client";

import React, { useState } from "react";
import { Shield, Sparkles, RefreshCw, Globe, HeartHandshake, EyeOff, Activity, Users, ArrowRight, MonitorPlay } from "lucide-react";
import { Language, IntentTag } from "@/lib/types";
import { generateAnonymousAlias } from "@/lib/utils";

interface SanctuaryLandingProps {
  alias: string;
  onRefreshAlias: () => void;
  selectedLang: Language;
  onSelectLang: (lang: Language) => void;
  selectedTags: IntentTag[];
  onToggleTag: (tag: IntentTag) => void;
  onFindPeer: () => void;
  onOpenSandbox: () => void;
}

const LANGUAGES: { code: Language; label: string; sub: string }[] = [
  { code: "Hinglish", label: "Hinglish", sub: "Hindi + English Mix" },
  { code: "English", label: "English", sub: "Global Standard" },
  { code: "Hindi", label: "हिन्दी", sub: "Devanagari Script" },
  { code: "Tamil", label: "தமிழ்", sub: "Colloquial Dialect" },
  { code: "Telugu", label: "తెలుగు", sub: "Colloquial Dialect" },
];

const INTENT_TAGS: { tag: IntentTag; emoji: string; desc: string }[] = [
  { tag: "Exam Burnout", emoji: "📚", desc: "Academic pressure & finals stress" },
  { tag: "Social Anxiety", emoji: "👥", desc: "Fear of judgment & crowd isolation" },
  { tag: "Loneliness", emoji: "🌙", desc: "Feeling unheard & needing connection" },
  { tag: "Family Pressure", emoji: "🏠", desc: "Expectations & domestic distress" },
  { tag: "Career Uncertainty", emoji: "🧭", desc: "Future anxiety & job search stress" },
  { tag: "Chronic Condition", emoji: "💊", desc: "Health burdens & daily fatigue" },
  { tag: "Grief & Loss", emoji: "🕊️", desc: "Navigating deep loss & sorrow" },
  { tag: "General Support", emoji: "🌱", desc: "Just need a kind, empathetic ear" },
];

export const SanctuaryLanding: React.FC<SanctuaryLandingProps> = ({
  alias,
  onRefreshAlias,
  selectedLang,
  onSelectLang,
  selectedTags,
  onToggleTag,
  onFindPeer,
  onOpenSandbox,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
      {/* Header & Logo */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZERO-AUTH • ZERO-PERSISTENT-LOGS • SUB-2MS SAFETY SHIELD</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
          MitrAI <span className="text-emerald-400 font-light text-3xl sm:text-4xl">(SafeSpeak)</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          A real-time, destigmatized peer sanctuary. Speak openly in your natural Indic dialect — our in-stream AI preserves emotion, translates nuances, and guards your safety.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="w-full glass-card rounded-3xl p-6 sm:p-8 space-y-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section 1: Transient Identity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              1. Your Ephemeral Identity
            </label>
            <span className="text-xs text-slate-500">Auto-generated • No Login Required</span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-3.5 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-700/40 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-sm">
                {alias.charAt(0)}
              </div>
              <div>
                <div className="text-base font-bold text-white tracking-wide">{alias}</div>
                <div className="text-xs text-emerald-400/80 font-medium">100% Anonymous & Volatile</div>
              </div>
            </div>
            <button
              onClick={onRefreshAlias}
              title="Roll a new alias"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-white/5 rounded-xl px-3 py-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Section 2: Native Language Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              2. Your Native Speaking Dialect
            </label>
            <span className="text-xs text-slate-500">Real-time Emotion-Preserving Translation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLang(lang.code)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50"
                      : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? "text-emerald-300" : "text-slate-200"}`}>
                    {lang.label}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{lang.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Topic / Intent Cloud */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              3. What's on your mind today? (Select 1 or more)
            </label>
            <span className="text-xs text-emerald-400 font-medium">
              {selectedTags.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {INTENT_TAGS.map((item) => {
              const isChecked = selectedTags.includes(item.tag);
              return (
                <button
                  key={item.tag}
                  onClick={() => onToggleTag(item.tag)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isChecked
                      ? "bg-emerald-500/15 border-emerald-500/80 text-white ring-1 ring-emerald-400/40"
                      : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/15 hover:bg-slate-900/70"
                  }`}
                >
                  <span className="text-lg p-1 rounded-lg bg-white/5">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${isChecked ? "text-emerald-300" : "text-slate-200"}`}>
                      {item.tag}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onFindPeer}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>Find a Safe Peer</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSandbox}
            className="py-4 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:border-emerald-500/40 cursor-pointer shadow-sm"
          >
            <MonitorPlay className="w-4 h-4 text-emerald-400" />
            <span>Live Judge Demo Sandbox</span>
          </button>

          <a
            href="/hero-demo"
            className="py-4 px-5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Kinetic Hero Demo</span>
          </a>
        </div>
      </div>

      {/* Trust & Architecture Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-200">Aho-Corasick Circuit Breaker</div>
            <div className="text-[11px] text-slate-400">Sub-2ms self-harm crisis intervention</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-200">Emotion-Preserving AI</div>
            <div className="text-[11px] text-slate-400">Hinglish & Indic dialect translation</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-200">Zero-Trace RAM Purge</div>
            <div className="text-[11px] text-slate-400">No database writes, complete memory burn</div>
          </div>
        </div>
      </div>
    </div>
  );
};
