'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { UI_LABELS } from '@/lib/i18n';
import type { Item, SiteConfig } from '@/types';

interface ItemCardProps {
  item: Item;
  site: SiteConfig;
  view?: 'grid' | 'list';
}

export default function ItemCard({ item, site, view = 'grid' }: ItemCardProps) {
  const { translateText, t } = useLang();
  const { addToCart } = useCart();
  
  const [title, setTitle] = useState(item.title);
  const [desc, setDesc] = useState(item.description);
  const [extraLabel, setExtraLabel] = useState(item.extraInfoLabel);
  const [extraVal, setExtraVal] = useState(item.extraInfoValue);

  useEffect(() => {
    translateText(item.title).then(setTitle);
    translateText(item.description).then(setDesc);
    if (item.extraInfoLabel) translateText(item.extraInfoLabel).then(setExtraLabel);
    if (item.extraInfoValue) translateText(item.extraInfoValue).then(setExtraVal);
  }, [item, translateText]);

  const isAvailable = item.isAvailable !== false;
  const isList = view === 'list';

  return (
    <div
      className={`premium-card block group relative overflow-hidden ${isList ? 'item-card-list' : 'flex flex-col'}`}
      style={{
        opacity: isAvailable ? 1 : 0.6,
      }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${isList ? 'w-[120px] sm:w-[160px] flex-shrink-0' : 'w-full'}`}
           style={{ aspectRatio: isList ? '1/1' : '4/3' }}>
        {item.image ? (
          <Image
            src={item.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
            <span className="text-4xl opacity-20">🍽️</span>
          </div>
        )}

        {/* Gradient Overlay for Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        {item.badge && isAvailable && (
          <div className="absolute top-3 start-3 flex flex-col gap-1 z-10">
            {item.badge === 'new' && (
              <span className="badge-new">{t('newBadge', UI_LABELS)}</span>
            )}
            {item.badge === 'popular' && (
              <span className="badge-popular">🔥 {t('popularBadge', UI_LABELS)}</span>
            )}
            {item.badge === 'offer' && (
              <span className="badge-offer">🏷️ عرض خاص</span>
            )}
          </div>
        )}

        {/* Add to Cart hover overlay */}
        {isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
             <button 
               onClick={(e) => { e.preventDefault(); addToCart(item); }}
               className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:scale-110 transition-transform cursor-pointer"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m-2-2h4" />
               </svg>
             </button>
          </div>
        )}

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-20">
            <span className="text-white font-bold text-sm px-4 py-1.5 rounded-full border border-white/20 bg-black/50">
              {t('unavailable', UI_LABELS)}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className={`card-body p-4 md:p-5 flex flex-col ${isList ? 'border-s' : ''}`} style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-extrabold text-base md:text-lg leading-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {title?.length > 100 ? title.substring(0, 80) + '...' : title}
          </h3>
          {/* Price pinned to top right in list view */}
          {isList && item.price && (
            <span className="font-black text-lg text-[var(--primary)] shrink-0 bg-[var(--primary)]/10 px-3 py-1 rounded-lg">
              {item.price} ر.س
            </span>
          )}
        </div>

        {desc && (
          <p className="text-[13px] md:text-sm leading-relaxed text-[var(--muted)] line-clamp-2 mb-3">
            {desc?.length > 200 ? desc.substring(0, 180) + '...' : desc}
          </p>
        )}

        {/* Footer Area */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          {/* Extra info */}
          {extraLabel && extraVal ? (
            <div className="flex flex-col gap-0.5">
               <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{extraLabel}</span>
               <span className="text-xs font-semibold text-[var(--foreground)] px-2 py-0.5 rounded border w-fit" 
                     style={{ background: 'var(--input-bg)', borderColor: 'var(--border)' }}>
                 {extraVal}
               </span>
            </div>
          ) : <div />}

          {/* Add Cart Button for mobile / grid */}
          <div className="flex items-center gap-2">
            {!isList && item.price && (
              <span className="font-black text-lg text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg border border-[var(--primary)]/20 shadow-sm">
                {item.price} ر.س
              </span>
            )}
            
            {/* Quick add button (mostly for mobile where hover isn't good) */}
            {isAvailable && (
              <button 
                 onClick={(e) => { e.preventDefault(); addToCart(item); }}
                 className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                 style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--primary)' }}
                 title={t('addToCart', UI_LABELS)}
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                 </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
