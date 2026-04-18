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
      key: 'instagram', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ), url: site.instagram,
    },
    {
      key: 'facebook', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
        </svg>
      ), url: site.facebook,
    },
    {
      key: 'twitter', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ), url: site.twitter,
    },
    {
      key: 'snapchat', icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M11.96 1.054c-1.353 0-2.61.34-3.666 1.01-.6.38-.985.9-1.077 1.492-.092.593.12 1.146.593 1.55.705.597 1.758.89 2.9.89 1.144 0 2.195-.293 2.9-.89.473-.404.685-.957.593-1.55-.092-.592-.477-1.112-1.077-1.492-1.056-.67-2.313-1.01-3.666-1.01zm-3.87 3.551c-.69.873-1.037 2.05-1.037 3.513 0 1.25-.138 2.29-.408 3.124-.268.834-.674 1.55-1.22 2.146l-.286.305v.006c-.66.711-1.34 1.46-1.895 2.102-.32.378-.445.86-.33 1.266.115.405.474.717.92.79l3.05.464c.24.037.45.163.564.38a1.27 1.27 0 0 1-.027 1.196 6.308 6.308 0 0 1-1.162 1.233c-.267.214-.424.526-.403.82.02.293.208.577.493.744.975.58 2.302.795 3.935.795h1.364c1.633 0 2.96-.215 3.935-.795.285-.167.472-.45.493-.744.02-.294-.136-.606-.403-.82a6.308 6.308 0 0 1-1.162-1.233 1.27 1.27 0 0 1-.027-1.196c.113-.217.324-.343.564-.38l3.05-.464c.446-.073.805-.385.92-.79.115-.406-.01-.888-.33-1.266-.554-.642-1.234-1.39-1.895-2.102v-.006l-.286-.305c-.546-.596-.95-1.312-1.22-2.146-.27-.834-.408-1.874-.408-3.124 0-1.463-.347-2.64-1.037-3.513-.7-.887-1.764-1.332-3.167-1.332S8.79 3.718 8.09 4.605zm8.173 1.096l-.994.498.497.994.995-.497-.498-.995zm-8.527-.497l.498.995.994-.498-.497-.994-.995.497z"/>
        </svg>
      ), url: site.snapchat,
    },
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
          <span>© {new Date().getFullYear()} {site.businessName?.length > 100 ? site.businessName.substring(0, 50) + '...' : site.businessName} — {t('allRightsReserved', UI_LABELS)}</span>
          <a href="https://ruaadalraqamia.com/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity hover:text-[var(--primary)] font-medium">
            صمم بواسطة رواد الرقمية
          </a>
        </div>
      </div>
    </footer>
  );
}
