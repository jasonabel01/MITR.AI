"use client";

import React, { useState, useEffect } from "react";
import { ProductLanding } from "@/components/ProductLanding";
import { SafeRadar } from "@/components/SafeRadar";
import { EmpatheticChat } from "@/components/EmpatheticChat";
import { CrisisModal } from "@/components/CrisisModal";
import { SessionSummary } from "@/components/SessionSummary";
import { DualPeerDemo } from "@/components/DualPeerDemo";
import { Language, IntentTag, ChatMessage, HelplineInfo, SessionSummaryData } from "@/lib/types";
import { generateAnonymousAlias, calculateSessionSummary } from "@/lib/utils";
import { HELPLINES } from "@/lib/crisisKeywords";

type AppScreen = "landing" | "radar" | "chat" | "summary" | "sandbox";

export default function MitrAIApp() {
  // App Navigation State
  const [screen, setScreen] = useState<AppScreen>("landing");

  // User Profile
  const [alias, setAlias] = useState<string>("Brave Willow #402");
  const [selectedLang, setSelectedLang] = useState<Language>("Hinglish");
  const [selectedTags, setSelectedTags] = useState<IntentTag[]>(["Exam Burnout", "Social Anxiety"]);

  // Peer Profile
  const [matchedPeer, setMatchedPeer] = useState<{
    alias: string;
    nativeLang: Language;
    tags: IntentTag[];
  } | null>(null);

  // Crisis Modal State
  const [crisisActive, setCrisisActive] = useState(false);
  const [crisisDetectedPhrase, setCrisisDetectedPhrase] = useState<string | undefined>(undefined);
  const [crisisHelplines, setCrisisHelplines] = useState<HelplineInfo[]>(HELPLINES);

  // Session Summary Data
  const [sessionSummary, setSessionSummary] = useState<SessionSummaryData | null>(null);

  // Initialize random alias on client mount
  useEffect(() => {
    setAlias(generateAnonymousAlias());
  }, []);

  const handleRefreshAlias = () => {
    setAlias(generateAnonymousAlias());
  };

  const handleToggleTag = (tag: IntentTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFindPeer = () => {
    setScreen("radar");
  };

  const handleMatched = (peer: { alias: string; nativeLang: Language; tags: IntentTag[] }) => {
    setMatchedPeer(peer);
    setScreen("chat");
  };

  const handleLeaveChat = (messages: ChatMessage[]) => {
    const summary = calculateSessionSummary(messages, "self");
    setSessionSummary(summary);
    setScreen("summary");
  };

  const handleTriggerCrisis = (phrase: string, helplines: HelplineInfo[]) => {
    setCrisisDetectedPhrase(phrase);
    setCrisisHelplines(helplines.length > 0 ? helplines : HELPLINES);
    setCrisisActive(true);
  };

  const handleRestart = () => {
    setAlias(generateAnonymousAlias());
    setMatchedPeer(null);
    setSessionSummary(null);
    setCrisisActive(false);
    setScreen("landing");
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] relative flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Decorative Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        {screen === "landing" && (
          <ProductLanding
            alias={alias}
            onRefreshAlias={handleRefreshAlias}
            selectedLang={selectedLang}
            onSelectLang={setSelectedLang}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onFindPeer={handleFindPeer}
            onOpenSandbox={() => setScreen("sandbox")}
          />
        )}

        {screen === "radar" && (
          <SafeRadar
            alias={alias}
            selectedLang={selectedLang}
            selectedTags={selectedTags}
            onCancel={() => setScreen("landing")}
            onMatched={handleMatched}
          />
        )}

        {screen === "chat" && matchedPeer && (
          <EmpatheticChat
            selfAlias={alias}
            selfLang={selectedLang}
            peerAlias={matchedPeer.alias}
            peerLang={matchedPeer.nativeLang}
            tags={selectedTags}
            onLeaveChat={handleLeaveChat}
            onTriggerCrisis={handleTriggerCrisis}
          />
        )}

        {screen === "summary" && sessionSummary && (
          <SessionSummary
            summary={sessionSummary}
            onRestart={handleRestart}
          />
        )}

        {screen === "sandbox" && (
          <DualPeerDemo
            onBack={() => setScreen("landing")}
            onOpenCrisisModal={(phrase, lines) => {
              setCrisisDetectedPhrase(phrase);
              setCrisisHelplines(lines);
              setCrisisActive(true);
            }}
          />
        )}
      </div>

      {/* Screen 4: Emergency Circuit Breaker Modal Overlay */}
      {crisisActive && (
        <CrisisModal
          detectedPhrase={crisisDetectedPhrase}
          helplines={crisisHelplines}
          onClose={() => setCrisisActive(false)}
        />
      )}

      {/* Global Minimalist Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MitrAI (SafeSpeak) — Zero-Trace Peer Support Sanctuary</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tele-MANAS: 14416</span>
            <span>•</span>
            <span>KIRAN: 1800-599-0019</span>
            <span>•</span>
            <span className="text-emerald-400">RAM Ephemeral</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
