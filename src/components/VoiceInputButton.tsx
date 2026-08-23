"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Radio, Send, Play } from "lucide-react";
import { Language } from "@/lib/types";

interface VoiceInputButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  onSendDirectly?: (text: string) => void;
  disabled?: boolean;
}

const SAMPLE_VOICE_PHRASES: Record<Language, string[]> = {
  Hinglish: [
    "Yaar bohot zyada anxiety ho rahi hai, kuch samajh nahi aa raha",
    "Exam ka stress handle nahi ho raha, bohot panic ho raha hai",
    "Main bohot akela feel kar raha hu aaj",
    "Mujhe lagta hai koi meri baat nahi samajhta",
    "I feel like ending my life, no reason to live", // Crisis Breaker Test
  ],
  Hindi: [
    "मुझे बहुत अकेलापन महसूस हो रहा है, कृपया मदद करें",
    "पढ़ाई का बहुत ज्यादा तनाव है और बहुत घबराहट हो रही है",
    "क्या आप मेरी बात सुन सकते हैं?",
    "मन बहुत परेशान और उदास है आज",
  ],
  Tamil: [
    "எனக்கு மிகவும் மன அழுத்தம் இருக்கிறது, என்னால் தாங்க முடியவில்லை",
    "யாராவது என்னுடன் பேச முடியுமா?",
    "தேர்வு பயம் அதிகமாக உள்ளது",
    "நான் மிகவும் தனிமையாக உணர்கிறேன்",
  ],
  Telugu: [
    "నాకు చాలా ఒత్తిడిగా ఉంది, భయం వేస్తుంది",
    "ఎవరైనా నాతో మాట్లాడగలరా?",
    "పరీక్షల భయం ఎక్కువగా ఉంది",
    "నేను చాలా ఒంటరిగా భావిస్తున్నాను",
  ],
  English: [
    "I am feeling really overwhelmed and anxious today",
    "Everything is piling up and I just need someone to talk to",
    "I have been feeling disconnected and lonely lately",
    "Work burnout is really getting to me",
  ],
};

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  language,
  onTranscript,
  onSendDirectly,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<any>(null);

  const getLangCode = (lang: Language): string => {
    switch (lang) {
      case "Hindi":
        return "hi-IN";
      case "Tamil":
        return "ta-IN";
      case "Telugu":
        return "te-IN";
      case "Hinglish":
        return "hi-IN";
      case "English":
      default:
        return "en-IN";
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const startBrowserRecognition = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Browser Speech API not available. Use quick voice triggers below.");
      setShowSimMenu(true);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn("Mic permission prompt:", permErr);
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLangCode(language);
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMsg(null);
        setInterimText("");
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            onTranscript(trans.trim());
            setInterimText("");
          } else {
            currentInterim += trans;
          }
        }
        if (currentInterim) {
          setInterimText(currentInterim);
          onTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setErrorMsg("Microphone permission denied. Use one-tap spoken samples below.");
          setShowSimMenu(true);
        } else if (event.error === "network") {
          setErrorMsg("Speech recognition offline. Use one-tap spoken samples below.");
          setShowSimMenu(true);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn("Speech Recognition exception:", e);
      setIsRecording(false);
      setShowSimMenu(true);
    }
  };

  const toggleRecording = () => {
    if (disabled) return;

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
      setInterimText("");
      return;
    }

    startBrowserRecognition();
  };

  const handleSendDirectly = (sample: string) => {
    if (onSendDirectly) {
      onSendDirectly(sample);
    } else {
      onTranscript(sample);
    }
    setShowSimMenu(false);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Mic Trigger Button */}
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        title={isRecording ? "Listening... (Click to stop)" : `Speak in ${language} or click for voice triggers`}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center relative ${
          isRecording
            ? "bg-red-500/25 border-red-500 text-red-400 animate-pulse ring-2 ring-red-400/50 shadow-lg shadow-red-500/20"
            : "bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-300 hover:text-white"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {isRecording ? <Mic className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}

        {/* Live Audio Waves Indicator */}
        {isRecording && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Quick Voice Simulation / Fallback Sample Menu Toggle */}
      <button
        type="button"
        onClick={() => setShowSimMenu(!showSimMenu)}
        title="Spoken Voice Triggers & Samples"
        className="ml-1 p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-all text-[10px] font-mono flex items-center gap-0.5 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      </button>

      {/* Listening Floating Toast */}
      {isRecording && (
        <div className="absolute bottom-12 left-0 z-50 px-3.5 py-2 rounded-2xl bg-slate-950/95 border border-red-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 min-w-[220px] animate-in fade-in zoom-in-95">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span>Listening in {language}...</span>
            </div>
            <div className="text-[10px] text-slate-400 italic truncate max-w-[180px]">
              {interimText || "Speak now into mic..."}
            </div>
          </div>
        </div>
      )}

      {/* Quick Vernacular Speech Menu Modal */}
      {showSimMenu && (
        <div className="absolute bottom-12 left-0 z-50 w-80 p-3.5 rounded-2xl bg-[#0c131d]/98 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-left space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Voice Speech Triggers ({language})</span>
            </span>
            <button
              onClick={() => setShowSimMenu(false)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          {errorMsg && (
            <div className="text-[10px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(SAMPLE_VOICE_PHRASES[language] || SAMPLE_VOICE_PHRASES.English).map((phrase, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-2 group"
              >
                <span className="text-xs text-slate-200 truncate flex-1">
                  "{phrase}"
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onTranscript(phrase);
                      setShowSimMenu(false);
                    }}
                    title="Insert text into input box"
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white font-medium"
                  >
                    Insert
                  </button>
                  <button
                    onClick={() => handleSendDirectly(phrase)}
                    title="Send directly to peer with translation & safety check"
                    className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-[10px] text-slate-950 font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
