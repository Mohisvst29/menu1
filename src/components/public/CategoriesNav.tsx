'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import { UI_LABELS } from '@/lib/i18n';
import type { Category } from '@/types';

interface CategoriesNavProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategoriesNav({ categories, activeId, onSelect }: CategoriesNavProps) {
  const { translateText, t } = useLang();
  const [labels, setLabels] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const translate = async () => {
      const entries = await Promise.all(
        categories.map(async (c) => [c.id, await translateText(c.name)] as [string, string])
      );
      setLabels(Object.fromEntries(entries));
    };
    translate();
  }, [categories, translateText]);

  const handleClick = (id: string) => {
    onSelect(id);
    const el = document.getElementById(`cat-section-${id}`);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[60px] z-40 py-4"
      style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar px-4 max-w-6xl mx-auto"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* All button */}
        <button
          onClick={() => onSelect('all')}
          className={`category-pill flex-shrink-0 ${activeId === 'all' ? 'active' : ''}`}
        >
          🌟 {t('all', UI_LABELS)}
        </button>

        {categories.map((cat) => {
          const isImg = cat.icon?.startsWith('http') || cat.icon?.startsWith('data:') || cat.icon?.startsWith('/');
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`category-pill flex-shrink-0 flex items-center justify-center gap-1.5 ${activeId === cat.id ? 'active' : ''}`}
            >
              {cat.icon && (
                isImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.icon} alt={cat.name} className="w-5 h-5 object-contain rounded-full" />
                ) : (
                  <span>{cat.icon}</span>
                )
              )}
              <span>{labels[cat.id]?.length > 50 ? labels[cat.id].substring(0, 40) + '...' : (labels[cat.id] || (cat.name?.length > 50 ? cat.name.substring(0, 40) + '...' : cat.name))}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
