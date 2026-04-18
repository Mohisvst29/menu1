'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Category, Item, ItemsData } from '@/types';

const EMPTY_ITEM: Omit<Item, 'id'> = {
  categoryId: '',
  title: '',
  description: '',
  price: '',
  image: '',
  extraInfoLabel: '',
  extraInfoValue: '',
  badge: '',
  isAvailable: true,
  isPopular: false,
};

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

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className="relative w-10 h-6 rounded-full transition-colors"
        style={{ background: checked ? '#f97316' : 'rgba(255,255,255,0.1)' }}>
        <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? '22px' : '4px' }} />
      </div>
      <span className="text-sm" style={{ color: '#d1d5db' }}>{label}</span>
    </label>
  );
}

export default function CatalogPage() {
  const router = useRouter();
  const [data, setData] = useState<ItemsData>({ categories: [], items: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<'categories' | 'items'>('items');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Item modal
  const [itemModal, setItemModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState<Omit<Item, 'id'>>(EMPTY_ITEM);

  // Category modal
  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: '', icon: '', order: 1 });

  // Filter
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) { router.replace('/admin/login'); return; }
    fetch('/api/items').then((r) => r.json()).then(setData);
  }, [router]);

  const saveData = async (newData: ItemsData) => {
    setSaving(true);
    try {
      await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // ─── Items ───
  const openAddItem = () => {
    setEditItem(null);
    setItemForm({ ...EMPTY_ITEM, categoryId: data.categories[0]?.id || '' });
    setItemModal(true);
  };

  const openEditItem = (item: Item) => {
    setEditItem(item);
    setItemForm({ ...item });
    setItemModal(true);
  };

  const saveItem = () => {
    if (!itemForm.title) return;
    let newItems: Item[];
    if (editItem) {
      newItems = data.items.map((i) => i.id === editItem.id ? { ...itemForm, id: editItem.id } : i);
    } else {
      newItems = [...data.items, { ...itemForm, id: `item-${Date.now()}` }];
    }
    const newData = { ...data, items: newItems };
    setData(newData);
    saveData(newData);
    setItemModal(false);
  };

  const deleteItem = (id: string) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    const newData = { ...data, items: data.items.filter((i) => i.id !== id) };
    setData(newData);
    saveData(newData);
  };

  const toggleAvailable = (id: string) => {
    const newData = { ...data, items: data.items.map((i) => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i) };
    setData(newData);
    saveData(newData);
  };

  // ─── Categories ───
  const openAddCat = () => {
    setEditCat(null);
    setCatForm({ name: '', icon: '', order: (data.categories.length + 1) });
    setCatModal(true);
  };

  const openEditCat = (cat: Category) => {
    setEditCat(cat);
    setCatForm({ name: cat.name, icon: cat.icon, order: cat.order });
    setCatModal(true);
  };

  const saveCat = () => {
    if (!catForm.name) return;
    let newCats: Category[];
    if (editCat) {
      newCats = data.categories.map((c) => c.id === editCat.id ? { ...c, ...catForm } : c);
    } else {
      newCats = [...data.categories, { ...catForm, id: `cat-${Date.now()}` }];
    }
    const newData = { ...data, categories: newCats };
    setData(newData);
    saveData(newData);
    setCatModal(false);
  };

  const deleteCat = (id: string) => {
    if (!confirm('هل تريد حذف هذا التصنيف وكل منتجاته؟')) return;
    const newData = {
      categories: data.categories.filter((c) => c.id !== id),
      items: data.items.filter((i) => i.categoryId !== id),
    };
    setData(newData);
    saveData(newData);
  };

  const filteredItems = filterCat === 'all' ? data.items : data.items.filter((i) => i.categoryId === filterCat);

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
          <h1 className="font-black text-white text-lg flex-1">إدارة الكتالوج</h1>
          {saved && <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">✅ تم الحفظ</span>}
        </div>

        <div className="p-6 space-y-6">
          {/* Tab switcher */}
          <div className="flex gap-2 p-1 rounded-xl max-w-xs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['items', 'categories'] as const).map((t) => (
              <button key={t} onClick={() => setView(t)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                style={{ background: view === t ? '#f97316' : 'transparent', color: view === t ? 'white' : '#9ca3af' }}>
                {t === 'items' ? `المنتجات (${data.items.length})` : `التصنيفات (${data.categories.length})`}
              </button>
            ))}
          </div>

          {/* ── ITEMS VIEW ── */}
          {view === 'items' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter by category */}
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}>
                  <option value="all">كل التصنيفات</option>
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button onClick={openAddItem}
                  className="ms-auto px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                  <span className="text-lg leading-none">+</span> إضافة منتج
                </button>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-4xl mb-3">📦</p>
                  <p style={{ color: '#6b7280' }}>لا توجد منتجات بعد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredItems.map((item) => {
                    const cat = data.categories.find((c) => c.id === item.categoryId);
                    return (
                      <div key={item.id} className="rounded-2xl overflow-hidden"
                        style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)', opacity: item.isAvailable ? 1 : 0.6 }}>
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                        ) : (
                          <div className="w-full h-36 flex items-center justify-center" style={{ background: '#0f0f1a' }}>
                            <span className="text-3xl opacity-30">🍽️</span>
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-bold text-sm flex-1">{item.title}</span>
                            {item.badge && (
                              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: item.badge === 'new' ? '#3b82f620' : '#f9731620', color: item.badge === 'new' ? '#60a5fa' : '#fb923c' }}>
                                {item.badge === 'new' ? 'جديد' : '🔥 مميز'}
                              </span>
                            )}
                          </div>
                          {item.price && (
                            <p className="text-sm font-bold mb-1" style={{ color: '#f97316' }}>{item.price} ر.س</p>
                          )}
                          {cat && <p className="text-xs mb-3" style={{ color: '#6b7280' }}>{cat.icon} {cat.name}</p>}

                          <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <Toggle checked={item.isAvailable !== false} onChange={() => toggleAvailable(item.id)} label="" />
                            <span className="text-xs flex-1" style={{ color: '#6b7280' }}>
                              {item.isAvailable !== false ? 'متاح' : 'غير متاح'}
                            </span>
                            <button onClick={() => openEditItem(item)} className="text-xs px-3 py-1.5 rounded-lg transition-all"
                              style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
                              تعديل
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="text-xs px-3 py-1.5 rounded-lg transition-all"
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CATEGORIES VIEW ── */}
          {view === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={openAddCat}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                  <span className="text-lg leading-none">+</span> إضافة تصنيف
                </button>
              </div>

              {data.categories.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-4xl mb-3">📂</p>
                  <p style={{ color: '#6b7280' }}>لا توجد تصنيفات بعد</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...data.categories].sort((a, b) => a.order - b.order).map((cat) => {
                    const count = data.items.filter((i) => i.categoryId === cat.id).length;
                    return (
                      <div key={cat.id} className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                        style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-2xl w-8 h-8 flex items-center justify-center">
                          {cat.icon?.startsWith('http') || cat.icon?.startsWith('data:') || cat.icon?.startsWith('/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain rounded-md" />
                          ) : (
                            cat.icon
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-white">{cat.name}</p>
                          <p className="text-xs" style={{ color: '#6b7280' }}>{count} منتج</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditCat(cat)} className="text-xs px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
                            تعديل
                          </button>
                          <button onClick={() => deleteCat(cat.id)} className="text-xs px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── ITEM MODAL ── */}
      {itemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)' }} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-base">{editItem ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setItemModal(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="اسم المنتج *">
                <input className={inputCls} style={inputStyle} value={itemForm.title}
                  onChange={(e) => setItemForm((p) => ({ ...p, title: e.target.value }))} />
              </Field>

              <Field label="التصنيف">
                <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={itemForm.categoryId}
                  onChange={(e) => setItemForm((p) => ({ ...p, categoryId: e.target.value }))}>
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="السعر (اختياري)">
                <input className={inputCls} style={inputStyle} value={itemForm.price} dir="ltr"
                  onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))} placeholder="15" />
              </Field>

              <Field label="الشارة">
                <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={itemForm.badge}
                  onChange={(e) => setItemForm((p) => ({ ...p, badge: e.target.value as '' | 'new' | 'popular' | 'offer' }))}>
                  <option value="">بدون شارة</option>
                  <option value="new">جديد</option>
                  <option value="popular">الأكثر طلباً</option>
                  <option value="offer">عرض خاص 🏷️</option>
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field label="الوصف">
                  <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }} rows={2} value={itemForm.description}
                    onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))} />
                </Field>
              </div>

              <Field label="تسمية المعلومة الإضافية">
                <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={itemForm.extraInfoLabel}
                  onChange={(e) => setItemForm((p) => ({ ...p, extraInfoLabel: e.target.value }))}>
                  <option value="">بدون معلومة إضافية</option>
                  <option value="الحجم">الحجم (Size)</option>
                  <option value="السعرات الحرارية">السعرات الحرارية (Calories)</option>
                  <option value="الوزن">الوزن (Weight)</option>
                  <option value="الكمية">الكمية (Quantity)</option>
                  <option value="عدد القطع">عدد القطع (Pieces)</option>
                  <option value="الملاحظات">الملاحظات (Notes)</option>
                  <option value="درجة الحرارة">درجة الحرارة (Temp)</option>
                  {!["", "الحجم", "السعرات الحرارية", "الوزن", "الكمية", "عدد القطع", "الملاحظات", "درجة الحرارة"].includes(itemForm.extraInfoLabel) && (
                    <option value={itemForm.extraInfoLabel}>{itemForm.extraInfoLabel}</option>
                  )}
                </select>
              </Field>

              <Field label="قيمة المعلومة الإضافية">
                <input className={inputCls} style={inputStyle} value={itemForm.extraInfoValue} placeholder="مثال: 250 مل أو 120 سعرة"
                  onChange={(e) => setItemForm((p) => ({ ...p, extraInfoValue: e.target.value }))} />
              </Field>

              <div className="flex items-center gap-6 sm:col-span-2">
                <Toggle checked={itemForm.isAvailable} onChange={(v) => setItemForm((p) => ({ ...p, isAvailable: v }))} label="متاح للطلب" />
                <Toggle checked={itemForm.isPopular} onChange={(v) => setItemForm((p) => ({ ...p, isPopular: v }))} label="الأكثر طلباً" />
              </div>

              <div className="sm:col-span-2">
                <ImageUpload label="صورة المنتج" value={itemForm.image}
                  onChange={(url) => setItemForm((p) => ({ ...p, image: url }))} folder="uploads" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={saveItem}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                {editItem ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
              <button onClick={() => setItemModal(false)}
                className="px-6 py-3 rounded-xl font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORY MODAL ── */}
      {catModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)' }} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-base">{editCat ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h2>
              <button onClick={() => setCatModal(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>

            <div className="space-y-4">
              <Field label="اسم التصنيف *">
                <input className={inputCls} style={inputStyle} value={catForm.name}
                  onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium" style={{ color: '#9ca3af' }}>الأيقونة (إيموجي) أو (صورة صغيرة)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input className={inputCls} style={inputStyle} value={catForm.icon} placeholder="مثال: ☕ أو رابط صورة"
                      onChange={(e) => setCatForm((p) => ({ ...p, icon: e.target.value }))} />
                  </div>
                  <div className="w-10 overflow-hidden relative">
                    <ImageUpload label="" value="" onChange={(url) => setCatForm((p) => ({ ...p, icon: url }))} folder="categories" />
                  </div>
                </div>
              </div>
              <Field label="الترتيب">
                <input type="number" className={inputCls} style={inputStyle} value={catForm.order} min={1}
                  onChange={(e) => setCatForm((p) => ({ ...p, order: Number(e.target.value) }))} />
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={saveCat}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                {editCat ? 'حفظ' : 'إضافة'}
              </button>
              <button onClick={() => setCatModal(false)}
                className="px-5 py-3 rounded-xl font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
