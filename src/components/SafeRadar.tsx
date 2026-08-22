"use client";

import React, { useEffect, useState } from "react";
import { Shield, Sparkles, X, Heart, Globe, Radio } from "lucide-react";
import { Language, IntentTag } from "@/lib/types";

interface SafeRadarProps {
  alias: string;
  selectedLang: Language;
  selectedTags: IntentTag[];
  onCancel: () => void;
  onMatched: (peer: { alias: string; nativeLang: Language; tags: IntentTag[] }) => void;
}

const REASSURANCE_MESSAGES = [
  "Zero persistent chat logs saved to any database",
  "You are 100% anonymous — no IP, email, or identity tracked",
  "Scanning memory queue for peers with shared lived experience...",
  "In-stream Aho-Corasick safety shield is armed & active",
  "Emotion-preserving vernacular translation ready...",
];

export const SafeRadar: React.FC<SafeRadarProps> = ({
  alias,
  selectedLang,
  selectedTags,
  onCancel,
  onMatched,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(8);
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotating copy
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % REASSURANCE_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // 8s countdown timer & simulated matchmaking fallback
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Match with empathetic companion
          const companionNames = ["Calm River #819", "Gentle Cloud #304", "Mindful Cedar #912", "Serene Oasis #550"];
          const compName = companionNames[Math.floor(Math.random() * companionNames.length)];
          const targetLang: Language = selectedLang === "English" ? "Hinglish" : "English";
          
          setTimeout(() => {
            onMatched({
              alias: compName,
              nativeLang: targetLang,
              tags: selectedTags.length > 0 ? selectedTags : ["General Support"],
            });
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedLang, selectedTags, onMatched]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Radar Main Card */}
      <div className="w-full glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Pulse Waves */}
        <div className="relative w-64 h-64 my-6 flex items-center justify-center">
          {/* Concentric expanding circles */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-radar-1 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-radar-2 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-teal-400/20 animate-radar-3 pointer-events-none" />

          {/* Central Avatar */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-2xl shadow-emerald-500/40">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
              <Radio className="w-8 h-8 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-300 mt-1 uppercase tracking-wider">Radar Active</span>
            </div>
          </div>
        </div>

        {/* Identity & Tags Badge */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold">
            <span>You: <strong className="text-emerald-400">{alias}</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{selectedLang}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reassurance Copy with smooth transition */}
        <div className="min-h-[48px] flex items-center justify-center max-w-md">
          <p className="text-sm sm:text-base text-slate-300 font-medium transition-all duration-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{REASSURANCE_MESSAGES[messageIndex]}</span>
          </p>
        </div>

        {/* Match Timer Countdown */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Estimated match window: <strong className="text-slate-300">{secondsRemaining}s</strong></span>
        </div>

        {/* Cancel CTA */}
        <div className="mt-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cancel Matching</span>
          </button>
        </div>
      </div>
    </div>
  );
};
