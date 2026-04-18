'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import ImageUpload from '@/components/admin/ImageUpload';
import type { OfferBanner } from '@/types';

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: '#9ca3af' }}>{label}</label>
      {children}
    </div>
  );
}

export default function OffersAdminPage() {
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<OfferBanner | null>(null);
  const [form, setForm] = useState<OfferBanner>({
    id: '', title: '', description: '', image: '', linkUrl: '', isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [site, setSite] = useState<any>(null);
  const [offersTitle, setOffersTitle] = useState('');

  useEffect(() => {
    fetch('/api/offers').then(r => r.json()).then(setBanners).finally(() => setLoading(false));
    fetch('/api/site').then(r => r.json()).then(s => { setSite(s); setOffersTitle(s.offersTitle || 'اكتشف أقوى عروضنا! 🎁'); });
  }, []);

  const saveBanners = async (newBanners: OfferBanner[]) => {
    setSaving(true);
    await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBanners) });
    setBanners(newBanners);
    setSaving(false);
  };

  const saveTitle = async () => {
    if (!site) return;
    setSaving(true);
    const newSite = { ...site, offersTitle };
    await fetch('/api/site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSite) });
    setSite(newSite);
    setSaving(false);
    alert('✅ تم حفظ العنوان بنجاح');
  };

  const openAdd = () => {
    setEditBanner(null);
    setForm({ id: `off-${Date.now()}`, title: '', description: '', image: '', linkUrl: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (b: OfferBanner) => {
    setEditBanner(b);
    setForm({ ...b });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    let nb: OfferBanner[];
    if (editBanner) {
      nb = banners.map(b => b.id === editBanner.id ? form : b);
    } else {
      nb = [...banners, form];
    }
    saveBanners(nb);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(!confirm('هل تريد حذف هذا العرض؟')) return;
    saveBanners(banners.filter(b => b.id !== id));
  };

  const toggleActive = (id: string) => {
    saveBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl" style={{ fontFamily: 'var(--font-cairo, sans-serif)', color: '#f1f5f9', background: '#080810' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full"><Sidebar onClose={() => setSidebarOpen(false)} /></div>
        </div>
      )}
      <div className="hidden lg:flex flex-shrink-0"><Sidebar /></div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b bg-[#080810] border-white/5">
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">إدارة العروض الترويجية</h1>
          </div>
          <button onClick={openAdd}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
            <span className="text-lg leading-none">+</span> عرض جديد
          </button>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Section for title control */}
          <div className="bg-[#111120] border border-white/5 rounded-2xl p-6">
             <h2 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
               <span>📢</span> التحكم في رسالة العروض للعملاء
             </h2>
             <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 className={`${inputCls} flex-1`} 
                 style={inputStyle} 
                 value={offersTitle} 
                 onChange={(e) => setOffersTitle(e.target.value)} 
                 placeholder="مثال: اكتشف أقوى عروضنا! 🎁"
               />
               <button 
                onClick={saveTitle}
                disabled={saving}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-50"
               >
                 حفظ العنوان
               </button>
             </div>
             <p className="text-[10px] text-gray-500 mt-2">هذا النص سيظهر للعميل بشكل جذاب عند فتح المنيو.</p>
          </div>
          {banners.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-[#111120] border border-white/5 rounded-2xl">
              <p className="text-4xl mb-2 opacity-50">🏷️</p>
              <p className="text-lg font-bold">لا توجد عروض ترويجية حتى الآن</p>
              <p className="text-sm mt-1">ابدأ بإنشاء لافتات عروض ترويجية (Banners) تظهر أعلى صفحة العروض.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {banners.map(b => (
                <div key={b.id} className="bg-[#111120] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-5" style={{ opacity: b.isActive ? 1 : 0.6 }}>
                  <div className="w-full md:w-64 h-32 rounded-xl bg-black overflow-hidden flex-shrink-0 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600">بلا صورة</div>}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-white mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-400 max-w-md line-clamp-2 mb-4">{b.description || 'بدون وصف'}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <button onClick={() => toggleActive(b.id)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                        {b.isActive ? '✅ نشط' : '❌ غير نشط'}
                      </button>
                      <button onClick={() => openEdit(b)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">تعديل</button>
                      <button onClick={() => handleDelete(b.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">حذف</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-lg bg-[#111120] border border-white/10 rounded-2xl p-6" dir="rtl">
            <h2 className="text-lg font-bold text-white mb-5">{editBanner ? 'تعديل العرض' : 'إضافة عرض جديد'}</h2>
            <div className="space-y-4">
              <Field label="عنوان العرض *">
                <input className={inputCls} style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="وصف العرض">
                <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="صورة العرض (يفضل عرضية)">
                <ImageUpload label="اختر صورة" value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="offers" />
              </Field>
              <Field label="رابط التحويل (اختياري - عند النقر على العرض)">
                <input className={inputCls} style={inputStyle} value={form.linkUrl} dir="ltr" onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://" />
              </Field>
            </div>
            <div className="flex gap-3 mt-6">
              <button disabled={saving} onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button disabled={saving} onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
