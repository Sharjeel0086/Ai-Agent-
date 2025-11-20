// Simple language detection based on common patterns
export function detectLanguage(text: string): string {
  if (!text || text.length < 3) return 'en';

  // Common language patterns
  const patterns: Record<string, RegExp[]> = {
    es: [/[áéíóúñü]/i, /\b(el|la|los|las|de|que|y|a|en|un|una|es|son|con|por|para)\b/gi],
    fr: [/[àâäéèêëïîôùûüÿç]/i, /\b(le|la|les|de|du|des|et|à|un|une|est|sont|avec|pour)\b/gi],
    de: [/[äöüß]/i, /\b(der|die|das|und|von|zu|mit|für|ist|sind|ein|eine)\b/gi],
    it: [/[àèéìîòù]/i, /\b(il|la|lo|gli|le|di|del|della|e|a|in|un|una|è|sono|con|per)\b/gi],
    pt: [/[áâãàéêíóôõúç]/i, /\b(o|a|os|as|de|do|da|dos|das|e|em|um|uma|é|são|com|para)\b/gi],
    ru: [/[а-яё]/i],
    zh: [/[\u4e00-\u9fff]/],
    ja: [/[\u3040-\u309f\u30a0-\u30ff]/],
    ko: [/[\uac00-\ud7a3]/],
    ar: [/[\u0600-\u06ff]/],
  };

  let maxScore = 0;
  let detectedLang = 'en';

  for (const [lang, regexes] of Object.entries(patterns)) {
    let score = 0;
    for (const regex of regexes) {
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  return detectedLang;
}

export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
  };
  return names[code] || code;
}

