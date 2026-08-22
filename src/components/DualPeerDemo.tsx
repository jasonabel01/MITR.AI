"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  Globe,
  Radio,
  Send,
  LifeBuoy,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  Layers
} from "lucide-react";
import { Language, ChatMessage, HelplineInfo } from "@/lib/types";
import { VoiceInputButton } from "./VoiceInputButton";
import { checkCrisis, HELPLINES } from "@/lib/crisisKeywords";
import { translateColloquial } from "@/lib/translator";
import { checkMisinformationOrHarassment, playSafeMessageChime, playCrisisAlertSound } from "@/lib/utils";

interface DualPeerDemoProps {
  onBack: () => void;
  onOpenCrisisModal: (phrase: string, helplines: HelplineInfo[]) => void;
}

export const DualPeerDemo: React.FC<DualPeerDemoProps> = ({
  onBack,
  onOpenCrisisModal,
}) => {
  // Peer 1 State (Hinglish)
  const [peer1Alias] = useState("Brave Willow #402");
  const [peer1Lang, setPeer1Lang] = useState<Language>("Hinglish");
  const [peer1Input, setPeer1Input] = useState("");

  // Peer 2 State (English)
  const [peer2Alias] = useState("Calm River #819");
  const [peer2Lang, setPeer2Lang] = useState<Language>("English");
  const [peer2Input, setPeer2Input] = useState("");

  // Shared in-memory conversation buffer
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      senderId: "peer2",
      senderAlias: "Calm River #819",
      isSelf: false,
      originalText: "Hello friend. I'm here to listen. What's been on your mind?",
      translatedText: "Namaste dost. Main yaha sunne ke liye hu. Dimag me kya chal raha hai?",
      sourceLang: "English",
      targetLang: "Hinglish",
      detectedEmotion: "Supportive / Empathetic",
      valence: "Positive-Healing",
      latencyMs: 85,
      timestamp: Date.now() - 30000,
    },
  ]);

  const [circuitBreakerTriggered, setCircuitBreakerTriggered] = useState<string | null>(null);

  const sendMessageFromPeer = (
    sender: "peer1" | "peer2",
    rawText: string
  ) => {
    if (!rawText.trim()) return;

    const sourceLang = sender === "peer1" ? peer1Lang : peer2Lang;
    const targetLang = sender === "peer1" ? peer2Lang : peer1Lang;
    const senderAlias = sender === "peer1" ? peer1Alias : peer2Alias;

    // 1. Crisis Circuit Breaker
    const crisis = checkCrisis(rawText);
    if (crisis.isCrisis) {
      playCrisisAlertSound();
      setCircuitBreakerTriggered(crisis.detectedPhrase || rawText);
      onOpenCrisisModal(crisis.detectedPhrase || rawText, crisis.helplines);
      if (sender === "peer1") setPeer1Input("");
      else setPeer2Input("");
      return;
    }

    // 2. Sliding window check
    const modCheck = checkMisinformationOrHarassment(rawText);

    // 3. Emotion translation
    const trans = translateColloquial(rawText, sourceLang, targetLang);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: sender,
      senderAlias,
      isSelf: false, // context dependent in render
      originalText: rawText,
      translatedText: trans.translatedText,
      sourceLang,
      targetLang,
      detectedEmotion: trans.detectedEmotion,
      valence: trans.valence,
      latencyMs: trans.latencyMs,
      flag: modCheck.flag,
      timestamp: Date.now(),
    };

    setChatLog((prev) => [...prev, newMsg]);
    playSafeMessageChime();

    if (sender === "peer1") setPeer1Input("");
    else setPeer2Input("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Interactive Judge & Hackathon Demo Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                Dual Stream
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live simulation of two anonymous peers speaking different dialects with sub-2ms crisis intercept.
            </p>
          </div>
        </div>

        {/* Instant Test Presets for Judges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => sendMessageFromPeer("peer1", "Yaar bahut anxiety ho rahi hai, kuch samajh nahi aa raha")}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-medium transition-all cursor-pointer"
          >
            ⚡ Test Hinglish Distress
          </button>
          <button
            onClick={() => sendMessageFromPeer("peer1", "Take magic powder to cure depression instantly")}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-medium transition-all cursor-pointer"
          >
            ⚠️ Test Misinfo Flag
          </button>
          <button
            onClick={() => sendMessageFromPeer("peer1", "I feel like ending my life, no reason to live")}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 font-bold transition-all cursor-pointer"
          >
            🛑 Test Crisis Circuit Breaker
          </button>
        </div>
      </div>

      {/* Dual Split Screen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* PEER 1 PANEL (HINGLISH SENDER) */}
        {/* ======================================================== */}
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/30 shadow-xl flex flex-col h-[650px] relative">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                1
              </div>
              <div>
                <div className="text-sm font-bold text-white">{peer1Alias}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Native: <strong>{peer1Lang}</strong>
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              User View A
            </span>
          </div>

          {/* Chat Stream View for Peer 1 */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatLog.map((msg) => {
              const isMine = msg.senderId === "peer1";
              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl border text-xs ${
                    isMine
                      ? "bg-emerald-950/40 border-emerald-500/40 ml-4"
                      : "bg-slate-900/80 border-white/10 mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold">{isMine ? "You" : msg.senderAlias}</span>
                    {msg.latencyMs && <span className="font-mono text-emerald-400">{msg.latencyMs}ms</span>}
                  </div>

                  {/* For Peer 1, show what Peer 1 perceives */}
                  <p className="font-medium text-slate-100 text-xs sm:text-sm">
                    {isMine ? msg.originalText : msg.translatedText}
                  </p>

                  {/* Sub text */}
                  {!isMine && msg.originalText !== msg.translatedText && (
                    <div className="mt-1 pt-1 border-t border-white/5 text-[10px] text-slate-400 italic">
                      Original ({msg.sourceLang}): "{msg.originalText}"
                    </div>
                  )}

                  {msg.flag && (
                    <div className="mt-1 text-[10px] text-red-400 font-semibold">{msg.flag}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input for Peer 1 */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2">
            <VoiceInputButton
              language={peer1Lang}
              onTranscript={(txt) => setPeer1Input((p) => (p ? `${p} ${txt}` : txt))}
            />
            <input
              type="text"
              value={peer1Input}
              onChange={(e) => setPeer1Input(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessageFromPeer("peer1", peer1Input)}
              placeholder="Type in Hinglish (e.g. 'Yaar anxiety ho rahi hai')..."
              className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => sendMessageFromPeer("peer1", peer1Input)}
              className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PEER 2 PANEL (ENGLISH RECIPIENT) */}
        {/* ======================================================== */}
        <div className="glass-card rounded-3xl p-5 border border-teal-500/30 shadow-xl flex flex-col h-[650px] relative">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm border border-teal-500/30">
                2
              </div>
              <div>
                <div className="text-sm font-bold text-white">{peer2Alias}</div>
                <div className="text-[11px] text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Native: <strong>{peer2Lang}</strong>
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              User View B
            </span>
          </div>

          {/* Chat Stream View for Peer 2 */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatLog.map((msg) => {
              const isMine = msg.senderId === "peer2";
              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl border text-xs ${
                    isMine
                      ? "bg-teal-950/40 border-teal-500/40 ml-4"
                      : "bg-slate-900/80 border-white/10 mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold">{isMine ? "You" : msg.senderAlias}</span>
                    {msg.latencyMs && <span className="font-mono text-teal-400">{msg.latencyMs}ms</span>}
                  </div>

                  {/* For Peer 2, show translated text into English if Peer 1 sent Hinglish */}
                  <p className="font-medium text-slate-100 text-xs sm:text-sm">
                    {isMine ? msg.originalText : msg.translatedText}
                  </p>

                  {/* Sub text showing raw Indic original */}
                  {!isMine && msg.originalText !== msg.translatedText && (
                    <div className="mt-1 pt-1 border-t border-white/5 text-[10px] text-slate-400 italic">
                      Original ({msg.sourceLang}): "{msg.originalText}"
                    </div>
                  )}

                  {msg.flag && (
                    <div className="mt-1 text-[10px] text-red-400 font-semibold">{msg.flag}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input for Peer 2 */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2">
            <VoiceInputButton
              language={peer2Lang}
              onTranscript={(txt) => setPeer2Input((p) => (p ? `${p} ${txt}` : txt))}
            />
            <input
              type="text"
              value={peer2Input}
              onChange={(e) => setPeer2Input(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessageFromPeer("peer2", peer2Input)}
              placeholder="Type in English (e.g. 'I am right here with you')..."
              className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => sendMessageFromPeer("peer2", peer2Input)}
              className="p-2 rounded-xl bg-teal-500 text-slate-950 font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
