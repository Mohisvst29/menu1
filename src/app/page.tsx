'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/public/Header';
import CoverSection from '@/components/public/CoverSection';
import CategoriesNav from '@/components/public/CategoriesNav';
import ItemsSection from '@/components/public/ItemsSection';
import Footer from '@/components/public/Footer';
import { useLang } from '@/context/LanguageContext';
import type { SiteConfig, ItemsData } from '@/types';
import Cart from '@/components/public/Cart';

export default function PublicCatalog() {
  const { lang } = useLang();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [catalog, setCatalog] = useState<ItemsData | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Apply dynamic variables from setting
  useEffect(() => {
    if (!site?.theme) return;
    const root = document.documentElement;
    const t = site.theme;
    root.style.setProperty('--primary', t.primaryColor);
    root.style.setProperty('--secondary', t.secondaryColor);
    
    // Apply Font
    if (site.fontFamily) {
      document.body.style.fontFamily = `var(${site.fontFamily}), sans-serif`;
    }
  }, [site]);

  // Intersection observer for active category
  useEffect(() => {
    if (!catalog?.categories.length) return;
    const observers: IntersectionObserver[] = [];
    catalog.categories.forEach((cat) => {
      const el = document.getElementById(`cat-section-${cat.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveCategory(cat.id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [catalog]);

  useEffect(() => {
    Promise.all([
      fetch('/api/site').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
    ]).then(([siteData, itemsData]) => {
      setSite(siteData);
      setCatalog(itemsData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--background)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!site || !catalog) return null;

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Header site={site} />
      <Suspense fallback={null}>
        <Cart site={site} />
      </Suspense>
      <CoverSection site={site} />
      <CategoriesNav
        categories={catalog.categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      <ItemsSection
        categories={catalog.categories}
        items={catalog.items}
        site={site}
        activeCategory={activeCategory}
      />
      <Footer site={site} />
    </main>
  );
}
