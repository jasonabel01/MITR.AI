"use client";

import React from "react";
import { Sparkles, RefreshCw, Compass, Shield, Globe, HeartHandshake, Zap, Activity, ArrowRight, UserCheck, Flame } from "lucide-react";
import { Language, IntentTag } from "@/lib/types";

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

const INTENT_TAGS: { tag: IntentTag; emoji: string; desc: string; color: string }[] = [
  { tag: "Exam Burnout", emoji: "📚", desc: "Academic pressure & finals stress", color: "from-blue-500/20 to-indigo-500/20" },
  { tag: "Social Anxiety", emoji: "👥", desc: "Fear of judgment & crowd isolation", color: "from-teal-500/20 to-emerald-500/20" },
  { tag: "Loneliness", emoji: "🌙", desc: "Feeling unheard & needing connection", color: "from-purple-500/20 to-pink-500/20" },
  { tag: "Family Pressure", emoji: "🏠", desc: "Expectations & domestic distress", color: "from-amber-500/20 to-orange-500/20" },
  { tag: "Career Uncertainty", emoji: "🧭", desc: "Future anxiety & job search stress", color: "from-cyan-500/20 to-blue-500/20" },
  { tag: "Chronic Condition", emoji: "💊", desc: "Health burdens & daily fatigue", color: "from-rose-500/20 to-red-500/20" },
  { tag: "Grief & Loss", emoji: "🕊️", desc: "Navigating deep loss & sorrow", color: "from-slate-500/20 to-gray-500/20" },
  { tag: "General Support", emoji: "🌱", desc: "Just need a kind, empathetic ear", color: "from-emerald-500/20 to-green-500/20" },
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
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center gap-6 select-none">
      {/* ── Rich, Vibrant Obsidian & Emerald Sanctuary Terminal ── */}
      <div className="w-full rounded-3xl p-6 sm:p-9 space-y-7 border border-emerald-500/30 bg-[#0c131d]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden text-white">
        {/* Vibrant Gradient Edge Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-emerald-500/25 to-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/30">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm uppercase tracking-wider text-white">
                MitrAI Sanctuary Terminal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              Zero-Trace Encrypted
            </span>
          </div>
        </div>

        {/* Section 1: Ephemeral Identity Card */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              1. Your Ephemeral Identity
            </span>
            <span className="text-slate-400 font-normal text-[11px]">Auto-generated • Zero login required</span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/90 border border-emerald-500/25 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/25">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-emerald-400 font-extrabold text-xl">
                  {alias.charAt(0)}
                </div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-white tracking-tight">
                  {alias}
                </div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>100% Anonymous & Volatile RAM Buffer</span>
                </div>
              </div>
            </div>

            <button
              onClick={onRefreshAlias}
              title="Generate a new alias"
              className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl px-4 py-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Section 2: Dialect Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-emerald-400" />
              2. Your Native Speaking Dialect
            </span>
            <span className="text-slate-400 font-normal text-[11px]">Real-time emotion-preserving NLP</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLang(lang.code)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
                    isSelected
                      ? "bg-gradient-to-b from-emerald-500/25 to-emerald-600/10 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400"
                      : "bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800/90 hover:border-white/20"
                  }`}
                >
                  <span className="font-extrabold text-sm text-white">{lang.label}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{lang.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Topic Cloud */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <Compass className="w-4 h-4 text-emerald-400" />
              3. What brings you here today?
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
              {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select 1 or more"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INTENT_TAGS.map(({ tag, emoji, desc, color }) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                    isSelected
                      ? "bg-gradient-to-b from-emerald-500/30 to-teal-600/20 border-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400"
                      : "bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800/90 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <span className="font-bold text-xs text-white leading-tight">{tag}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate mt-1">{desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Main Departure CTA */}
          <button
            onClick={onFindPeer}
            className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-base shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Find a Safe Peer</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Judge Sandbox Demo Button */}
          <button
            onClick={onOpenSandbox}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-white/15 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Judge Sandbox</span>
          </button>
        </div>
      </div>

      {/* ── Architecture Pillars ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <div className="p-4 rounded-2xl bg-[#0c131d]/90 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3.5 shadow-lg">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Sub-2ms Crisis Breaker</div>
            <div className="text-[11px] text-slate-400">Aho-Corasick trie safety filter</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c131d]/90 border border-teal-500/20 backdrop-blur-md flex items-center gap-3.5 shadow-lg">
          <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Emotion-Preserving NLP</div>
            <div className="text-[11px] text-slate-400">Hinglish & Indic dialect translation</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c131d]/90 border border-red-500/20 backdrop-blur-md flex items-center gap-3.5 shadow-lg">
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Zero-Trace Ephemeral RAM</div>
            <div className="text-[11px] text-slate-400">No database writes, memory dissolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};
