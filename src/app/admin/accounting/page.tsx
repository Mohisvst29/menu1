'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import type { Order, SiteConfig } from '@/types';

export default function AccountingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/site').then(r => r.json()),
    ]).then(([ordersData, siteData]) => {
      setOrders(ordersData);
      setSite(siteData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080810]">
        <div className="w-8 h-8 border-2 border-t-transparent border-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stats
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Group by day for latest 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chartData: {day: string, count: number, rev: number}[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = completedOrders.filter(o => o.date.startsWith(dateStr));
    const dayRev = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    chartData.push({ day: dateStr, count: dayOrders.length, rev: dayRev });
  }

  const handlePrintReport = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const reportHtml = `
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير مبيعات - ${site?.businessName || 'المتجر'}</title>
          <style>
            body { font-family: Tahoma, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #EEE; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-height: 80px; }
            .business-info h1 { margin: 0; font-size: 24px; color: #000; }
            .stats-grid { display: grid; grid-cols: 2; gap: 20px; margin-bottom: 40px; }
            .stat-card { border: 1px solid #EEE; padding: 20px; border-radius: 10px; background: #F9F9F9; }
            .stat-label { font-size: 14px; color: #666; margin-bottom: 5px; }
            .stat-value { font-size: 20px; font-weight: bold; color: #f97316; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #EEE; padding: 12px; text-align: center; }
            th { background: #F1F1F1; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #EEE; padding-top: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="business-info">
              <h1>تقرير الأداء والمبيعات</h1>
              <p>${site?.businessName || ''}</p>
              <p style="font-size: 12px; color: #777;">تاريخ التقرير: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            ${site?.logo ? `<img src="${site.logo}" class="logo" />` : ''}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div class="stat-card">
              <div class="stat-label">إجمالي الإيرادات المحققة</div>
              <div class="stat-value">${totalRevenue.toFixed(2)} ر.س</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">إجمالي عدد الطلبات المكتملة</div>
              <div class="stat-value">${completedOrders.length} طلب</div>
            </div>
          </div>

          <h3>إحصائيات آخر 7 أيام</h3>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>عدد الطلبات</th>
                <th>المبيعات (ر.س)</th>
              </tr>
            </thead>
            <tbody>
              ${chartData.map(d => `
                <tr>
                  <td>${d.day}</td>
                  <td>${d.count}</td>
                  <td>${d.rev.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            تم استخراج هذا التقرير آلياً من نظام الإدارة السحابي لـ ${site?.businessName || ''}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    w.document.write(reportHtml);
    w.document.close();
  };

  const handleDownloadBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      site: site,
      orders: orders
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl" style={{ fontFamily: 'var(--font-cairo, sans-serif)', color: '#f1f5f9', background: '#080810' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b bg-[#080810] border-white/5">
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">النظام المحاسبي والتقارير</h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>متابعة المبيعات والإيرادات للموقع السحابي</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              طباعة التقرير
            </button>
            <button 
              onClick={handleDownloadBackup}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              نسخة احتياطية
            </button>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Main Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-1 h-full bg-green-500" />
              <p className="text-sm text-gray-400 mb-1">إجمالي الإيرادات (مكتمل)</p>
              <h2 className="text-3xl font-black text-white">{totalRevenue.toFixed(2)} <span className="text-lg font-normal text-gray-500">ر.س</span></h2>
            </div>
            
            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-1 h-full bg-blue-500" />
              <p className="text-sm text-gray-400 mb-1">الطلبات المكتملة</p>
              <h2 className="text-3xl font-black text-white">{completedOrders.length} <span className="text-lg font-normal text-gray-500">طلب</span></h2>
            </div>

            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-1 h-full bg-orange-500" />
              <p className="text-sm text-gray-400 mb-1">الطلبات النشطة</p>
              <h2 className="text-3xl font-black text-white">{activeOrders.length} <span className="text-lg font-normal text-gray-500">طلب</span></h2>
            </div>

            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-1 h-full bg-red-500" />
              <p className="text-sm text-gray-400 mb-1">الطلبات الملغية</p>
              <h2 className="text-3xl font-black text-white">{cancelledOrders.length} <span className="text-lg font-normal text-gray-500">طلب</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-white/5 pb-3">أرباح آخر 7 أيام</h3>
              <div className="flex items-end h-48 gap-2">
                {chartData.map((d, i) => {
                  const maxRev = Math.max(...chartData.map(c => c.rev), 1);
                  const h = (d.rev / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                      <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{d.rev}</span>
                      <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm" style={{ height: `${h}%`, minHeight: '4px' }} />
                      <span className="text-[10px] text-gray-400 truncate">{d.day.substring(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111120] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-white/5 pb-3">الإحصائيات العامة</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl">
                  <span className="text-gray-400">إجمالي الطلبات</span>
                  <span className="font-bold text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl">
                  <span className="text-gray-400">متوسط قيمة الطلب</span>
                  <span className="font-bold text-white">{completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(2) : '0.00'} ر.س</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl">
                  <span className="text-gray-400">الطلبات المحلية</span>
                  <span className="font-bold text-white">{orders.filter(o => o.customer.type === 'dineIn').length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl">
                  <span className="text-gray-400">طلبات التوصيل</span>
                  <span className="font-bold text-white">{orders.filter(o => o.customer.type !== 'dineIn').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
