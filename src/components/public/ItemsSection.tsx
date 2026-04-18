'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import type { Category, Item, SiteConfig } from '@/types';
import ItemCard from './ItemCard';

interface ItemsSectionProps {
  categories: Category[];
  items: Item[];
  site: SiteConfig;
  activeCategory: string;
}

type ViewMode = 'grid' | 'list';

export default function ItemsSection({ categories, items, site, activeCategory }: ItemsSectionProps) {
  const { translateText } = useLang();
  const [catLabels, setCatLabels] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    const translate = async () => {
      const entries = await Promise.all(
        categories.map(async (c) => [c.id, await translateText(c.name)] as [string, string])
      );
      setCatLabels(Object.fromEntries(entries));
    };
    translate();
  }, [categories, translateText]);

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);

  const filteredCats =
    activeCategory === 'all'
      ? sortedCats
      : sortedCats.filter((c) => c.id === activeCategory);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* View Toggle */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-1 p-1 rounded-xl glass">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            title="شبكة"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            title="قائمة"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {filteredCats.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        if (catItems.length === 0) return null;

        return (
          <div key={cat.id} id={`cat-section-${cat.id}`} className="mb-14 scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shadow-lg overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.3)' }}>
                {cat.icon?.startsWith('http') || cat.icon?.startsWith('data:') || cat.icon?.startsWith('/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  cat.icon
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>
                  {catLabels[cat.id] || cat.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-8 h-1 rounded-full bg-[var(--primary)]" />
                   <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                     {catItems.length} {catItems.length === 1 ? 'عنصر' : 'عناصر'}
                   </p>
                </div>
              </div>
            </div>

            {/* Grid / List Layout */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" 
              : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {catItems.map((item) => (
                <ItemCard key={item.id} item={item} site={site} view={viewMode} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
