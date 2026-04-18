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
  const [error, setError] = useState<string | null>(null);

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
    const load = async () => {
      try {
        const [sRes, iRes] = await Promise.all([
          fetch('/api/site'),
          fetch('/api/items')
        ]);
        
        if (!sRes.ok || !iRes.ok) throw new Error('فشل الطلب البرمجي');
        
        const sData = await sRes.json();
        const iData = await iRes.json();
        
        if (sData.error || iData.error) throw new Error(sData.error || iData.error);
        
        setSite(sData);
        setCatalog(iData);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ في الاتصال بقاعدة البيانات');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <div className="relative w-full max-w-xs flex flex-col items-center">
          {/* Outer glow circle */}
          <div className="absolute inset-0 w-32 h-32 m-auto rounded-full bg-orange-500/20 blur-3xl animate-pulse" />
          
          {/* Animated Spinner with Gradient */}
          <div className="relative w-24 h-24 mb-8">
             <div className="absolute inset-0 rounded-full border-[3px] border-white/5" />
             <div className="absolute inset-0 rounded-full border-t-[3px] border-orange-500 animate-spin" style={{ animationDuration: '0.8s' }} />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-bounce">✨</span>
             </div>
          </div>

          <div className="text-center space-y-3 relative">
            <h2 className="text-xl font-bold text-white tracking-wide">جاري تحضير القائمة</h2>
            <div className="flex items-center justify-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
               <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
               <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-xs text-gray-400 font-medium opacity-80 pt-4 uppercase tracking-[0.2em]">Premium Dining Experience</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site || !catalog) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#080810] text-white p-6 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-3">عذراً، تعذر تحميل المنيو</h1>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
            {error || 'لم نتمكن من جلب بيانات المنيو حالياً.'}
            <br />
            <span className="text-orange-400/80 mt-3 block">إذا كنت المالك: تأكد من السماح لجميع الـ IP في MongoDB Atlas.</span>
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
     );
  }

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
