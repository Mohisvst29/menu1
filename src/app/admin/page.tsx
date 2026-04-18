'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/navigation';
import type { SiteConfig, ItemsData } from '@/types';

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [catalog, setCatalog] = useState<ItemsData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      router.replace('/admin/login');
      return;
    }
    Promise.all([
      fetch('/api/site').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
    ]).then(([s, c]) => { setSite(s); setCatalog(c); });
  }, [router]);

  const availableItems = catalog?.items.filter((i) => i.isAvailable !== false).length ?? 0;
  const popularItems = catalog?.items.filter((i) => i.isPopular).length ?? 0;

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl" style={{ fontFamily: 'var(--font-cairo, sans-serif)' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b"
          style={{ background: '#080810', borderColor: 'rgba(255,255,255,0.06)' }}>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <div>
            <h1 className="font-black text-white text-lg">مرحباً بك 👋</h1>
            <p className="text-xs" style={{ color: '#6b7280' }}>إليك ملخص كتالوجك الرقمي</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="إجمالي الطلبات" value={ordersCount} color="#3b82f6"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m.75 3.5h7.5a2.25 2.25 0 002.25-2.25V4.625c0-1.242-1.008-2.25-2.25-2.25h-7.5a2.25 2.25 0 00-2.25 2.25v16.625c0 1.242 1.008 2.25 2.25 2.25z" /></svg>} />
            <StatCard label="إجمالي المنتجات" value={catalog?.items.length ?? 0} color="#f97316"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>} />
            <StatCard label="التصنيفات" value={catalog?.categories.length ?? 0} color="#8b5cf6"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>} />
            <StatCard label="المنتجات المتاحة" value={availableItems} color="#22c55e"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          {/* Business info card */}
          {site && (
            <div className="rounded-2xl p-6"
              style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-bold text-white mb-5 text-base">معلومات المشروع</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'اسم المشروع', value: site.businessName },
                  { label: 'رقم واتساب', value: site.whatsappNumber },
                  { label: 'العنوان', value: site.address },
                  { label: 'ساعات العمل', value: site.workingHours },
                ].map((row) => row.value && (
                  <div key={row.label} className="flex flex-col gap-1">
                    <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/admin/catalog', label: 'إدارة الكتالوج', desc: 'أضف وعدّل التصنيفات والمنتجات', color: '#f97316' },
              { href: '/admin/settings', label: 'الإعدادات', desc: 'عدّل بيانات المشروع والألوان', color: '#8b5cf6' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
                style={{ background: '#111120', border: `1px solid rgba(255,255,255,0.06)`, textDecoration: 'none' }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: `${link.color}20`, border: `1px solid ${link.color}30` }} />
                <div>
                  <p className="font-bold text-white text-sm">{link.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{link.desc}</p>
                </div>
                <svg className="w-4 h-4 ms-auto flex-shrink-0" style={{ color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
