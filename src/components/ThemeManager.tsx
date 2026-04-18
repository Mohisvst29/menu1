'use client';

import { useEffect } from 'react';
import type { SiteConfig } from '@/types';

export default function ThemeManager() {
  useEffect(() => {
    // 1. Check local preference first
    const localTheme = localStorage.getItem('user_theme_choice');
    if (localTheme) {
       document.documentElement.setAttribute('data-theme', localTheme);
    }

    // 2. Fetch site config
    fetch('/api/site')
      .then(r => r.json())
      .then((site: SiteConfig) => {
        applyTheme(site, localTheme);
      });

    // Handle cross-tab changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'user_theme_choice') {
        document.documentElement.setAttribute('data-theme', e.newValue || 'dark');
      }
    });

    // Handle same-tab forced refresh (from admin)
    window.addEventListener('theme-refresh', () => {
       fetch('/api/site').then(r => r.json()).then(site => applyTheme(site, localStorage.getItem('user_theme_choice')));
    });
  }, []);

  const applyTheme = (site: SiteConfig, localOverride: string | null) => {
    let mode = localOverride || site.themeMode || 'dark';
    
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode = isDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', mode);

    if (site.theme) {
      const t = site.theme;
      const root = document.documentElement;
      root.style.setProperty('--primary', t.primaryColor);
      root.style.setProperty('--secondary', t.secondaryColor);
    }
  };

  return null;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('user_theme_choice', next);
}
