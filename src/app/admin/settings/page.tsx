'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';
import type { SiteConfig } from '@/types';

const COLORS = [
  { key: 'primaryColor', label: 'اللون الرئيسي' },
  { key: 'secondaryColor', label: 'اللون الثانوي' },
  { key: 'backgroundColor', label: 'لون الخلفية' },
  { key: 'textColor', label: 'لون النص' },
  { key: 'cardBackgroundColor', label: 'خلفية البطاقات' },
  { key: 'buttonColor', label: 'لون الأزرار' },
  { key: 'headerBackgroundColor', label: 'خلفية الهيدر' },
  { key: 'footerBackgroundColor', label: 'خلفية الفوتر' },
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: '#d1d5db' }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' };

export default function SettingsPage() {
  const router = useRouter();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'theme' | 'backup' | 'password'>('business');

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) { router.replace('/admin/login'); return; }
    fetch('/api/site').then((r) => r.json()).then(setSite);
  }, [router]);

  const update = (key: keyof SiteConfig, value: string) => {
    // Safety check: prevent pasting huge base64 strings into text fields
    if (key !== 'logo' && key !== 'coverImage') {
      if (typeof value === 'string' && value.length > 1000 && value.startsWith('data:image')) {
        alert('⚠️ تنبيه: يبدو أنك تحاول لصق كود صورة في حقل نصي. يرجى التأكد من إدخال نص فقط.');
        return;
      }
    }

    // Individual length limits
    const limits: Partial<Record<keyof SiteConfig, number>> = {
      businessName: 100,
      phone: 25,
      whatsappNumber: 25,
      workingHours: 100,
      address: 200,
      description: 500,
    };

    const limit = limits[key];
    const finalValue = limit && value.length > limit ? value.substring(0, limit) : value;

    setSite((prev) => prev ? { ...prev, [key]: finalValue } : prev);
  };

  const updateNested = (parent: keyof SiteConfig, key: string, value: string) => {
    setSite((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  const updateCoverImageArray = (index: number, url: string) => {
    setSite((prev) => {
      if (!prev) return prev;
      const newCoverImages = [...(prev.coverImages || [])];
      newCoverImages[index] = url;
      return { ...prev, coverImages: newCoverImages };
    });
  };

  const updateTheme = (key: string, value: string) => {
    setSite((prev) => prev ? { ...prev, theme: { ...prev.theme, [key]: value } } : prev);
    // Apply instantly to CSS vars
    document.documentElement.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase().replace('color', '-color').replace('--', '-')}`, value);
  };

  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    try {
      await fetch('/api/site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
      setSaved(true);
      window.dispatchEvent(new Event('theme-refresh'));
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) return;
    const res = await fetch('/api/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    setPwMsg(res.ok ? '✅ تم تغيير كلمة المرور' : `❌ ${data.error}`);
    if (res.ok) { setCurrentPw(''); setNewPw(''); }
    setTimeout(() => setPwMsg(''), 4000);
  };

  if (!site) return (
    <div className="flex h-screen items-center justify-center" style={{ background: '#080810' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#f97316', borderTopColor: 'transparent' }} />
    </div>
  );

  const tabs = [
    { id: 'business', label: 'بيانات المشروع' },
    { id: 'theme', label: 'الألوان والثيم' },
    { id: 'backup', label: 'النسخ الاحتياطي' },
    { id: 'password', label: 'تغيير كلمة المرور' },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl" style={{ fontFamily: 'var(--font-cairo, sans-serif)', color: '#f1f5f9' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full"><Sidebar onClose={() => setSidebarOpen(false)} /></div>
        </div>
      )}
      <div className="hidden lg:flex flex-shrink-0"><Sidebar /></div>

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b"
          style={{ background: '#080810', borderColor: 'rgba(255,255,255,0.06)' }}>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-black text-white text-lg">الإعدادات</h1>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: saving ? '#6b7280' : 'linear-gradient(135deg, #f97316, #fb923c)', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saved ? '✅ تم الحفظ' : saving ? 'جاري...' : 'حفظ التغييرات'}
          </button>
        </div>

        <div className="p-6 max-w-3xl mx-auto space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? '#f97316' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#9ca3af',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="اسم المشروع">
                  <input className={inputCls} style={inputStyle} value={site.businessName}
                    onChange={(e) => update('businessName', e.target.value)} />
                </Field>
                <Field label="رقم واتساب">
                  <input className={inputCls} style={inputStyle} value={site.whatsappNumber} dir="ltr"
                    onChange={(e) => update('whatsappNumber', e.target.value)} placeholder="966500000000" />
                </Field>
                <Field label="رقم الهاتف">
                  <input className={inputCls} style={inputStyle} value={site.phone} dir="ltr"
                    onChange={(e) => update('phone', e.target.value)} />
                </Field>
                <Field label="ساعات العمل">
                  <input className={inputCls} style={inputStyle} value={site.workingHours}
                    onChange={(e) => update('workingHours', e.target.value)} />
                </Field>
              </div>

              <Field label="العنوان">
                <input className={inputCls} style={inputStyle} value={site.address}
                  onChange={(e) => update('address', e.target.value)} />
              </Field>

              <Field label="وصف المشروع">
                <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }} rows={3} value={site.description}
                  onChange={(e) => update('description', e.target.value)} />
              </Field>

              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-medium mb-4" style={{ color: '#9ca3af' }}>حسابات التواصل الاجتماعي</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['instagram', 'tiktok', 'snapchat', 'twitter', 'facebook', 'youtube', 'linkedin', 'telegram'] as const).map((s) => (
                    <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}>
                      <input className={inputCls} style={inputStyle} value={(site as unknown as Record<string, string>)[s] || ''} dir="ltr"
                        onChange={(e) => update(s as keyof SiteConfig, e.target.value)} placeholder={`https://${s}.com/...`} />
                    </Field>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-medium mb-4" style={{ color: '#9ca3af' }}>الصور والشعار</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ImageUpload label="شعار المشروع" value={site.logo} onChange={(url) => update('logo', url)} folder="logos" />
                  <ImageUpload label="صورة الغلاف 1 (الرئيسية)" value={site.coverImages?.[0] || site.coverImage || ''} onChange={(url) => updateCoverImageArray(0, url)} folder="covers" />
                  <ImageUpload label="صورة الغلاف 2" value={site.coverImages?.[1] || ''} onChange={(url) => updateCoverImageArray(1, url)} folder="covers" />
                  <ImageUpload label="صورة الغلاف 3" value={site.coverImages?.[2] || ''} onChange={(url) => updateCoverImageArray(2, url)} folder="covers" />
                  <VideoUpload label="فيديو الغلاف" value={site.coverVideo || ''} onChange={(url) => update('coverVideo', url)} folder="covers" />
                </div>
              </div>
            </div>
          )}

          {/* Theme */}
          {activeTab === 'theme' && (
            <div className="rounded-2xl p-6 space-y-8" style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>
                  التغييرات تُطبَّق فوراً على الموقع بمجرد الحفظ.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {COLORS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        style={{ border: '2px solid rgba(255,255,255,0.12)' }}>
                        <input type="color"
                          value={(site.theme as unknown as Record<string, string>)[key] || '#000000'}
                          onChange={(e) => updateTheme(key, e.target.value)}
                          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                          style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }} />
                        <div className="w-full h-full" style={{ background: (site.theme as unknown as Record<string, string>)[key] || '#000' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{label}</p>
                        <input
                          type="text"
                          value={(site.theme as unknown as Record<string, string>)[key] || ''}
                          onChange={(e) => updateTheme(key, e.target.value)}
                          className="text-xs mt-0.5 w-full bg-transparent outline-none"
                          style={{ color: '#6b7280', fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Field label={`حجم الشعار (${site.logoSize || 100}%)`}>
                  <input 
                    type="range" 
                    min="50" 
                    max="200" 
                    value={site.logoSize || 100} 
                    onChange={(e) => update('logoSize', e.target.value)}
                    className="w-full mt-2 accent-orange-500" 
                  />
                </Field>
                
                <Field label="نوع الخط">
                  <select 
                    className={inputCls} style={inputStyle} 
                    value={site.fontFamily || '--font-cairo'}
                    onChange={(e) => update('fontFamily', e.target.value)}
                  >
                    <option value="--font-cairo">كايرو (Cairo) - افتراضي</option>
                    <option value="--font-tajawal">تجاول (Tajawal)</option>
                    <option value="--font-almarai">المراعي (Almarai)</option>
                    <option value="--font-readex">ريدكس (Readex Pro)</option>
                  </select>
                </Field>

                <Field label="وضع العرض (ثيم الموقع)">
                  <select 
                    className={inputCls} style={inputStyle} 
                    value={site.themeMode || 'dark'}
                    onChange={(e) => update('themeMode', e.target.value)}
                  >
                    <option value="dark">الوضع الليلي (Dark)</option>
                    <option value="light">الوضع النهاري (Light)</option>
                    <option value="system">حسب إعدادات الجهاز (System)</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* Backup */}
          {activeTab === 'backup' && (
            <div className="rounded-2xl p-6 space-y-6" style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <span className="text-2xl">☁️</span>
                <div>
                  <p className="font-bold text-sm text-orange-200">النسخ الاحتياطي التلقائي (Google Drive)</p>
                  <p className="text-xs text-orange-200/60 mt-0.5">اربط حساب Gmail الخاص بك لحفظ نسخة من البيانات يومياً على الدرايف.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Field label="إيميل النسخ الاحتياطي (Gmail)">
                  <input className={inputCls} style={inputStyle} value={site.backupEmail || ''} dir="ltr"
                    onChange={(e) => update('backupEmail', e.target.value)} placeholder="your-email@gmail.com" />
                </Field>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">إعدادات Google API (اختياري للمطورين)</p>
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Google Client ID">
                      <input className={inputCls} style={inputStyle} value={site.googleDriveKeys?.clientId || ''} dir="ltr"
                        onChange={(e) => updateNested('googleDriveKeys', 'clientId', e.target.value)} />
                    </Field>
                    <Field label="Google Client Secret">
                      <input type="password" className={inputCls} style={inputStyle} value={site.googleDriveKeys?.clientSecret || ''} dir="ltr"
                        onChange={(e) => updateNested('googleDriveKeys', 'clientSecret', e.target.value)} />
                    </Field>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mt-4">
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <b>ملاحظة:</b> لتفعيل الرفع التلقائي، يجب إنشاء مشروع في Google Cloud Console وتفعيل Drive API. 
                    في حال عدم توفر المفاتيح، يمكنك دائماً تحميل نسخة احتياطية يدوية من صفحة "النظام المحاسبي".
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <div className="rounded-2xl p-6" style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                <Field label="كلمة المرور الحالية">
                  <input type="password" className={inputCls} style={inputStyle} value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)} required />
                </Field>
                <Field label="كلمة المرور الجديدة">
                  <input type="password" className={inputCls} style={inputStyle} value={newPw}
                    onChange={(e) => setNewPw(e.target.value)} required minLength={6} />
                </Field>
                {pwMsg && (
                  <p className="text-sm" style={{ color: pwMsg.startsWith('✅') ? '#22c55e' : '#f87171' }}>{pwMsg}</p>
                )}
                <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                  تغيير كلمة المرور
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
