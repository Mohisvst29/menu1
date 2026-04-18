'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SiteConfig } from '@/types';

export default function OffersPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    fetch('/api/site')
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(data => {
        if (!data || data.error) return;
        setSite(data);
        // Show after 2 seconds
        const timer = setTimeout(() => {
          setShow(true);
        }, 2000);
        return () => clearTimeout(timer);
      })
      .catch(() => console.log('OffersPopup: Failed to fetch site config'));
  }, [pathname]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show || !site) return null;

  const handleOfferClick = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create a dummy order for the offer
      const offerTitle = site.offersTitle || 'طلب عرض خاص';
      const payload = {
        customer: {
          name: 'عميل مهتم بالعرض',
          phone: '',
          address: '',
          notes: `المستخدم طلب العرض: ${offerTitle}`,
          type: 'takeaway'
        },
        items: [{
          itemId: 'OFFER',
          title: offerTitle,
          price: 0,
          quantity: 1
        }],
        totalAmount: 0
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const orderId = data.orderId || 'NEW';

      // 2. Open WhatsApp
      const msg = `*رقم الاستفسار: ${orderId}*\n\nمرحباً، أريد الاستفسار عن العرض المتاحة: ${offerTitle}`;
      const link = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(link, '_blank');
      
      setShow(false);
    } catch (err) {
      console.error('Offer order error', err);
      // Fallback to direct link if API fails
      const link = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن العرض المتاحة: ' + (site.offersTitle || ''))}`;
      window.open(link, '_blank');
      setShow(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-700"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
      >
        <button 
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-4xl">🎁</span>
          </div>
          
          <h2 className="text-2xl font-black text-white leading-tight">
            {site.offersTitle || 'اكتشف عروضنا الحصرية! 🎉'}
          </h2>
          
          <p className="text-gray-400 text-sm">
            لدينا خصومات خاصة وعروض لفترة محدودة بانتظارك في قسم العروض.
          </p>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={handleOfferClick}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all text-center disabled:opacity-70"
            >
              {isSubmitting ? 'جاري التحميل...' : 'اطلب العرض عبر واتساب 💬'}
            </button>
            <Link 
              href="/offers"
              onClick={() => setShow(false)}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all text-center"
            >
              مشاهدة كافة العروض
            </Link>
            <button 
              onClick={() => setShow(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              ربما لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
