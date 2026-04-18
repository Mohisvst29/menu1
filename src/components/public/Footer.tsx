'use client';

import { useLang } from '@/context/LanguageContext';
import { UI_LABELS } from '@/lib/i18n';
import type { SiteConfig } from '@/types';

interface FooterProps {
  site: SiteConfig;
}

export default function Footer({ site }: FooterProps) {
  const { t } = useLang();

  const waLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp', UI_LABELS)
  )}`;

  const socials = [
    {
      key: 'instagram', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ), url: site.instagram,
    },
    {
      key: 'twitter', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      ), url: site.twitter,
    },
    {
      key: 'facebook', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ), url: site.facebook,
    },
    {
      key: 'snapchat', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M11.95 2.05h.1c2 0 3.79 1.14 4.54 2.94a4.93 4.93 0 0 1 .41 1.96v.04l.11.02c1.07.16 2.03.66 2.76 1.44a5.1 5.1 0 0 1 1.09 2.17c.18.66.1 1.25-.26 1.81-.3.46-.77.78-1.34 1.02a6.95 6.95 0 0 1-2.9.43l-.38-.02.16.32c.3.61.64 1.22 1.02 1.83.69 1.1 1.62 1.95 2.72 2.5a.73.73 0 0 1 .4.66c0 .4-.33.72-.73.72-.25 0-.54-.08-.79-.17-.74-.26-1.5-.66-2.22-1.12a14.78 14.78 0 0 1-2.61-2.26 27.24 27.24 0 0 0-1.74-2.1c-.8-1-1.63-1.66-2.5-2.02l-.24-.09-.23.1c-1.38.56-2.66 1.5-3.82 2.82-1.14 1.3-2 2.8-2.62 4.49A10.66 10.66 0 0 0 2.22 22a.75.75 0 0 1-.72-.75A.75.75 0 0 1 1.9 20.6c.72-1.18 1.6-2.22 2.6-3.1.92-.81 1.92-1.48 2.96-1.92l.14-.06-.11-.1A11.33 11.33 0 0 1 5.06 13a7.35 7.35 0 0 1-3-1.14c-.65-.43-1-1.01-1-1.65 0-.84.5-1.57 1.4-2.07.72-.4 1.57-.64 2.45-.73l.23-.02a5.45 5.45 0 0 1 .91-.1c.36 0 .7.03 1.05.08 0 0 .04-.51.04-.51A4.95 4.95 0 0 1 7.6 4.9C8.35 3.1 10.1 2 11.95 2z"/>
        </svg>
      ), url: site.snapchat,
    },
    {
      key: 'tiktok', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
        </svg>
      ), url: site.tiktok,
    },
    {
      key: 'youtube', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M2.5 7.1C2 8.6 2 12 2 12s0 3.4.5 4.9a2.5 2.5 0 0 0 1.6 1.6C5.6 19 12 19 12 19s6.4 0 7.9-.5a2.5 2.5 0 0 0 1.6-1.6C22 15.4 22 12 22 12s0-3.4-.5-4.9a2.5 2.5 0 0 0-1.6-1.6C18.4 5 12 5 12 5s-6.4 0-7.9.5A2.5 2.5 0 0 0 2.5 7.1z"/>
          <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/>
        </svg>
      ), url: site.youtube,
    },
    {
      key: 'linkedin', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ), url: site.linkedin,
    },
    {
      key: 'telegram', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m22 2-7 20-4-9-9-4Z"/>
          <path d="M22 2 11 13"/>
        </svg>
      ), url: site.telegram,
    },
  ].filter((s) => s.url);

  return (
    <footer style={{ background: 'var(--footer-bg, var(--footer-background-color, #0a0a0a))' }}>
      {/* Top border glow */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, var(--primary), transparent)'
      }} />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-black mb-3" style={{ color: 'var(--foreground)' }}>
              {site.businessName?.length > 100 ? site.businessName.substring(0, 50) + '...' : site.businessName}
            </h3>
            {site.description && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {site.description}
              </p>
            )}

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted)',
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
              {t('contact', UI_LABELS)}
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
              {site.address && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{site.address}</span>
                </li>
              )}
              {site.phone && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a href={`tel:${site.phone}`} style={{ color: 'var(--muted)' }}>{site.phone}</a>
                </li>
              )}
              {site.workingHours && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{site.workingHours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col items-start md:items-end justify-start gap-4">
            <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
              تواصل معنا
            </h4>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('whatsapp', UI_LABELS)}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
          <span>&copy; {new Date().getFullYear()} {site.businessName?.length > 100 ? site.businessName.substring(0, 50) + '...' : site.businessName} - {t('allRightsReserved', UI_LABELS)}</span>
          <a href="https://ruaadalraqamia.com/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity hover:text-[var(--primary)] font-medium">
            تصميم وتطوير رواد الرقمية
          </a>
        </div>
      </div>
    </footer>
  );
}
