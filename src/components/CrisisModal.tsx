"use client";

import React from "react";
import { AlertTriangle, PhoneCall, Heart, ShieldAlert, ArrowLeft, ExternalLink, LifeBuoy } from "lucide-react";
import { HelplineInfo } from "@/lib/types";

interface CrisisModalProps {
  detectedPhrase?: string;
  helplines: HelplineInfo[];
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  detectedPhrase,
  helplines,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Glow effect */}
      <div className="absolute w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl glass-coral-glow space-y-6">
        {/* Header Alert Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
            <LifeBuoy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Safety Circuit-Breaker Triggered
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              You Are Not Alone. We're Here For You.
            </h2>
          </div>
        </div>

        {/* Empathetic Message */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/20 text-slate-200 text-sm leading-relaxed space-y-2">
          <p className="font-medium text-white">
            We noticed words indicating intense emotional pain or crisis. We care deeply about your life and safety, and want to make sure you have immediate access to certified support.
          </p>
          {detectedPhrase && (
            <p className="text-xs text-red-300/80 font-mono bg-red-950/80 p-2 rounded-lg border border-red-800/40">
              Trigger detected: "{detectedPhrase}" (Transmission to peer halted for safety)
            </p>
          )}
        </div>

        {/* Instant Helpline Cards */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Instant 24/7 Verified Helplines (Toll-Free):
          </div>

          {helplines.map((line, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                line.primary
                  ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50 ring-1 ring-red-400/40"
                  : "bg-slate-900/70 border-white/10"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{line.name}</span>
                  {line.primary && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-bold uppercase">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{line.description}</div>
                <div className="text-sm font-mono font-bold text-red-400 mt-1">{line.number}</div>
              </div>

              <a
                href={line.action}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all cursor-pointer shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Confidential • Free • Non-judgmental support</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            I'm Safe / Return to Chat
          </button>
        </div>
      </div>
    </div>
  );
};
