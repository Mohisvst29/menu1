'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Language } from '@/types';
import { getLangDir, LANGUAGES } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string, labels: Record<string, Record<string, string>>) => string;
  translateText: (text: string) => Promise<string>;
  translateBatch: (texts: Record<string, string>, fields: string[]) => Promise<Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  dir: 'rtl',
  t: (key, labels) => labels['ar'][key] || key,
  translateText: async (t) => t,
  translateBatch: async (o) => o,
});

const translationCache: Record<string, Record<string, string>> = {};

async function fetchTranslation(text: string, lang: Language): Promise<string> {
  if (!text || lang === 'ar') return text;
  const cacheKey = `${lang}::${text}`;
  if (translationCache[cacheKey]?.[lang]) return translationCache[cacheKey][lang];

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: lang }),
    });
    const data = await res.json();
    if (data.translated) {
      if (!translationCache[cacheKey]) translationCache[cacheKey] = {};
      translationCache[cacheKey][lang] = data.translated;
      return data.translated;
    }
  } catch {}
  return text;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    const stored = localStorage.getItem('catalog_lang') as Language | null;
    if (stored && LANGUAGES.find((l) => l.code === stored)) {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('catalog_lang', newLang);
    document.documentElement.dir = getLangDir(newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.dir = getLangDir(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const dir = getLangDir(lang);

  const t = useCallback(
    (key: string, labels: Record<string, Record<string, string>>) => {
      return labels[lang]?.[key] || labels['ar']?.[key] || key;
    },
    [lang]
  );

  const translateText = useCallback(
    async (text: string) => {
      return fetchTranslation(text, lang);
    },
    [lang]
  );

  const translateBatch = useCallback(
    async (obj: Record<string, string>, fields: string[]) => {
      if (lang === 'ar') return obj;
      const result = { ...obj };
      await Promise.all(
        fields.map(async (field) => {
          if (obj[field]) {
            result[field] = await fetchTranslation(obj[field], lang);
          }
        })
      );
      return result;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t, translateText, translateBatch }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
