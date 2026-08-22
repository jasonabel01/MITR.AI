import { CrisisAlert, HelplineInfo } from "./types";

export const HELPLINES: HelplineInfo[] = [
  {
    name: "Tele-MANAS (Govt. of India)",
    number: "14416",
    description: "Toll-Free 24/7 National Mental Health Helpline (20+ Languages)",
    action: "tel:14416",
    primary: true,
  },
  {
    name: "KIRAN Mental Health Helpline",
    number: "1800-599-0019",
    description: "24/7 National Toll-Free Support for Distress & Crisis",
    action: "tel:18005990019",
    primary: false,
  },
  {
    name: "Vandrevala Foundation",
    number: "+91 9999 666 555",
    description: "24/7 Free Crisis Counseling via Call & WhatsApp",
    action: "tel:+919999666555",
    primary: false,
  },
];

export const CRISIS_KEYWORDS = [
  // English
  "kill myself",
  "suicide",
  "end my life",
  "want to die",
  "hanging myself",
  "cutting myself",
  "overdose",
  "slit my wrist",
  "no reason to live",
  "better off dead",
  "jump off a bridge",
  "jump from building",
  "end it all",
  "wanna die",
  "hang myself",
  "take my life",
  "don't want to live",
  "dont want to live",
  "kill me",
  "self harm",
  "self-harm",
  // Hinglish / Hindi
  "mar jaana chahta hoon",
  "mar jana chahta hu",
  "marne ka mann kar raha",
  "marne ka man kar raha",
  "apni jaan lena",
  "apni jaan le luga",
  "apni jaan le lunga",
  "khudkushi",
  "jaan de dunga",
  "jaan de dungi",
  "zindagi khatam",
  "suicide kar lunga",
  "suicide karungi",
  "jeene ka mann nahi",
  "faansi laga lunga",
  "zeher kha lunga",
  "mar jana hai",
  "mar jau",
];

const REGEX_PATTERNS = [
  /\b(want|wish|going)\s+to\s+(die|end\s+it|kill\s+myself)\b/i,
  /\b(better\s+off|rather\s+be)\s+dead\b/i,
  /\b(take|end)\s+my\s+own\s+life\b/i,
  /\b(no\s+point|no\s+reason)\s+in\s+living\b/i,
  /\b(mar\s+jana|khud\s*kushi|jaan\s+de\s*du)\b/i,
];

export function checkCrisis(text: string): CrisisAlert {
  if (!text || text.trim() === "") {
    return { isCrisis: false, helplines: [] };
  }

  const lower = text.toLowerCase().trim();

  // Keyword check
  for (const phrase of CRISIS_KEYWORDS) {
    if (lower.includes(phrase)) {
      return {
        isCrisis: true,
        detectedPhrase: phrase,
        confidence: 0.99,
        helplines: HELPLINES,
        message: "We care about your safety. You are not alone.",
      };
    }
  }

  // Regex check
  for (const reg of REGEX_PATTERNS) {
    const match = lower.match(reg);
    if (match) {
      return {
        isCrisis: true,
        detectedPhrase: match[0],
        confidence: 0.96,
        helplines: HELPLINES,
        message: "We care about your safety. You are not alone.",
      };
    }
  }

  return { isCrisis: false, helplines: [] };
}
