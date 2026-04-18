'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('admin_auth', 'true');
        router.push('/admin');
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #0f0f1f 50%, #080810 100%)' }}>

      {/* Glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: '#f97316' }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: '#8b5cf6' }} />

      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Digital Catalog Admin</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}>
          <form onSubmit={handleLogin} className="space-y-5" dir="rtl">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@catalog.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f1f5f9',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f1f5f9',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all"
              style={{
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #f97316, #fb923c)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '...جاري الدخول' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#4b5563' }}>
          الإيميل الافتراضي: admin@catalog.com · كلمة المرور: admin123
        </p>
      </div>
    </div>
  );
}
