'use client';

import { useLang } from '@/context/LanguageContext';
import { UI_LABELS } from '@/lib/i18n';
import type { SiteConfig } from '@/types';

interface FooterProps {
  site: SiteConfig;
}

export default function Footer({ site }: FooterProps) {
  const { t } = useLang();

  const waLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الاستفسار')}`;

  const socials = [
    {
      key: 'tiktok', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
        </svg>
      ), url: site.tiktok,
    },
    {
      key: 'youtube', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ), url: site.youtube,
    },
    {
      key: 'linkedin', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.171C.525 0 0 .511 0 1.146v21.708c0 .635.525 1.146 1.171 1.146h21.054c.65 0 1.175-.511 1.175-1.146V1.146c0-.635-.525-1.146-1.175-1.146z"/>
        </svg>
      ), url: site.linkedin,
    },
    {
      key: 'telegram', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.24.24-.48.24l.19-2.85 5.17-4.67c.22-.19-.05-.3-.34-.11L9.63 13.23l-2.76-.86c-.6-.19-.611-.6.125-.89l10.78-4.16c.5-.19.93.1.75.901z"/>
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
              {site.businessName}
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
                    href={s.url}
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
          <span>© {new Date().getFullYear()} {site.businessName} — {t('allRightsReserved', UI_LABELS)}</span>
          <a href="https://ruaadalraqamia.com/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity hover:text-[var(--primary)] font-medium">
            صمم بواسطة رواد الرقمية
          </a>
        </div>
      </div>
    </footer>
  );
}
