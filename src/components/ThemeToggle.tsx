'use client';

import { useState, useEffect } from 'react';
import { toggleTheme } from './ThemeManager';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setMounted(true);
    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
      setTheme(current || 'dark');
    };
    
    updateTheme();
    
    // Observer for attribute changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
      style={{ 
        background: 'var(--card-bg)', 
        border: '1px solid var(--border)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        color: 'var(--primary)'
      }}
      title="تغيير وضع العرض"
    >
      {theme === 'dark' ? (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
