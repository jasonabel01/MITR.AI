import { Language } from "./types";

interface TranslationResult {
  translatedText: string;
  originalText: string;
  sourceLang: Language;
  targetLang: Language;
  detectedEmotion: string;
  valence: "Positive-Healing" | "Negative-Distress" | "Neutral";
  latencyMs: number;
}

const HINGLISH_PATTERNS: Array<[RegExp, string]> = [
  [/yaar bahut anxiety ho rahi hai/gi, "Bro, I am experiencing severe anxiety right now"],
  [/kuch samajh nahi aa raha/gi, "I really can't figure anything out"],
  [/mera dimag fat raha hai/gi, "My head feels like it's exploding from stress"],
  [/bohot akelapan lag raha hai/gi, "I am feeling extremely isolated and lonely"],
  [/bahut akelapan lag raha hai/gi, "I am feeling deeply lonely"],
  [/exams ka bahut pressure hai/gi, "There is overwhelming pressure from exams"],
  [/ghar wale samajhte nahi/gi, "My family doesn't understand what I am going through"],
  [/kya karu kuch pata nahi/gi, "I don't know what to do at all"],
  [/sab theek ho jayega dost/gi, "Everything will be okay, my friend"],
  [/main tumhare sath hu/gi, "I am right here with you"],
  [/tension mat lo/gi, "Please don't stress yourself"],
  [/tum akele nahi ho/gi, "You are not alone in this"],
  [/raat ko neend nahi aati/gi, "I can't fall asleep at night due to stress"],
  [/heart beat bohot fast ho rahi hai/gi, "My heart is racing very fast"],
  [/panic attack jaisa lag raha hai/gi, "It feels like a panic attack is coming on"],
  [/himmat rakho/gi, "Stay strong, hold on"],
  [/bohot rona aa raha hai/gi, "I feel like crying so much right now"],
  [/saans lene me dikkat ho rahi hai/gi, "I am having trouble breathing calmly"],
  [/shukriya sunne ke liye/gi, "Thank you so much for listening to me"],
  [/kaunsa college hai tumhara/gi, "Which college are you attending?"],
  [/main bhi same phase se guzar raha hu/gi, "I am also going through the exact same phase"],
  [/mujhe bohot darr lag raha hai/gi, "I am feeling so scared"],
  [/kisi ko meri parwah nahi/gi, "No one seems to care about me"],
  [/tumhe kaisa lag raha hai/gi, "How are you feeling right now?"],
  [/sab accha hoga/gi, "Everything will turn out well"],
];

const ENGLISH_TO_HINGLISH: Array<[RegExp, string]> = [
  [/I feel so alone/gi, "Mujhe bohot akela lag raha hai"],
  [/I am having anxiety/gi, "Mujhe anxiety ho rahi hai"],
  [/I am here for you/gi, "Main tumhare sath hu"],
  [/Don't worry/gi, "Tension mat lo, sab theek hoga"],
  [/Take a deep breath/gi, "Ek gehri saans lo"],
  [/Thank you for listening/gi, "Shukriya sunne ke liye dost"],
];

export function translateColloquial(
  text: string,
  sourceLang: Language,
  targetLang: Language
): TranslationResult {
  const start = performance.now();
  const lower = text.toLowerCase();

  // Emotion Detection
  let detectedEmotion = "Reflective / Neutral";
  let valence: "Positive-Healing" | "Negative-Distress" | "Neutral" = "Neutral";

  if (
    lower.includes("anxiety") ||
    lower.includes("panic") ||
    lower.includes("scared") ||
    lower.includes("dar") ||
    lower.includes("pressure") ||
    lower.includes("fat raha")
  ) {
    detectedEmotion = "Overwhelmed / Anxious";
    valence = "Negative-Distress";
  } else if (
    lower.includes("alone") ||
    lower.includes("akelapan") ||
    lower.includes("lonely") ||
    lower.includes("isolated")
  ) {
    detectedEmotion = "Lonely / Isolated";
    valence = "Negative-Distress";
  } else if (
    lower.includes("rona") ||
    lower.includes("cry") ||
    lower.includes("sad") ||
    lower.includes("dard") ||
    lower.includes("dukhi")
  ) {
    detectedEmotion = "Sadness / Vulnerable";
    valence = "Negative-Distress";
  } else if (
    lower.includes("theek") ||
    lower.includes("here for you") ||
    lower.includes("saath") ||
    lower.includes("care") ||
    lower.includes("proud") ||
    lower.includes("shukriya") ||
    lower.includes("calm")
  ) {
    detectedEmotion = "Supportive / Empathetic";
    valence = "Positive-Healing";
  }

  let translated = text;

  if (sourceLang === "Hinglish" || sourceLang === "Hindi") {
    if (targetLang === "English") {
      for (const [regex, rep] of HINGLISH_PATTERNS) {
        if (regex.test(translated)) {
          translated = translated.replace(regex, rep);
        }
      }
      if (translated === text) {
        // Word level heuristic mapping
        const wordMap: Record<string, string> = {
          yaar: "friend",
          bhai: "bro",
          dost: "friend",
          bahut: "very",
          bohot: "really",
          tension: "stress",
          mat: "don't",
          lo: "take",
          shukriya: "thank you",
          theek: "alright",
          neend: "sleep",
          himmat: "strength",
          rakho: "keep",
          kuch: "anything",
          samajh: "understand",
          nahi: "not",
        };
        const words = text.split(/\s+/);
        const replaced = words.map((w) => {
          const clean = w.toLowerCase().replace(/[^a-z]/g, "");
          return wordMap[clean] ? wordMap[clean] : w;
        });
        if (replaced.join(" ") !== text) {
          translated = replaced.join(" ");
        }
      }
    }
  } else if (sourceLang === "English" && (targetLang === "Hinglish" || targetLang === "Hindi")) {
    for (const [regex, rep] of ENGLISH_TO_HINGLISH) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }
  }

  const latencyMs = Math.max(1, Math.round(performance.now() - start));

  return {
    translatedText: translated,
    originalText: text,
    sourceLang,
    targetLang,
    detectedEmotion,
    valence,
    latencyMs,
  };
}
