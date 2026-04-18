'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { UI_LABELS } from '@/lib/i18n';
import type { SiteConfig } from '@/types';

interface CoverSectionProps {
  site: SiteConfig;
}

export default function CoverSection({ site }: CoverSectionProps) {
  const { translateText, t } = useLang();
  const [name, setName] = useState(site.businessName);
  const [desc, setDesc] = useState(site.description);

  useEffect(() => {
    translateText(site.businessName).then(setName);
    translateText(site.description).then(setDesc);
  }, [site.businessName, site.description, translateText]);

  // Extract all valid media
  const media: { type: 'video' | 'image'; url: string }[] = [];
  if (site.coverVideo) media.push({ type: 'video', url: site.coverVideo });
  const images = site.coverImages 
    ? site.coverImages.filter(Boolean) 
    : (site.coverImage ? [site.coverImage] : []);
  images.forEach(img => {
    media.push({ type: 'image', url: img });
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (media.length <= 1) return;
    const current = media[activeIndex];
    let timer: NodeJS.Timeout;

    // For images, we use a 5 second timer. For video, we rely on the onEnded event.
    if (current && current.type === 'image') {
      timer = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % media.length);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [activeIndex, media]);

  const handleVideoEnded = () => {
    if (media.length > 1) {
      setActiveIndex((prev) => (prev + 1) % media.length);
    }
  };

  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {media.length > 0 ? (
        <div className="absolute inset-0">
          {media.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={index} 
                className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={`cover-${index}`}
                    fill
                    className={`object-cover transition-transform duration-[20s] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}
                    priority={index === 0}
                  />
                ) : (
                  <video 
                    src={item.url} 
                    autoPlay={isActive} 
                    muted 
                    playsInline 
                    onEnded={isActive ? handleVideoEnded : undefined}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
          {/* Refined gradient overlay for better text readability and premium feel */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-[var(--background)] pointer-events-none" />
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
          {t('digitalMenu', UI_LABELS)}
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
          <span>{t('discoverMenu', UI_LABELS)}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
