'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import Cart from '@/components/public/Cart';
import ItemCard from '@/components/public/ItemCard';
import type { SiteConfig, ItemsData, Item, OfferBanner } from '@/types';

export default function OffersPage() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [offers, setOffers] = useState<Item[]>([]);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/site').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
      fetch('/api/offers').then((r) => r.json()).catch(() => []),
    ]).then(([siteData, itemsData, bannersData]) => {
      setSite(siteData);
      setOffers((itemsData as ItemsData).items.filter(i => i.badge === 'offer' && i.isAvailable !== false));
      setBanners((bannersData as OfferBanner[]).filter(b => b.isActive));
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!site?.theme) return;
    const root = document.documentElement;
    const t = site.theme;
    root.style.setProperty('--primary', t.primaryColor);
    root.style.setProperty('--secondary', t.secondaryColor);
    root.style.setProperty('--background', t.backgroundColor);
    root.style.setProperty('--foreground', t.textColor);
    root.style.setProperty('--card-bg', t.cardBackgroundColor);
    root.style.setProperty('--button', t.buttonColor);
    root.style.setProperty('--header-bg', t.headerBackgroundColor);
    root.style.setProperty('--footer-bg', t.footerBackgroundColor);
    document.body.style.background = t.backgroundColor;
    
    if (site.fontFamily) {
      document.body.style.fontFamily = `var(${site.fontFamily}), sans-serif`;
    }
  }, [site]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!site) return null;

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header site={site} />
      <Suspense fallback={null}>
        <Cart site={site} />
      </Suspense>

      <div className="flex-1 mt-24 mb-12 max-w-6xl mx-auto w-full px-4">
        <div className="bg-[var(--card-bg)] rounded-2xl p-8 mb-10 text-center border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 tracking-tight">
            العروض الخاصة 🔥
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base max-w-2xl mx-auto">
            تصفح أحدث عروضنا وخصوماتنا الحصرية المتاحة لفترة محدودة. لا تفوت الفرصة واطلب الآن!
          </p>
        </div>

        {/* Banners */}
        {banners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {banners.map(b => (
              <a key={b.id} href={b.linkUrl || '#'} className={`block rounded-2xl overflow-hidden group border border-white/10 relative h-48 md:h-64 ${b.linkUrl ? 'cursor-pointer' : 'cursor-default'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full bg-black flex items-center justify-center">عرض خاص</div>}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 start-0 p-6 w-full text-white">
                  <h2 className="text-2xl font-black mb-2">{b.title}</h2>
                  {b.description && <p className="text-gray-300 text-sm max-w-md line-clamp-2">{b.description}</p>}
                </div>
              </a>
            ))}
          </div>
        )}

        {offers.length === 0 && banners.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)] border border-white/5 rounded-2xl bg-[var(--card-bg)]/50">
            <p className="text-5xl mb-4 opacity-50">🏷️</p>
            <p className="text-lg font-bold">عذراً، لا توجد عروض متاحة حالياً.</p>
            <p className="text-sm mt-2">ترقبوا عروضنا القادمة قريباً!</p>
          </div>
        ) : (
          <div>
            {offers.length > 0 && <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>المنتجات المخفضة</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {offers.map(item => (
                <ItemCard key={item.id} item={item} site={site} view="grid" />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer site={site} />
    </main>
  );
}
