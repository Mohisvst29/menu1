'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { LANGUAGES, UI_LABELS } from '@/lib/i18n';
import type { SiteConfig, Language } from '@/types';

interface HeaderProps {
  site: SiteConfig;
}

export default function Header({ site }: HeaderProps) {
  const { lang, setLang, t } = useLang();
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const waLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp', UI_LABELS)
  )}`;

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  const headerBg = scrolled
    ? site.theme?.headerBackgroundColor || '#0a0a0a'
    : 'transparent';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: headerBg,
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-3 min-w-0">
          {site.logo ? (
            <div
              className="relative rounded-full overflow-hidden flex-shrink-0"
              style={{
                width: `${40 * ((site.logoSize || 100) / 100)}px`,
                height: `${40 * ((site.logoSize || 100) / 100)}px`,
                border: `2px solid ${site.theme?.primaryColor || '#f97316'}`,
              }}
            >
              <Image src={site.logo} alt="logo" fill className="object-cover" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${site.theme?.primaryColor || '#f97316'}, ${site.theme?.secondaryColor || '#fb923c'})` }}
            >
              {site.businessName?.charAt(0) || '✦'}
            </div>
          )}
          <span className="font-bold text-lg truncate text-white drop-shadow-lg">
            {site.businessName?.length > 100 ? site.businessName.substring(0, 50) + '...' : site.businessName}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language Switcher */}
          <div className="relative" ref={dropRef}>
            <button
              id="lang-switcher"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}
            >
              <span>{currentLang?.flag}</span>
              <span className="hidden sm:inline">{currentLang?.label}</span>
              <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div
                className="absolute top-full mt-2 end-0 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[150px]"
                style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all text-start"
                    style={{
                      color: lang === l.code ? '#f97316' : '#e5e7eb',
                      background: lang === l.code ? 'rgba(249,115,22,0.1)' : 'transparent',
                      fontWeight: lang === l.code ? '600' : '400',
                    }}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && (
                      <svg className="w-4 h-4 ms-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offers Link */}
          <a
            href="/offers"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
            }}
          >
            <span className="hidden sm:inline">العروض</span> 🏷️
          </a>

          {/* Cart Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -end-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--background)]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
