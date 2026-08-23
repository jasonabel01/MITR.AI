"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Shield,
  Sparkles,
  LogOut,
  AlertCircle,
  Clock,
  Heart,
  Globe,
  Flame,
  ChevronDown,
  ChevronUp,
  Info,
  Radio,
  CheckCircle2
} from "lucide-react";
import { ChatMessage, Language, IntentTag, HelplineInfo } from "@/lib/types";
import { VoiceInputButton } from "./VoiceInputButton";
import { checkCrisis, HELPLINES } from "@/lib/crisisKeywords";
import { translateColloquial } from "@/lib/translator";
import { checkMisinformationOrHarassment, playSafeMessageChime, playCrisisAlertSound } from "@/lib/utils";

interface EmpatheticChatProps {
  selfAlias: string;
  selfLang: Language;
  peerAlias: string;
  peerLang: Language;
  tags: IntentTag[];
  onLeaveChat: (messages: ChatMessage[]) => void;
  onTriggerCrisis: (phrase: string, helplines: HelplineInfo[]) => void;
}

const SAMPLE_PROMPTS = [
  "Yaar bahut anxiety ho rahi hai, kuch samajh nahi aa raha",
  "I've been feeling deeply overwhelmed with final exams.",
  "Mera dimag fat raha hai, tension bohot hai",
  "Don't worry, main tumhare sath hu. Take a deep breath.",
];

export const EmpatheticChat: React.FC<EmpatheticChatProps> = ({
  selfAlias,
  selfLang,
  peerAlias,
  peerLang,
  tags,
  onLeaveChat,
  onTriggerCrisis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [peerTyping, setPeerTyping] = useState(false);
  const [holdingNotice, setHoldingNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, peerTyping]);

  // Initial welcome peer message
  useEffect(() => {
    const timer = setTimeout(() => {
      const welcome: ChatMessage = {
        id: "msg_welcome",
        senderId: "peer",
        senderAlias: peerAlias,
        isSelf: false,
        originalText: peerLang === "English" ? "Hey! I'm here to listen. How has your day been feeling?" : "Namaste! Main yaha hu sunne ke liye. Kaisa feel ho raha hai?",
        translatedText: selfLang === "English" ? "Hey! I'm here to listen. How has your day been feeling?" : "Namaste! Main sunne ke liye yaha hu. Aaj ka din kaisa lag raha hai?",
        sourceLang: peerLang,
        targetLang: selfLang,
        detectedEmotion: "Supportive / Empathetic",
        valence: "Positive-Healing",
        latencyMs: 140,
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      playSafeMessageChime();
    }, 600);

    return () => clearTimeout(timer);
  }, [peerAlias, peerLang, selfLang]);

  const handleSendMessage = (textToSend?: string) => {
    const raw = textToSend || inputText;
    if (!raw.trim()) return;

    // ==========================================================
    // STAGE 1: SUB-2ms DETERMINISTIC CRISIS CIRCUIT-BREAKER
    // ==========================================================
    const crisisCheck = checkCrisis(raw);
    if (crisisCheck.isCrisis) {
      playCrisisAlertSound();
      onTriggerCrisis(crisisCheck.detectedPhrase || raw, crisisCheck.helplines);
      setInputText("");
      return;
    }

    // ==========================================================
    // STAGE 2: SLIDING CONTEXT MODERATION CHECK
    // ==========================================================
    const modCheck = checkMisinformationOrHarassment(raw);

    // ==========================================================
    // STAGE 3: EMOTION-PRESERVING TRANSLATION
    // ==========================================================
    const translation = translateColloquial(raw, selfLang, peerLang);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: "self",
      senderAlias: selfAlias,
      isSelf: true,
      originalText: raw,
      translatedText: translation.translatedText,
      sourceLang: selfLang,
      targetLang: peerLang,
      detectedEmotion: translation.detectedEmotion,
      valence: translation.valence,
      latencyMs: translation.latencyMs,
      flag: modCheck.flag,
      timestamp: Date.now(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText("");
    playSafeMessageChime();

    // Trigger simulated empathetic peer response for interactive testing
    simulatePeerResponse(raw, updated);
  };

  const simulatePeerResponse = (userText: string, currentHistory: ChatMessage[]) => {
    setPeerTyping(true);
    const delay = Math.min(2200, Math.max(1200, userText.length * 40));

    setTimeout(() => {
      setPeerTyping(false);
      const lower = userText.toLowerCase();
      let peerReplyRaw = "I completely hear you. That sounds really heavy, but you're strong for sharing it.";
      let peerReplySource: Language = peerLang;

      if (lower.includes("anxiety") || lower.includes("fat raha") || lower.includes("panic")) {
        peerReplyRaw = peerLang === "Hinglish" || peerLang === "Hindi"
          ? "Tension mat lo dost, main tumhare sath hu. Ek deep breath lo, sab step by step solve ho jayega."
          : "Please don't panic my friend, I am right here with you. Take a slow deep breath, we will get through this.";
      } else if (lower.includes("alone") || lower.includes("akelapan") || lower.includes("lonely")) {
        peerReplyRaw = peerLang === "Hinglish" || peerLang === "Hindi"
          ? "Tum akele bilkul nahi ho. Main yaha bina kisi judgment ke sirf tumhe sunne ke liye hu."
          : "You are not alone at all. I am here to support you without any judgment.";
      } else if (lower.includes("exam") || lower.includes("burnout") || lower.includes("pressure")) {
        peerReplyRaw = peerLang === "Hinglish" || peerLang === "Hindi"
          ? "Exams ka stress bohot genuine hota hai. Khud par thoda reham karo aur thoda paani piyo."
          : "Exam burnout is very real. Please be gentle on yourself and remember your health comes first.";
      }

      const peerTranslation = translateColloquial(peerReplyRaw, peerReplySource, selfLang);
      const peerMsg: ChatMessage = {
        id: `msg_${Date.now()}_peer`,
        senderId: "peer",
        senderAlias: peerAlias,
        isSelf: false,
        originalText: peerReplyRaw,
        translatedText: peerTranslation.translatedText,
        sourceLang: peerReplySource,
        targetLang: selfLang,
        detectedEmotion: peerTranslation.detectedEmotion,
        valence: peerTranslation.valence,
        latencyMs: peerTranslation.latencyMs,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, peerMsg]);
      playSafeMessageChime();
    }, delay);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col h-[90vh]">
      {/* Workspace Header */}
      <div className="glass-card rounded-2xl p-4 mb-3 flex flex-wrap items-center justify-between gap-3 border border-white/10 shadow-lg">
        {/* Peer Info & Translation Direction */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-base shadow-md">
            {peerAlias.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{peerAlias}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Safe Peer
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Translation Stream:</span>
              <span className="text-emerald-300 font-mono font-medium">{selfLang}</span>
              <span className="text-slate-500">⇄</span>
              <span className="text-teal-300 font-mono font-medium">{peerLang}</span>
            </div>
          </div>
        </div>

        {/* Tags & Leave Button */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1">
            {tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-white/5">
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={() => onLeaveChat(messages)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Leave & Purge Chat</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 glass-card rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 border border-white/10 shadow-inner">
        {/* Zero-Trace Security Notice Banner */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/5 text-slate-400 text-[11px]">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>All messages stream via volatile in-memory buffers. Zero disk persistence.</span>
          </div>
        </div>

        {messages.map((msg) => {
          const isSender = msg.isSelf;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[75%] ${
                isSender ? "ml-auto" : "mr-auto"
              }`}
            >
              {/* Sender Name & Timestamp */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">
                  {isSender ? `You (${selfAlias})` : msg.senderAlias}
                </span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {msg.latencyMs && (
                  <span className="text-[10px] text-emerald-400/80 font-mono">
                    ⚡ {msg.latencyMs}ms
                  </span>
                )}
              </div>

              {/* Dual Bubble Container */}
              <div
                className={`p-4 rounded-3xl border transition-all ${
                  isSender
                    ? "bg-gradient-to-br from-emerald-600/25 to-teal-700/30 border-emerald-500/40 text-slate-100 shadow-md shadow-emerald-500/5 rounded-tr-sm"
                    : "bg-slate-900/85 border-white/10 text-slate-200 shadow-md rounded-tl-sm"
                }`}
              >
                {/* Main Translated Text (High Readability) */}
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  {isSender ? msg.originalText : msg.translatedText}
                </p>

                {/* Sub-Text (Raw Transcript for Transparency) */}
                {!isSender && msg.originalText !== msg.translatedText && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-start gap-1.5 text-xs text-slate-400 italic">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold not-italic text-slate-500 text-[10px] uppercase block">
                        Original ({msg.sourceLang}):
                      </span>
                      <span>"{msg.originalText}"</span>
                    </div>
                  </div>
                )}

                {/* Emotion / Safety Meta Chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {msg.detectedEmotion && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        msg.valence === "Positive-Healing"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : msg.valence === "Negative-Distress"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      ❤️ {msg.detectedEmotion}
                    </span>
                  )}

                  {msg.flag && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      {msg.flag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Peer Typing Indicator */}
        {peerTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            <span>{peerAlias} is typing empathetically...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Starters */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Quick Starters:
          </span>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white shrink-0 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="mt-2 glass-card rounded-2xl p-2.5 flex items-center gap-2 border border-white/10 shadow-xl">
        {/* Vernacular Voice-to-Text Button */}
        <VoiceInputButton
          language={selfLang}
          onTranscript={(spokenText) => {
            setInputText(spokenText);
          }}
          onSendDirectly={(spokenText) => {
            handleSendMessage(spokenText);
          }}
        />

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Type or speak in ${selfLang} (e.g. "Yaar bahut anxiety ho rahi hai")...`}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 px-2 py-1"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
