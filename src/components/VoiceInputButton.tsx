"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Radio } from "lucide-react";
import { Language } from "@/lib/types";

interface VoiceInputButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const SAMPLE_VOICE_PHRASES: Record<Language, string[]> = {
  Hinglish: [
    "Yaar bohot zyada anxiety ho rahi hai",
    "Exam ka stress handle nahi ho raha",
    "Main bohot akela feel kar raha hu",
    "Mujhe lagta hai koi meri baat nahi samajhta",
  ],
  Hindi: [
    "मुझे बहुत अकेलापन महसूस हो रहा है",
    "पढ़ाई का बहुत ज्यादा तनाव है",
    "क्या आप मेरी बात सुन सकते हैं?",
    "मन बहुत परेशान है आज",
  ],
  Tamil: [
    "எனக்கு மிகவும் மன அழுத்தம் இருக்கிறது",
    "யாராவது என்னுடன் பேச முடியுமா?",
    "தேர்வு பயம் அதிகமாக உள்ளது",
    "நான் மிகவும் தனிமையாக உணர்கிறேன்",
  ],
  Telugu: [
    "నాకు చాలా ఒత్తిడిగా ఉంది",
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
      setErrorMsg("Browser Speech API not supported. Use quick voice samples below.");
      setShowSimMenu(true);
      return;
    }

    try {
      // Request mic permission first to ensure browser doesn't block silently
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

      let finalResultReceived = false;

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
            finalResultReceived = true;
            onTranscript(trans.trim());
            setInterimText("");
          } else {
            currentInterim += trans;
          }
        }
        if (currentInterim) {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setErrorMsg("Mic permission denied. Use quick voice samples below.");
          setShowSimMenu(true);
        } else if (event.error === "no-speech") {
          // Keep listening or gently stop
        } else if (event.error === "network") {
          setErrorMsg("Speech recognition network offline. Use quick voice samples.");
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

  const handleSelectSample = (sample: string) => {
    onTranscript(sample);
    setShowSimMenu(false);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Mic Trigger Button */}
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        title={isRecording ? "Listening... (Click to stop)" : `Speak in ${language} or click for voice options`}
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
        title="Quick Vernacular Voice Samples"
        className="ml-1 p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-all text-[10px] font-mono flex items-center gap-0.5 cursor-pointer"
      >
        <Sparkles className="w-3 h-3 text-amber-300" />
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
              {interimText || "Speak now..."}
            </div>
          </div>
        </div>
      )}

      {/* Quick Vernacular Speech Menu Modal */}
      {showSimMenu && (
        <div className="absolute bottom-12 left-0 z-50 w-72 p-3 rounded-2xl bg-slate-950/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl text-left space-y-2 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spoken {language} Samples</span>
            </span>
            <button
              onClick={() => setShowSimMenu(false)}
              className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          {errorMsg && (
            <div className="text-[10px] text-amber-300 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {(SAMPLE_VOICE_PHRASES[language] || SAMPLE_VOICE_PHRASES.English).map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(phrase)}
                className="w-full text-left p-2 rounded-xl bg-slate-900/90 hover:bg-emerald-950/50 hover:border-emerald-500/40 border border-white/5 text-[11px] text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="truncate pr-2">"{phrase}"</span>
                <span className="text-[9px] text-emerald-400 font-mono opacity-0 group-hover:opacity-100">
                  Insert
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
