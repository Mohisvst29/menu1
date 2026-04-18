'use client';

import { useState, useRef, useCallback } from 'react';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function VideoUpload({ value, onChange, label = 'فيديو', folder = 'uploads' }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    // Vercel limit is 4.5MB
    if (file.size > 4.4 * 1024 * 1024) {
      alert('عذراً، حجم الملف كبير جداً. السيرفر يدعم حتى 4.4MB فقط. الفيديوهات الكبيرة يرجى رفعها برابط خارجي.');
      return;
    }
    setUploading(true);
    try {
      console.log('Starting upload for:', file.name);

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error(`خطأ في السيرفر: ${res.status}`);
      }

      if (data.url) {
        console.log('Video uploaded successfully');
        onChange(data.url);
      } else {
        console.error('Upload API returned error:', data.error);
        alert('فشل رفع الفيديو: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (err: any) {
      console.error('Upload catch block:', err);
      alert('فشل رفع الفيديو. بسبب قيود الاستضافة، إذا كان الفيديو كبيراً الرجاء استخدام رابط خارجي.');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkValue.trim()) {
      onChange(linkValue.trim());
      setShowLinkInput(false);
      setLinkValue('');
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium" style={{ color: '#d1d5db' }}>{label}</label>
          {!value && (
            <button 
              type="button" 
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="text-xs transition-colors hover:text-white"
              style={{ color: '#f97316' }}
            >
              {showLinkInput ? 'إلغاء الرابط' : 'أو إضافة رابط خارجي 🔗'}
            </button>
          )}
        </div>
      )}

      {showLinkInput && !value ? (
        <form onSubmit={handleLinkSubmit} className="flex gap-2">
          <input
            type="url"
            placeholder="مثال: https://example.com/video.mp4"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
            required
            dir="ltr"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ background: '#f97316' }}
          >
            حفظ
          </button>
        </form>
      ) : (
        <div
          onClick={() => { if (!value) inputRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden"
          style={{
            borderColor: drag ? '#f97316' : 'rgba(255,255,255,0.12)',
            background: drag ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.03)',
            minHeight: value ? 'auto' : '140px',
            cursor: value ? 'default' : 'pointer'
          }}
        >
          {value ? (
            <div className="relative w-full">
              <video src={value} controls className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(''); setShowLinkInput(false); }}
                className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
                title="إزالة"
              >✕</button>
            </div>
          ) : (
            <div className="py-8 text-center px-4">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                  style={{ borderColor: '#f97316', borderTopColor: 'transparent' }} />
              ) : (
                <svg className="w-10 h-10 mx-auto mb-3" style={{ color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                {uploading ? 'جاري الرفع...' : 'اسحب فيديو أو انقر للتحميل'}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs" style={{ color: '#6b7280' }}>MP4, WEBM — الحد الأقصى 4.4MB</p>
                <p className="text-[10px]" style={{ color: '#f87171' }}>* للملفات الكبيرة: استخدم زر "إضافة رابط خارجي"</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        disabled={uploading}
      />
    </div>
  );
}
