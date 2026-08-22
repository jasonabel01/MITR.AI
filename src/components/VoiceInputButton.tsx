"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Language } from "@/lib/types";

interface VoiceInputButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  language,
  onTranscript,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
        return "hi-IN"; // Browser speech recognition maps Hinglish well to hi-IN / en-IN
      case "English":
      default:
        return "en-IN";
    }
  };

  const toggleRecording = () => {
    if (disabled) return;

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Voice input is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLangCode(language);

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        title={isRecording ? "Listening... (Click to stop)" : "Speak via Voice Input"}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isRecording
            ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse ring-2 ring-red-400/40"
            : "bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-400 hover:text-emerald-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRecording ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
      </button>

      {isRecording && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
          Listening...
        </span>
      )}
    </div>
  );
};
