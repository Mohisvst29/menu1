'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import type { SiteConfig } from '@/types';

interface CoverSectionProps {
  site: SiteConfig;
}

export default function CoverSection({ site }: CoverSectionProps) {
  const { translateText } = useLang();
  const [name, setName] = useState(site.businessName);
  const [desc, setDesc] = useState(site.description);

  useEffect(() => {
    translateText(site.businessName).then(setName);
    translateText(site.description).then(setDesc);
  }, [site.businessName, site.description, translateText]);

  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {site.coverImage ? (
        <div className="absolute inset-0">
          <Image
            src={site.coverImage}
            alt="cover"
            fill
            className="object-cover transition-transform duration-[20s] ease-linear scale-105 hover:scale-110"
            priority
          />
          {/* Refined gradient overlay for better text readability and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[var(--background)]" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 40%, #0f1a0f 100%)`,
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-1/4 start-1/4 w-64 h-64 rounded-full blur-[100px] opacity-30"
            style={{ background: 'var(--primary)' }} />
          <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'var(--secondary)' }} />
          <div className="absolute inset-0 bg-[var(--background)] opacity-40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center mt-10">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold mb-6 shadow-2xl glass mx-auto"
          style={{
            color: 'var(--primary)',
          }}>
          <span className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" style={{ background: 'var(--primary)' }} />
          القائمة الرقمية
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white tracking-tight drop-shadow-2xl">
          {name && name.length < 100 ? name : site.businessName?.substring(0, 30)}
        </h1>

        {desc && (
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-light">
            {desc}
          </p>
        )}

        {/* Scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-3 text-white/50 text-sm font-medium animate-bounce">
          <span>اكتشف القائمة</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
