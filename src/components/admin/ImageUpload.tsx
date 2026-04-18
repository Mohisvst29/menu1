'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUpload({ value, onChange, label = 'صورة', folder = 'uploads' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      console.log('Starting compression and upload for:', file.name);
      const compressedBlob = await compressImage(file);
      console.log('Compressed size:', compressedBlob.size, 'Original size:', file.size);

      const fd = new FormData();
      fd.append('file', compressedBlob, 'image.jpg');
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
        console.log('Image uploaded successfully');
        onChange(data.url);
      } else {
        console.error('Upload API returned error:', data.error);
        alert('فشل رفع الصورة: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (err: any) {
      console.error('Upload catch block:', err);
      alert('فشل رفع الصورة: ' + err.message);
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

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium" style={{ color: '#d1d5db' }}>{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
        style={{
          borderColor: drag ? '#f97316' : 'rgba(255,255,255,0.12)',
          background: drag ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.03)',
          minHeight: value ? 'auto' : '120px',
        }}
      >
        {value ? (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full max-h-48 object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
            >✕</button>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span className="text-white text-sm font-medium">انقر للتغيير</span>
            </div>
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
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              {uploading ? 'جاري الرفع...' : 'اسحب صورة أو انقر للتحميل'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>PNG, JPG, WEBP — حتى 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
    </div>
  );
}
