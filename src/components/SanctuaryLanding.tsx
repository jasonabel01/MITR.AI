"use client";

import React from "react";
import { Sparkles, RefreshCw, Compass, Ticket, BookOpen, Train, ShieldCheck, HeartHandshake, Feather } from "lucide-react";
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
  { code: "Hinglish", label: "Hinglish", sub: "Hindi + English" },
  { code: "English", label: "English", sub: "Standard" },
  { code: "Hindi", label: "हिन्दी", sub: "Devanagari" },
  { code: "Tamil", label: "தமிழ்", sub: "Tamil Script" },
  { code: "Telugu", label: "తెలుగు", sub: "Telugu Script" },
];

const INTENT_TAGS: { tag: IntentTag; emoji: string; desc: string }[] = [
  { tag: "Exam Burnout", emoji: "📖", desc: "Study & exam stress" },
  { tag: "Social Anxiety", emoji: "🌿", desc: "Overthinking & crowds" },
  { tag: "Loneliness", emoji: "🏮", desc: "Needing a listening ear" },
  { tag: "Family Pressure", emoji: "🏡", desc: "Home & expectations" },
  { tag: "Career Uncertainty", emoji: "🧭", desc: "Future & job search" },
  { tag: "Chronic Condition", emoji: "☕", desc: "Daily fatigue & health" },
  { tag: "Grief & Loss", emoji: "🍃", desc: "Loss & heavy heart" },
  { tag: "General Support", emoji: "🌱", desc: "Just wanting to chat" },
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
      {/* ── Studio Ghibli-Style Wooden Station Terminal Board ── */}
      <div className="w-full rounded-[28px] p-6 sm:p-9 space-y-7 border border-[#a3b899]/30 bg-[#121c15]/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] relative overflow-hidden text-[#f4efe6]">
        {/* Soft atmospheric amber lantern glow in corners */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Board Rivets / Timber Header */}
        <div className="flex items-center justify-between border-b border-[#a3b899]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#243d2b] border border-[#a3b899]/40 flex items-center justify-center text-amber-200">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xs uppercase tracking-widest text-[#d8e2dc] font-bold">
                Platform 1 • Sanctuary Station
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#a3b899] bg-[#1a2b1f] px-3 py-1 rounded-full border border-[#a3b899]/25">
            100% Zero-Trace
          </span>
        </div>

        {/* Section 1: Travel Pass / Ephemeral Identity */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-serif text-[#d8e2dc]">
            <span className="flex items-center gap-2 font-semibold tracking-wide">
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              1. Sanctuary Pass (Anonymous Stamp)
            </span>
            <span className="text-[11px] text-[#95a88d] font-sans">No sign-up or login required</span>
          </div>

          <div className="flex items-center justify-between bg-[#19261c]/90 border border-[#a3b899]/25 rounded-2xl p-3.5 sm:p-4 shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f5238] to-[#1a3321] border border-[#a3b899]/40 flex items-center justify-center text-amber-200 font-serif font-bold text-xl shadow-md">
                {alias.charAt(0)}
              </div>
              <div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#faf7f2] tracking-wide">
                  {alias}
                </div>
                <div className="text-[11px] text-[#a3b899] font-sans flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Transient Peer Identity</span>
                </div>
              </div>
            </div>

            <button
              onClick={onRefreshAlias}
              title="Stamp a new alias"
              className="flex items-center gap-1.5 text-xs text-[#d8e2dc] hover:text-white bg-[#253b2a] hover:bg-[#2f4a35] border border-[#a3b899]/30 rounded-xl px-3.5 py-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-serif">New Stamp</span>
            </button>
          </div>
        </div>

        {/* Section 2: Dialect Selection Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-serif text-[#d8e2dc]">
            <span className="flex items-center gap-2 font-semibold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              2. Your Speaking Dialect
            </span>
            <span className="text-[11px] text-[#95a88d] font-sans">Emotion-preserving translation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLang(lang.code)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[70px] ${
                    isSelected
                      ? "bg-[#2a4d33] border-amber-300/80 text-[#faf7f2] shadow-[0_4px_16px_rgba(42,77,51,0.6)] ring-1 ring-amber-300/40 transform scale-[1.02]"
                      : "bg-[#17231a]/80 border-[#a3b899]/20 text-[#c2d1bd] hover:bg-[#1f3024] hover:border-[#a3b899]/40"
                  }`}
                >
                  <span className="font-serif font-bold text-sm text-[#faf7f2]">{lang.label}</span>
                  <span className="text-[10px] text-[#9eb297]">{lang.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Topic Cloud / Concerns */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-serif text-[#d8e2dc]">
            <span className="flex items-center gap-2 font-semibold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              3. What brings you to the Sanctuary today?
            </span>
            <span className="text-[11px] font-mono text-amber-300">
              {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select 1 or more"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INTENT_TAGS.map(({ tag, emoji, desc }) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[74px] ${
                    isSelected
                      ? "bg-[#2a4d33] border-emerald-400/80 text-[#faf7f2] shadow-[0_4px_14px_rgba(40,80,50,0.5)] ring-1 ring-emerald-400/40"
                      : "bg-[#17231a]/80 border-[#a3b899]/20 text-[#c2d1bd] hover:bg-[#1f3024] hover:border-[#a3b899]/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{emoji}</span>
                    <span className="font-serif font-bold text-xs text-[#faf7f2] leading-tight">{tag}</span>
                  </div>
                  <span className="text-[10px] text-[#9eb297] truncate mt-1">{desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Main Departure CTA */}
          <button
            onClick={onFindPeer}
            className="w-full sm:flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#2d5738] via-[#3a6e47] to-[#2d5738] hover:from-[#356642] hover:to-[#356642] text-[#faf7f2] font-serif font-bold text-base shadow-[0_8px_24px_rgba(35,70,45,0.6)] border border-amber-300/40 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
          >
            <Feather className="w-4 h-4 text-amber-300" />
            <span>Step Inside & Connect With A Safe Peer</span>
          </button>

          {/* Judge Sandbox Demo Button */}
          <button
            onClick={onOpenSandbox}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-5 rounded-2xl bg-[#1a2b1e] hover:bg-[#223828] text-[#d8e2dc] hover:text-white font-serif text-xs font-semibold border border-[#a3b899]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Judge Sandbox Demo</span>
          </button>
        </div>
      </div>

      {/* ── Vintage Platform Signboards (Architecture Pillars) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <div className="p-3.5 rounded-2xl bg-[#142017]/85 border border-[#a3b899]/25 backdrop-blur-md flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#243d2b] text-amber-300 border border-[#a3b899]/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-serif font-bold text-[#faf7f2]">Sub-2ms Crisis Breaker</div>
            <div className="text-[10px] text-[#a3b899]">Aho-Corasick trie safety filter</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#142017]/85 border border-[#a3b899]/25 backdrop-blur-md flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#243d2b] text-amber-300 border border-[#a3b899]/30">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-serif font-bold text-[#faf7f2]">Emotion-Preserving NLP</div>
            <div className="text-[10px] text-[#a3b899]">Hinglish & colloquial Indic translation</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#142017]/85 border border-[#a3b899]/25 backdrop-blur-md flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#243d2b] text-amber-300 border border-[#a3b899]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-serif font-bold text-[#faf7f2]">Zero-Trace Ephemeral RAM</div>
            <div className="text-[10px] text-[#a3b899]">No database logs, memory dissolved on exit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
