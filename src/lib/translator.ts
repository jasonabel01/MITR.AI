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

// ── 1. Comprehensive Hindi / Hinglish ➡️ Pure English Sentence Patterns ──
const HINDI_TO_ENGLISH_PHRASES: Array<[RegExp, string]> = [
  // Crisis & Acute Distress
  [/मैं\s*मरना\s*चाहता\s*(हूँ|हूं|हो)/gi, "I want to end my life and die"],
  [/मरना\s*चाहता\s*(हूँ|हूं|हो)/gi, "I want to die"],
  [/मैं\s*(मेरा|मेरी|अपनी)\s*(लाइफ|जिंदगी|जान)\s*देना\s*चाहता\s*(हूँ|हूं|हो)/gi, "I want to give up my life"],
  [/अपनी\s*(जान|जिंदगी)\s*(लेना|देना)/gi, "take my own life"],
  [/जीने\s*का\s*मन\s*नहीं\s*है/gi, "I don't have the will to live anymore"],
  [/सब\s*खत्म\s*करना\s*चाहता\s*हूँ/gi, "I want to end everything"],
  [/आत्महत्या\s*करना\s*चाहता\s*हूँ/gi, "I want to commit suicide"],
  [/marna chahta (hu|hoon|ho)/gi, "I want to end my life and die"],
  [/main (mera|meri|apni) (life|zindagi|jaan) dena chahta (hu|hoon|ho)/gi, "I want to give up my life"],
  [/apni jaan (lena|dena)/gi, "take my own life"],
  [/jeene ka mann nahi/gi, "I don't have the will to live anymore"],
  [/sab khatam karna chahta hu/gi, "I want to end everything"],

  // Anxiety, Panic & Overwhelm
  [/मुझे\s*बहुत\s*(ज्यादा\s*)?घबराहट\s*हो\s*रही\s*है/gi, "I am experiencing severe anxiety and panic"],
  [/मुझे\s*बहुत\s*(ज्यादा\s*)?तनाव\s*हो\s*रहा\s*है/gi, "I am feeling extremely stressed out"],
  [/मेरा\s*दिमाग\s*फट\s*रहा\s*है/gi, "My head is throbbing from overwhelming stress"],
  [/सांस\s*लेने\s*में\s*दिक्कत\s*हो\s*रही\s*है/gi, "I am having trouble breathing calmly"],
  [/दिल\s*की\s*धड़कन\s*बहुत\s*तेज\s*है/gi, "My heart is racing very fast from anxiety"],
  [/बहुत\s*डर\s*लग\s*रहा\s*है/gi, "I am feeling very terrified and scared"],
  [/panic attack jaisa lag raha hai/gi, "It feels like I am having a panic attack"],
  [/yaar (bahut|bohot) (zyada\s*)?anxiety ho rahi hai/gi, "Friend, I am having severe anxiety right now"],
  [/mera dimag fat raha hai/gi, "My head is throbbing from overwhelming stress"],
  [/kuch samajh nahi aa raha/gi, "I can't seem to figure anything out"],
  [/kya karu kuch samajh nahi aa raha/gi, "I don't know what to do at all, feeling lost"],
  [/heart beat bohot fast ho rahi hai/gi, "My heart is racing very fast from anxiety"],
  [/saans lene me dikkat ho rahi hai/gi, "I am having trouble breathing calmly"],

  // Loneliness & Isolation
  [/मुझे\s*बहुत\s*(ज्यादा\s*)?अकेलापन\s*महसूस\s*हो\s*रहा\s*है/gi, "I am feeling deeply lonely and isolated"],
  [/मैं\s*बहुत\s*अकेला\s*हूँ/gi, "I feel completely alone right now"],
  [/कोई\s*मेरी\s*बात\s*नहीं\s*समझता/gi, "No one seems to understand what I am going through"],
  [/कोई\s*मुझसे\s*प्यार\s*नहीं\s*करता/gi, "Nobody seems to care about me"],
  [/kisi ko meri parwah nahi/gi, "Nobody seems to care about me"],
  [/main bohot akela feel kar raha hu/gi, "I am feeling deeply lonely and isolated"],
  [/mujhe bohot akelapan lag raha hai/gi, "I feel completely alone right now"],
  [/koi meri baat nahi samajhta/gi, "Nobody seems to understand what I am going through"],

  // Academic & Work Stress
  [/पढ़ाई\s*का\s*बहुत\s*(ज्यादा\s*)?तनाव\s*है/gi, "There is immense pressure and stress from studies"],
  [/परीक्षा\s*का\s*डर\s*सता\s*रहा\s*है/gi, "I am terrified about upcoming exams"],
  [/exam(s)? ka (bahut|bohot) stress hai/gi, "There is immense stress from exams"],
  [/exams ka pressure handle nahi ho raha/gi, "I can't handle the exam pressure anymore"],
  [/ghar wale samajhte nahi/gi, "My family doesn't understand my situation"],

  // Conversational & Empathy Greetings
  [/नमस्ते\s*दोस्त\s*क्या\s*हाल\s*है/gi, "Hello friend, how are you doing?"],
  [/नमस्ते\s*दोस्त/gi, "Hello friend"],
  [/क्या\s*आप\s*मेरी\s*मदद\s*कर\s*सकते\s*हैं\??/gi, "Could you please help me?"],
  [/क्या\s*आप\s*सुन\s*रहे\s*हैं\??/gi, "Are you listening to me?"],
  [/मैं\s*आपके\s*साथ\s*हूँ/gi, "I am right here with you"],
  [/चिंता\s*मत\s*करो/gi, "Please don't worry, everything will be fine"],
  [/सब\s*ठीक\s*हो\s*जाएगा/gi, "Everything will turn out okay"],
  [/आप\s*अकेले\s*नहीं\s*हैं/gi, "You are not alone in this journey"],
  [/शुक्रिया\s*मेरी\s*बात\s*सुनने\s*के\s*लिए/gi, "Thank you so much for listening to me"],
  [/shukriya sunne ke liye/gi, "Thank you so much for listening to me"],
  [/main tumhare sath hu/gi, "I am right here with you"],
  [/tension mat lo dost/gi, "Please don't stress yourself, my friend"],
  [/tum akele nahi ho/gi, "You are not alone in this"],
  [/sab theek ho jayega/gi, "Everything will turn out okay"],
  [/kaise ho dost/gi, "How are you doing, friend?"],
  [/dimag me kya chal raha hai/gi, "What is going on in your mind?"],
];

// ── 2. English ➡️ Hindi / Hinglish Sentence Patterns ──
const ENGLISH_TO_HINDI_PHRASES: Array<[RegExp, string]> = [
  [/Hello friend\.?\s*I'?m here to listen\.?\s*What'?s (been )?on your mind\??/gi, "Namaste dost. Main yaha aapki baat sunne ke liye hu. Dimag me kya chal raha hai?"],
  [/Hello friend/gi, "Namaste dost"],
  [/I feel so alone/gi, "Mujhe bohot akelapan mehsus ho raha hai"],
  [/I am feeling really anxious/gi, "Mujhe bohot zyada anxiety aur ghabrahat ho rahi hai"],
  [/I am having anxiety/gi, "Mujhe anxiety ho rahi hai"],
  [/I am here for you/gi, "Main tumhare sath hu dost"],
  [/I want to die/gi, "Main marna chahta hu"],
  [/I want to give up my life/gi, "Main apni life dena chahta hu"],
  [/Don'?t worry, everything will be okay/gi, "Tension mat lo dost, sab theek ho jayega"],
  [/Don'?t worry/gi, "Chinta mat karo, sab theek hoga"],
  [/Take a slow deep breath/gi, "Ek gehri saans lo aur relax karo"],
  [/Take a deep breath/gi, "Ek gehri saans lo"],
  [/Thank you for listening/gi, "Meri baat sunne ke liye bohot shukriya"],
  [/You are not alone/gi, "Tum akele bilkul nahi ho"],
  [/How are you feeling right now\??/gi, "Abhi aap kaisa mehsus kar rahe ho?"],
  [/Can someone please talk to me\??/gi, "Kya koi mujhse baat kar sakta hai?"],
  [/I am overwhelmed/gi, "Main bohot pareshan aur thak chuka hu"],
];

// ── 3. Comprehensive Dictionary for Word-by-Word SVO Reconstruction ──
const INDIC_LEXICON: Record<string, string> = {
  // Pronouns
  मैं: "I", main: "I", mujhe: "me", mera: "my", meri: "my", mere: "my",
  हम: "we", hum: "we", hume: "us", hamara: "our",
  तुम: "you", tum: "you", tumhe: "you", tumhara: "your",
  आप: "you", aap: "you", aapko: "you", aapka: "your",
  वह: "he/she", vo: "they", usko: "them", unka: "their",

  // Nouns & Entities
  दोस्त: "friend", dost: "friend", yaar: "friend", bhai: "brother",
  लाइफ: "life", life: "life", जिंदगी: "life", zindagi: "life", jaan: "life", जान: "life",
  दिमाग: "mind", dimag: "mind", man: "mind", mann: "mind", मन: "mind",
  बात: "words", baat: "words", baatein: "thoughts",
  मदद: "help", madad: "help", help: "help",
  तनाव: "stress", stress: "stress", pressure: "pressure",
  घबराहट: "anxiety", anxiety: "anxiety", panic: "panic",
  अकेलापन: "loneliness", akelapan: "loneliness", loneliness: "loneliness",
  डर: "fear", darr: "fear", fear: "fear",
  परीक्षा: "exam", exam: "exam", exams: "exams", padhai: "studies", पढ़ाई: "studies",
  घर: "home", ghar: "family", family: "family",

  // Verbs & Actions
  मरना: "to die", marna: "die", die: "die",
  देना: "give", dena: "give", give: "give",
  लेना: "take", lena: "take", take: "take",
  चाहता: "want", chahta: "want", chahti: "want", want: "want",
  सुनना: "listen", sunna: "listen", suno: "listen",
  समझना: "understand", samajhna: "understand", samajh: "understand",
  रोना: "cry", rona: "crying",
  रहना: "stay", rehna: "stay",
  होना: "happen", hona: "happen",

  // Modifiers & Adjectives
  बहुत: "very", bahut: "very", bohot: "really", zyada: "much",
  अकेला: "alone", akela: "alone", alone: "alone",
  परेशान: "troubled", pareshan: "troubled",
  ठीक: "alright", theek: "okay", accha: "good",
  नहीं: "not", nahi: "not", na: "not", mat: "do not",
  आज: "today", aaj: "today", raat: "night", kal: "tomorrow",

  // Auxiliaries
  हूँ: "", hu: "", hoon: "",
  है: "is", hai: "is", hain: "are", हैं: "",
  हो: "", ho: "",
  था: "was", tha: "was", thi: "was",
  रहा: "", raha: "", rahi: "", rahe: "",
  सकते: "can", sakte: "can", sakta: "can",
};

export function translateColloquial(
  text: string,
  sourceLang: Language,
  targetLang: Language
): TranslationResult {
  const start = performance.now();
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Emotion & Valence Detection
  let detectedEmotion = "Reflective / Neutral";
  let valence: "Positive-Healing" | "Negative-Distress" | "Neutral" = "Neutral";

  if (
    lower.includes("anxiety") ||
    lower.includes("panic") ||
    lower.includes("scared") ||
    lower.includes("dar") ||
    lower.includes("pressure") ||
    lower.includes("fat raha") ||
    trimmed.includes("तनाव") ||
    trimmed.includes("घबराहट") ||
    trimmed.includes("डर")
  ) {
    detectedEmotion = "Overwhelmed / Anxious";
    valence = "Negative-Distress";
  } else if (
    lower.includes("alone") ||
    lower.includes("akelapan") ||
    lower.includes("lonely") ||
    lower.includes("isolated") ||
    trimmed.includes("अकेला") ||
    trimmed.includes("अकेलापन")
  ) {
    detectedEmotion = "Lonely / Isolated";
    valence = "Negative-Distress";
  } else if (
    lower.includes("marna") ||
    lower.includes("suicide") ||
    lower.includes("die") ||
    trimmed.includes("मरना") ||
    trimmed.includes("जान देना") ||
    trimmed.includes("आत्महत्या")
  ) {
    detectedEmotion = "Acute Crisis / Critical";
    valence = "Negative-Distress";
  } else if (
    lower.includes("rona") ||
    lower.includes("cry") ||
    lower.includes("sad") ||
    lower.includes("dard") ||
    lower.includes("dukhi") ||
    trimmed.includes("उदास") ||
    trimmed.includes("दर्द")
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
    lower.includes("calm") ||
    trimmed.includes("साथ") ||
    trimmed.includes("ठीक")
  ) {
    detectedEmotion = "Supportive / Empathetic";
    valence = "Positive-Healing";
  }

  let translated = trimmed;

  // ── Scenario A: Translating to Pure English ──
  if (targetLang === "English") {
    // Step 1: Match high-confidence sentence idioms
    let matched = false;
    for (const [regex, rep] of HINDI_TO_ENGLISH_PHRASES) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
        matched = true;
      }
    }

    // Step 2: If still unchanged or contains untranslated Indic words, apply Lexicon Translation & Grammar Cleanup
    if (!matched || /[^\x00-\x7F]/.test(translated) || /(main|mera|meri|chahta|hai|hu|dena|kuch|nahi|yaar|dost)/i.test(translated)) {
      const words = translated.split(/\s+/);
      const translatedWords = words.map((rawWord) => {
        const punctuation = rawWord.match(/[.,!?।]/g)?.join("") || "";
        const clean = rawWord.replace(/[.,!?।]/g, "").toLowerCase();
        const devanagariClean = rawWord.replace(/[.,!?।]/g, "");

        if (INDIC_LEXICON[devanagariClean]) {
          return INDIC_LEXICON[devanagariClean] + punctuation;
        }
        if (INDIC_LEXICON[clean]) {
          return INDIC_LEXICON[clean] + punctuation;
        }
        return rawWord;
      });

      const assembled = translatedWords.filter((w) => w.trim() !== "").join(" ").trim();
      if (assembled && assembled !== trimmed) {
        translated = assembled;
      }
    }

    // Clean up trailing double spaces or grammar artifacts
    translated = translated
      .replace(/\s+/g, " ")
      .replace(/\bi want to give my life\b/gi, "I want to give up my life")
      .replace(/\bi want to die my life\b/gi, "I want to end my life")
      .replace(/\bi want die\b/gi, "I want to die")
      .trim();

    // Capitalize first letter
    if (translated.length > 0) {
      translated = translated.charAt(0).toUpperCase() + translated.slice(1);
    }
  }

  // ── Scenario B: Translating from English to Hindi / Hinglish ──
  else if (sourceLang === "English" && (targetLang === "Hinglish" || targetLang === "Hindi")) {
    for (const [regex, rep] of ENGLISH_TO_HINDI_PHRASES) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }
  }

  const latencyMs = Math.max(1, Math.round(performance.now() - start));

  return {
    translatedText: translated,
    originalText: trimmed,
    sourceLang,
    targetLang,
    detectedEmotion,
    valence,
    latencyMs,
  };
}
