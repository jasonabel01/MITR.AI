"use client";

import React, { useEffect, useState } from "react";
import {
  Flame,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  Activity,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";
import { SessionSummaryData } from "@/lib/types";

interface SessionSummaryProps {
  summary: SessionSummaryData;
  onRestart: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  summary,
  onRestart,
}) => {
  const [burned, setBurned] = useState(false);

  useEffect(() => {
    // Gentle healing celebratory burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#34D399", "#6EE7B7", "#F59E0B"],
      });
    } catch {}

    const timer = setTimeout(() => {
      setBurned(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
      {/* Session Purge Header Alert */}
      <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Memory Burn Animation Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-emerald-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-6 h-6 animate-burn text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Zero-Trace Memory Dissolved</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  100% Wiped
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All message tokens, raw voice transcripts, and buffers have been permanently incinerated from volatile memory.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>0 Bytes Persisted</span>
          </div>
        </div>

        {/* Conversational Health Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Conversational Health & Empathy Card
            </h2>
            <span className="text-xs text-slate-400">Total Exchanges: {summary.totalMessages}</span>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Mutual Empathy</div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {summary.mutualEmpathyScore}%
              </div>
              <div className="text-[11px] text-emerald-400/80">High emotional resonance</div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Listening Balance</div>
              <div className="text-3xl font-extrabold text-teal-300">
                {summary.listeningRatioScore}%
              </div>
              <div className="text-[11px] text-teal-400/80">Equitable safe space</div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Emotional Shift</div>
              <div className="text-base font-bold text-slate-100 mt-2 line-clamp-1">
                {summary.emotionalShift}
              </div>
              <div className="text-[11px] text-slate-400">De-escalated tension</div>
            </div>
          </div>
        </div>

        {/* Positive Behavioral Takeaways */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Empowering Behavioral Insights
          </div>

          <div className="space-y-2">
            {summary.keyTakeaways.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3"
              >
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warm Closing Affirmation */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs sm:text-sm leading-relaxed text-center font-medium">
          "{summary.affirmation}"
        </div>

        {/* Return Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Enter The Sanctuary (New Session)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
