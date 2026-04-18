'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import type { Order } from '@/types';

const STATUS_LABELS = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-500' },
  preparing: { label: 'قيد التجهيز', color: 'bg-blue-500' },
  ready: { label: 'جاهز للاستلام/التوصيل', color: 'bg-purple-500' },
  delivered: { label: 'مكتمل (تم التسليم)', color: 'bg-green-500' },
  cancelled: { label: 'ملغي', color: 'bg-red-500' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds for new orders
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchOrders();
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080810]">
        <div className="w-8 h-8 border-2 border-t-transparent border-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b bg-[#080810] border-white/5">
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="font-black text-white text-lg">الطلبات الحديثة</h1>
          </div>
          <button onClick={fetchOrders} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl font-bold mb-2">لا توجد طلبات حتى الآن</p>
              <p className="text-sm">ستظهر الطلبات الجديدة هنا فور تقديم العملاء لها.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-[#111120] border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-bold text-white">{order.id}</h2>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${STATUS_LABELS[order.status]?.color || 'bg-gray-500'}`}>
                            {STATUS_LABELS[order.status]?.label || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{new Date(order.date).toLocaleString('ar-SA')}</p>
                      </div>
                      <div className="text-xl font-black text-orange-500">{order.totalAmount.toFixed(2)} ر.س</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">اسم العميل</p>
                        <p className="font-semibold">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">رقم الجوال</p>
                        <a href={`https://wa.me/${order.customer.phone}`} target="_blank" className="font-semibold text-blue-400 hover:underline" dir="ltr">
                          {order.customer.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">نوع الطلب</p>
                        <p className="font-semibold text-orange-400">
                          {order.customer.type === 'dineIn' ? 'محلي 🍽️' : 'سفري / توصيل 🛵'}
                        </p>
                      </div>
                      {order.customer.type === 'dineIn' ? (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">رقم الطاولة</p>
                          <p className="font-black text-lg text-white">{order.customer.tableNum}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">العنوان</p>
                          <p>{order.customer.address || '-'}</p>
                        </div>
                      )}
                      {order.customer.notes && (
                        <div className="col-span-2">
                          <p className="text-gray-500 text-xs mb-1">ملاحظات</p>
                          <p className="text-gray-300 bg-black/40 p-2 rounded-lg">{order.customer.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items & Actions */}
                  <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-s border-white/5 pt-4 md:pt-0 md:ps-6">
                    <div>
                      <p className="text-sm font-bold mb-3 text-gray-300">المنتجات ({order.items.length})</p>
                      <ul className="space-y-2 mb-6">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <span className="text-gray-400"><span className="text-white font-bold">{item.quantity}x</span> {item.title}</span>
                            <span className="text-gray-400">{item.price ? item.price + ' ر.س' : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 mb-2">تحديث حالة الطلب:</p>
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm outline-none cursor-pointer disabled:opacity-50"
                      >
                        {Object.entries(STATUS_LABELS).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={() => {
                          const w = window.open('', '_blank');
                          if(!w) return;
                          w.document.write(`
                            <html dir="rtl" lang="ar">
                              <head>
                                <title>Receipt ${order.id}</title>
                                <style>
                                  body { font-family: Tahoma, Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; color: #000; }
                                  .text-center { text-align: center; }
                                  .font-bold { font-weight: bold; }
                                  .mb { margin-bottom: 10px; }
                                  .mt { margin-top: 20px; }
                                  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                                  th, td { padding: 8px 0; border-bottom: 1px dashed #ccc; text-align: right; font-size: 14px; }
                                  th { text-align: right; }
                                  .total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
                                  .customer-info { margin-top: 15px; font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
                                  .customer-info div { margin-bottom: 5px; }
                                  @media print { body { padding: 0; } }
                                </style>
                              </head>
                              <body>
                                <h2 class="text-center mb">فاتورة طلب</h2>
                                <div class="text-center font-bold mb">رقم الطلب: ${order.id}</div>
                                <div class="text-center font-bold mb" style="font-size: 12px; color: #555;">التاريخ: ${new Date(order.date).toLocaleString('ar-SA')}</div>
                                
                                <div class="customer-info">
                                  <div><b>العميل:</b> ${order.customer.name}</div>
                                  <div><b>الجوال:</b> ${order.customer.phone}</div>
                                  <div><b>النوع:</b> ${order.customer.type === 'dineIn' ? 'محلي' : 'سفري'}</div>
                                  ${order.customer.type === 'dineIn' ? `<div><b>الطاولة:</b> ${order.customer.tableNum}</div>` : `<div><b>العنوان:</b> ${order.customer.address || '-'}</div>`}
                                </div>

                                <table>
                                  <thead>
                                    <tr>
                                      <th>المنتج</th>
                                      <th style="text-align: left;">السعر</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${order.items.map(i => `
                                      <tr>
                                        <td>${i.quantity}x ${i.title}</td>
                                        <td style="text-align: left;">${i.price || '0'} ر.س</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                                
                                <div class="total text-center">المجموع: ${order.totalAmount.toFixed(2)} ر.س</div>
                                
                                <div class="text-center mt font-bold">شكراً لطلبكم!</div>
                                <script>window.print(); setTimeout(()=>window.close(), 500);</script>
                              </body>
                            </html>
                          `);
                          w.document.close();
                        }}
                        className="w-full mt-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        طباعة الفاتورة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
