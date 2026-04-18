import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة التحكم',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#080810', color: '#f1f5f9' }}>
      {children}
    </div>
  );
}
