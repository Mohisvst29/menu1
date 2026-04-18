'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';

export default function TablesQR() {
  const [tablesCount, setTablesCount] = useState(1);
  const [tables, setTables] = useState<number[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const generateQRs = () => {
    const list = [];
    for (let i = 1; i <= Math.min(tablesCount, 100); i++) {
      list.push(i);
    }
    setTables(list);
  };

  const handlePrint = () => {
    window.print();
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
            <h1 className="text-xl font-bold text-white">مولد رموز QR للطاولات</h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>قم بتوليد رموز استجابة سريعة (QR Codes) لطباعتها ووضعها على الطاولات الدائمة</p>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-6">

      <div className="p-6 rounded-2xl print:hidden" style={{ background: '#11111a', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-end gap-4 max-w-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">عدد الطاولات في المطعم / المقهى</label>
            <input
              type="number"
              min="1"
              max="100"
              value={tablesCount}
              onChange={(e) => setTablesCount(Number(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-black border text-white transition-colors outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <button
            onClick={generateQRs}
            className="px-6 py-3 rounded-xl text-white font-medium bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            توليد
          </button>
        </div>

        {tables.length > 0 && (
          <div className="mt-4 pt-4 border-t flex justify-end" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <button
              onClick={handlePrint}
              className="px-6 py-2 rounded-xl text-black font-medium bg-white hover:bg-gray-200 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              طباعة الرموز
            </button>
          </div>
        )}
      </div>

      {tables.length > 0 && baseUrl && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 print:grid-cols-3 print:gap-10">
          {tables.map((t) => {
            const url = `${baseUrl}?table=${t}`;
            const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
            return (
              <div key={t} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm print:break-inside-avoid print:border print:border-gray-300">
                <span className="font-bold text-xl mb-4 text-black border-b-2 border-black pb-1 px-4">طاولة {t}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc} alt={`Table ${t} QR Code`} className="w-40 h-40 max-w-full" />
                <span className="text-gray-500 text-xs mt-3 select-all truncate w-full text-center" dir="ltr">{url}</span>
                <span className="text-xs font-bold text-orange-500 uppercase mt-1 print:hidden cursor-pointer hover:underline" onClick={() => {
                     const link = document.createElement('a');
                     link.download = `table_${t}_qr.png`;
                     link.href = qrSrc;
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                }}>تنزيل الصورة</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Global CSS to fix print layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          aside, nav, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          @page { margin: 1cm; }
        }
      `}} />
        </div>
      </div>
    </div>
  );
}
