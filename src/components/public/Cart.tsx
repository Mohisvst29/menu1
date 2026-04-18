'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart, CustomerInfo } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';
import { UI_LABELS } from '@/lib/i18n';
import type { SiteConfig } from '@/types';
import { useSearchParams } from 'next/navigation';

interface CartProps {
  site: SiteConfig;
}

export default function Cart({ site }: CartProps) {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { t, lang, translateText } = useLang();
  
  const searchParams = useSearchParams();
  const initialTable = searchParams.get('table');

  const [customer, setCustomer] = useState<CustomerInfo>({ 
    name: '', phone: '', address: '', notes: '', 
    type: initialTable ? 'dineIn' : 'takeaway', 
    tableNum: initialTable || '' 
  });
  const [step, setStep] = useState<1 | 2>(1); // 1: Cart Items, 2: Checkout Info
  const [translatedTitles, setTranslatedTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    // Translate item titles if lang shifts
    const translateTitles = async () => {
       const mapped: Record<string, string> = {};
       await Promise.all(items.map(async (i) => {
         if (!mapped[i.item.id]) {
            mapped[i.item.id] = await translateText(i.item.title);
         }
       }));
       setTranslatedTitles(mapped);
    };
    if (isOpen) translateTitles();
  }, [items, lang, isOpen, translateText]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    
    try {
      // 1. Post to backend
      const payload = {
         customer,
         items: items.map(i => ({ 
           itemId: i.item.id, 
           title: translatedTitles[i.item.id] || i.item.title, 
           price: i.item.price, 
           quantity: i.quantity 
         })),
         totalAmount: totalPrice
      };
      
      const res = await fetch('/api/orders', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save order to database');
      }

      const orderId = data.orderId || 'NEW';

      // 2. Format cart text for WhatsApp
      let msg = `*رقم الطلب: ${orderId}*\n\n`;
      msg += `${t('newOrderWhatsappMsg', UI_LABELS)}\n\n`;
      items.forEach((i) => {
        const title = translatedTitles[i.item.id] || i.item.title;
        msg += `▪️ ${i.quantity}x ${title} (${i.item.price ? i.item.price + ' ر.س' : '-'}) \n`;
      });
      
      msg += `\n💰 ${t('total', UI_LABELS)}: ${totalPrice.toFixed(2)} ر.س\n\n`;
      msg += `📦 ${t('orderType', UI_LABELS)}: ${customer.type === 'dineIn' ? t('dineIn', UI_LABELS) : t('takeaway', UI_LABELS)}\n`;
      msg += `👤 ${t('customerInfo', UI_LABELS)}:\n`;
      msg += `- ${t('name', UI_LABELS)}: ${customer.name}\n`;
      msg += `- ${t('phone', UI_LABELS)}: ${customer.phone}\n`;
      
      if (customer.type === 'dineIn' && customer.tableNum) {
        msg += `- ${t('tableNum', UI_LABELS)}: ${customer.tableNum}\n`;
      } else if (customer.address) {
        msg += `- ${t('address', UI_LABELS)}: ${customer.address}\n`;
      }

      if (customer.notes) msg += `- ${t('notes', UI_LABELS)}: ${customer.notes}\n`;

      const link = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(link, '_blank');
      
      // 3. Clear Cart & Close
      clearCart();
      setIsOpen(false);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className="fixed top-0 bottom-0 z-[101] w-full max-w-md bg-[var(--background)] border-s border-white/10 shadow-2xl flex flex-col transition-transform"
        style={{ [document.documentElement.dir === 'rtl' ? 'left' : 'right']: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[var(--card-bg)]">
          <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t('cart', UI_LABELS)} ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           {items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] opacity-60">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-lg font-medium">{t('emptyCart', UI_LABELS)}</p>
             </div>
           ) : step === 1 ? (
             <div className="space-y-4">
                {items.map((cartItem) => (
                  <div key={cartItem.id} className="flex gap-4 p-3 rounded-xl bg-[var(--card-bg)] border border-white/5 relative group">
                    <button 
                      onClick={() => removeFromCart(cartItem.id)}
                      className="absolute -top-2 -start-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="w-20 h-20 rounded-lg overflow-hidden relative shrink-0 bg-black/20">
                      {cartItem.item.image ? (
                        <Image src={cartItem.item.image} alt="product" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                         <h4 className="font-semibold text-sm line-clamp-1">{translatedTitles[cartItem.item.id] || cartItem.item.title}</h4>
                         <p className="text-[var(--primary)] font-bold text-sm mt-0.5">{cartItem.item.price ? cartItem.item.price + ' ر.س' : ''}</p>
                       </div>
                       
                       <div className="flex items-center gap-3 mt-2 bg-white/5 w-fit rounded-lg p-1 border border-white/10">
                         <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20">-</button>
                         <span className="text-sm font-semibold w-4 text-center">{cartItem.quantity}</span>
                         <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20">+</button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="space-y-4">
                <div className="bg-[var(--primary)]/10 text-[var(--primary)] p-3 rounded-lg text-sm border border-[var(--primary)]/20 mb-4">
                  {t('customerInfo', UI_LABELS)}
                </div>

                {/* Order Type Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setCustomer(p => ({ ...p, type: 'takeaway' }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${customer.type === 'takeaway' || !customer.type ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--muted)] hover:text-white'}`}
                  >
                    {t('takeaway', UI_LABELS)}
                  </button>
                  <button 
                    onClick={() => setCustomer(p => ({ ...p, type: 'dineIn' }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${customer.type === 'dineIn' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--muted)] hover:text-white'}`}
                  >
                    {t('dineIn', UI_LABELS)}
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--muted)] font-medium">{t('name', UI_LABELS)} *</label>
                  <input type="text" required value={customer.name} onChange={e => setCustomer(p => ({...p, name: e.target.value}))} 
                    className="w-full bg-[var(--card-bg)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--muted)] font-medium">{t('phone', UI_LABELS)} *</label>
                  <input type="tel" required value={customer.phone} onChange={e => setCustomer(p => ({...p, phone: e.target.value}))} dir="ltr"
                    className="w-full bg-[var(--card-bg)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
                </div>

                {customer.type === 'dineIn' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs text-[var(--muted)] font-medium">{t('tableNum', UI_LABELS)} *</label>
                    <input type="text" required value={customer.tableNum || ''} onChange={e => setCustomer(p => ({...p, tableNum: e.target.value}))} 
                      className="w-full bg-[var(--card-bg)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs text-[var(--muted)] font-medium">{t('address', UI_LABELS)}</label>
                    <input type="text" value={customer.address} onChange={e => setCustomer(p => ({...p, address: e.target.value}))} 
                      className="w-full bg-[var(--card-bg)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--muted)] font-medium">{t('notes', UI_LABELS)}</label>
                  <textarea rows={3} value={customer.notes} onChange={e => setCustomer(p => ({...p, notes: e.target.value}))} 
                    className="w-full bg-[var(--card-bg)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)] transition-colors resize-none" />
                </div>
             </div>
           )}
        </div>

        {/* Footer / Total */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-[var(--card-bg)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[var(--muted)] font-medium">{t('total', UI_LABELS)}</span>
              <span className="text-xl font-black text-[var(--primary)]">{totalPrice.toFixed(2)} ر.س</span>
            </div>
            
            {step === 1 ? (
              <button 
                onClick={() => setStep(2)}
                className="w-full btn-primary justify-center !py-3.5"
              >
                {t('checkout', UI_LABELS)}
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={!customer.name || !customer.phone || isSubmitting}
                  className="flex-1 btn-whatsapp justify-center !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('loading', UI_LABELS) : t('checkoutWhatsapp', UI_LABELS)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </>
  );
}
