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

// ── 1. Hindi Devanagari ➡️ English Sentence & Phrase Mappings ──
const HINDI_DEVANAGARI_MAP: Array<[RegExp | string, string]> = [
  // Crisis & Acute distress
  [/मैं\s*मरना\s*चाहता\s*हूँ/gi, "I want to die"],
  [/मैं\s*मरना\s*चाहता\s*हूं/gi, "I want to die"],
  [/मरना\s*चाहता/gi, "want to die"],
  [/मैं\s*मेरा\s*लाइफ\s*देना\s*चाहता\s*हो/gi, "I want to give up my life"],
  [/मैं\s*मेरा\s*लाइफ\s*देना\s*चाहता\s*हूँ/gi, "I want to give up my life"],
  [/मैं\s*अपनी\s*जान\s*देना\s*चाहता\s*हूँ/gi, "I want to end my life"],
  [/अपनी\s*जान\s*देना/gi, "give up my life"],
  [/आत्महत्या\s*करना\s*चाहता/gi, "want to commit suicide"],
  [/खुदकुशी/gi, "suicide"],

  // Anxiety & Loneliness
  [/मुझे\s*बहुत\s*अकेलापन\s*महसूस\s*हो\s*रहा\s*है/gi, "I am feeling deeply lonely and isolated"],
  [/मुझे\s*बहुत\s*घबराहट\s*हो\s*रही\s*है/gi, "I am experiencing severe anxiety and panic"],
  [/पढ़ाई\s*का\s*बहुत\s*ज्यादा\s*तनाव\s*है/gi, "There is overwhelming stress from studies and exams"],
  [/क्या\s*आप\s*मेरी\s*बात\s*सुन\s*सकते\s*हैं\??/gi, "Can you please listen to what I am going through?"],
  [/मन\s*बहुत\s*परेशान\s*है\s*आज/gi, "My mind is very troubled and restless today"],
  [/बहुत\s*डर\s*लग\s*रहा\s*है/gi, "I am feeling very scared right now"],
  [/सांस\s*लेने\s*में\s*दिक्कत\s*हो\s*रही\s*है/gi, "I am having trouble breathing calmly"],
  [/कोई\s*मेरी\s*बात\s*नहीं\s*समझता/gi, "No one understands what I am going through"],
  [/सब\s*ठीक\s*हो\s*जाएगा\s*दोस्त/gi, "Everything will be okay my friend"],
  [/मैं\s*आपके\s*साथ\s*हूँ/gi, "I am right here with you"],
  [/चिंता\s*मत\s*करो/gi, "Please don't worry"],
  [/नमस्ते\s*दोस्त/gi, "Hello friend"],
  [/आप\s*अकेले\s*नहीं\s*हैं/gi, "You are not alone in this"],
  [/शुक्रिया/gi, "Thank you"],
];

// Devanagari Hindi Word-level mapping
const HINDI_WORD_MAP: Record<string, string> = {
  मैं: "I",
  मुझे: "me",
  मेरा: "my",
  मेरी: "my",
  मेरे: "my",
  लाइफ: "life",
  जिंदगी: "life",
  मरना: "to die",
  चाहता: "want",
  चाहती: "want",
  हूँ: "am",
  हूं: "am",
  हो: "am",
  है: "is",
  हैं: "are",
  देना: "to give",
  दोस्त: "friend",
  अकेला: "alone",
  अकेलापन: "loneliness",
  परेशान: "troubled",
  तनाव: "stress",
  चिंता: "anxiety",
  घबराहट: "panic",
  डर: "fear",
  रोना: "crying",
  मदद: "help",
  बात: "talk",
  सुनना: "listen",
  साथ: "together",
  नहीं: "not",
  बहुत: "very",
  ज्यादा: "a lot",
  आज: "today",
  कल: "tomorrow",
  ठीक: "fine",
};

// ── 2. Hinglish Romanized Patterns ➡️ English ──
const HINGLISH_PATTERNS: Array<[RegExp, string]> = [
  [/marna chahta hu/gi, "I want to die"],
  [/marna chahta hoon/gi, "I want to die"],
  [/mar jana chahta hu/gi, "I want to die"],
  [/life dena chahta hu/gi, "I want to give up my life"],
  [/yaar bahut anxiety ho rahi hai/gi, "Bro, I am experiencing severe anxiety right now"],
  [/yaar bohot zyada anxiety ho rahi hai/gi, "Bro, I am experiencing severe anxiety right now"],
  [/kuch samajh nahi aa raha/gi, "I really can't figure anything out"],
  [/mera dimag fat raha hai/gi, "My head feels like it's exploding from stress"],
  [/bohot akelapan lag raha hai/gi, "I am feeling extremely isolated and lonely"],
  [/bahut akelapan lag raha hai/gi, "I am feeling deeply lonely"],
  [/main bohot akela feel kar raha hu/gi, "I am feeling very lonely today"],
  [/exams ka bahut pressure hai/gi, "There is overwhelming pressure from exams"],
  [/exam ka stress handle nahi ho raha/gi, "I can't handle the exam stress, feeling panicked"],
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
  [/mujhe lagta hai koi meri baat nahi samajhta/gi, "I feel like nobody understands me"],
  [/mujhe bohot darr lag raha hai/gi, "I am feeling so scared"],
  [/kisi ko meri parwah nahi/gi, "No one seems to care about me"],
  [/tumhe kaisa lag raha hai/gi, "How are you feeling right now?"],
  [/sab accha hoga/gi, "Everything will turn out well"],
];

// ── 3. Tamil Patterns ➡️ English ──
const TAMIL_MAP: Array<[RegExp, string]> = [
  [/எனக்கு மிகவும் மன அழுத்தம் இருக்கிறது/gi, "I am experiencing severe mental stress and overwhelm"],
  [/யாராவது என்னுடன் பேச முடியுமா\??/gi, "Can someone please talk with me?"],
  [/தேர்வு பயம் அதிகமாக உள்ளது/gi, "Exam fear and academic stress is overwhelming"],
  [/நான் மிகவும் தனிமையாக உணர்கிறேன்/gi, "I am feeling deeply lonely and isolated"],
  [/சாக வேண்டும்/gi, "I want to die"],
  [/தற்கொலை/gi, "Suicide"],
];

// ── 4. Telugu Patterns ➡️ English ──
const TELUGU_MAP: Array<[RegExp, string]> = [
  [/నాకు చాలా ఒత్తిడిగా ఉంది/gi, "I am experiencing extreme stress and panic"],
  [/ఎవరైనా నాతో మాట్లాడగలరా\??/gi, "Can someone please speak with me?"],
  [/పరీక్షల భయం ఎక్కువగా ఉంది/gi, "Exam anxiety is very high right now"],
  [/నేను చాలా ఒంటరిగా భావిస్తున్నాను/gi, "I am feeling deeply isolated and lonely"],
  [/చనిపోవాలని ఉంది/gi, "I want to die"],
  [/ఆత్మహత్య/gi, "Suicide"],
];

// ── 5. English ➡️ Hinglish/Hindi ──
const ENGLISH_TO_HINGLISH: Array<[RegExp, string]> = [
  [/I feel so alone/gi, "Mujhe bohot akela lag raha hai"],
  [/I am having anxiety/gi, "Mujhe anxiety ho rahi hai"],
  [/I am here for you/gi, "Main tumhare sath hu"],
  [/Don't worry/gi, "Tension mat lo, sab theek hoga"],
  [/Take a deep breath/gi, "Ek gehri saans lo"],
  [/Thank you for listening/gi, "Shukriya sunne ke liye dost"],
  [/Hello friend\.? I'm here to listen/gi, "Namaste dost. Main yaha sunne ke liye hu"],
];

export function translateColloquial(
  text: string,
  sourceLang: Language,
  targetLang: Language
): TranslationResult {
  const start = performance.now();
  const lower = text.toLowerCase().trim();

  // Emotion Detection
  let detectedEmotion = "Reflective / Neutral";
  let valence: "Positive-Healing" | "Negative-Distress" | "Neutral" = "Neutral";

  if (
    lower.includes("anxiety") ||
    lower.includes("panic") ||
    lower.includes("scared") ||
    lower.includes("dar") ||
    lower.includes("pressure") ||
    lower.includes("fat raha") ||
    text.includes("तनाव") ||
    text.includes("घबराहट") ||
    text.includes("डर") ||
    text.includes("ஒத்திடி") ||
    text.includes("பயம்")
  ) {
    detectedEmotion = "Overwhelmed / Anxious";
    valence = "Negative-Distress";
  } else if (
    lower.includes("alone") ||
    lower.includes("akelapan") ||
    lower.includes("lonely") ||
    lower.includes("isolated") ||
    text.includes("अकेला") ||
    text.includes("தனிமை") ||
    text.includes("ఒంటరి")
  ) {
    detectedEmotion = "Lonely / Isolated";
    valence = "Negative-Distress";
  } else if (
    lower.includes("marna") ||
    lower.includes("suicide") ||
    lower.includes("die") ||
    text.includes("मरना") ||
    text.includes("जान देना") ||
    text.includes("आत्महत्या") ||
    text.includes("தற்கொலை") ||
    text.includes("చనిపోవాలని")
  ) {
    detectedEmotion = "Acute Crisis / Critical";
    valence = "Negative-Distress";
  } else if (
    lower.includes("rona") ||
    lower.includes("cry") ||
    lower.includes("sad") ||
    lower.includes("dard") ||
    lower.includes("dukhi") ||
    text.includes("उदास") ||
    text.includes("दर्द")
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
    text.includes("साथ") ||
    text.includes("ठीक")
  ) {
    detectedEmotion = "Supportive / Empathetic";
    valence = "Positive-Healing";
  }

  let translated = text;

  // Translation to English
  if (targetLang === "English") {
    // 1. Devanagari Hindi rules
    for (const [regex, rep] of HINDI_DEVANAGARI_MAP) {
      if (typeof regex === "string") {
        if (translated.includes(regex)) {
          translated = translated.split(regex).join(rep);
        }
      } else if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }

    // 2. Tamil rules
    for (const [regex, rep] of TAMIL_MAP) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }

    // 3. Telugu rules
    for (const [regex, rep] of TELUGU_MAP) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }

    // 4. Hinglish Romanized rules
    for (const [regex, rep] of HINGLISH_PATTERNS) {
      if (regex.test(translated)) {
        translated = translated.replace(regex, rep);
      }
    }

    // 5. Fallback word-level dictionary for untranslated Devanagari words
    if (translated === text) {
      const words = text.split(/\s+/);
      const replaced = words.map((w) => {
        const clean = w.replace(/[।.,?!]/g, "").trim();
        return HINDI_WORD_MAP[clean] ? HINDI_WORD_MAP[clean] : w;
      });
      if (replaced.join(" ") !== text) {
        translated = replaced.join(" ");
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
