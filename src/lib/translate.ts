import type { Language } from '@/types';

const LANG_CODES: Record<Language, string> = {
  ar: 'ar',
  en: 'en',
  ur: 'ur',
  hi: 'hi',
  fr: 'fr',
};

// In-memory cache for this request cycle
const translationCache: Record<string, Record<string, string>> = {};

export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (!text || targetLang === 'ar') return text;

  const cacheKey = `${text}::${targetLang}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey][targetLang] || text;

  try {
    // Try MyMemory API (free, no key required)
    const encoded = encodeURIComponent(text);
    const langPair = `ar|${LANG_CODES[targetLang]}`;
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${langPair}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && translated !== text) {
        if (!translationCache[cacheKey]) translationCache[cacheKey] = {};
        translationCache[cacheKey][targetLang] = translated;
        return translated;
      }
    }
  } catch {
    // silently fail, return original
  }

  return text;
}

export async function translateObject<T extends Record<string, string>>(
  obj: T,
  fields: (keyof T)[],
  targetLang: Language
): Promise<T> {
  if (targetLang === 'ar') return obj;

  const result = { ...obj };
  await Promise.all(
    fields.map(async (field) => {
      const val = obj[field];
      if (val && typeof val === 'string') {
        (result as Record<string, string>)[field as string] = await translateText(val, targetLang);
      }
    })
  );
  return result;
}
