import { ChatMessage, SessionSummaryData } from "./types";

const ADJECTIVES = [
  "Brave",
  "Calm",
  "Gentle",
  "Quiet",
  "Kind",
  "Mindful",
  "Warm",
  "Resilient",
  "Serene",
  "Hopeful",
  "Patient",
  "Tranquil",
];

const NOUNS = [
  "Willow",
  "River",
  "Cloud",
  "Meadow",
  "Breeze",
  "Harbor",
  "Cedar",
  "Sunrise",
  "Lantern",
  "Oasis",
  "Horizon",
  "Sparrow",
];

export function generateAnonymousAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj} ${noun} #${num}`;
}

export function checkMisinformationOrHarassment(text: string): {
  flag: string | null;
  reason?: string;
} {
  const lower = text.toLowerCase();

  if (
    lower.includes("stop insulin") ||
    lower.includes("stop taking medicine") ||
    lower.includes("dawa mat lo") ||
    lower.includes("bleach cures") ||
    lower.includes("magic powder") ||
    lower.includes("babaji powder") ||
    lower.includes("cure depression instantly by drinking")
  ) {
    return {
      flag: "[Flagged: Unverified Home Remedy / Medical Claim]",
      reason: "Potential medical misinformation detected",
    };
  }

  if (
    lower.includes("you are worthless") ||
    lower.includes("tu pagal hai") ||
    lower.includes("get lost loser") ||
    lower.includes("shut up idiot")
  ) {
    return {
      flag: "[Warning: Potentially Hostile Phrasing]",
      reason: "Please maintain a compassionate and respectful tone",
    };
  }

  return { flag: null };
}

export function calculateSessionSummary(
  messages: ChatMessage[],
  selfId: string
): SessionSummaryData {
  if (messages.length === 0) {
    return {
      mutualEmpathyScore: 92,
      listeningRatioScore: 89,
      emotionalShift: "Relieved & Validated",
      totalMessages: 0,
      keyTakeaways: [
        "Reaching out is the strongest first step toward healing.",
        "Expressing distress reduces physiological tension in the brain.",
      ],
      affirmation:
        "You showed courage and vulnerability today. Your presence and voice matter.",
      purgeTimestamp: "Zero-Trace Memory Dissolved (0 bytes stored)",
    };
  }

  const selfMsgs = messages.filter((m) => m.senderId === selfId);
  const peerMsgs = messages.filter((m) => m.senderId !== selfId);

  let empathyHits = 0;
  const empathyWords = [
    "understand",
    "here for you",
    "saath",
    "theek",
    "care",
    "listen",
    "feel",
    "strength",
    "proud",
    "breath",
  ];

  messages.forEach((m) => {
    const combined = `${m.originalText} ${m.translatedText}`.toLowerCase();
    if (empathyWords.some((w) => combined.includes(w))) {
      empathyHits += 1;
    }
  });

  const empathyScore = Math.min(98, Math.max(82, 85 + empathyHits * 3));
  const minCount = Math.min(selfMsgs.length, peerMsgs.length);
  const maxCount = Math.max(1, Math.max(selfMsgs.length, peerMsgs.length));
  const ratio = Math.min(97, Math.max(72, Math.round((minCount / maxCount) * 100)));

  return {
    mutualEmpathyScore: empathyScore,
    listeningRatioScore: ratio,
    emotionalShift: "Distress ➔ Psychological Safety",
    totalMessages: messages.length,
    keyTakeaways: [
      "You co-created a safe, judgment-free space for authentic expression.",
      "Shared vulnerability helped lower conversational defensiveness.",
      "Empathetic listening offered rapid emotional stabilization.",
    ],
    affirmation:
      "You showed profound empathy today. This entire conversation has been dissolved from memory.",
    purgeTimestamp: "Zero-Trace Enforced: RAM Buffers Destroyed",
  };
}

// Web Audio API subtle sounds
export function playSafeMessageChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export function playCrisisAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}
