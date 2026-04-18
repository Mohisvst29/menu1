import type { Metadata } from 'next';
import { Cairo, Tajawal, Almarai, Readex_Pro } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import ThemeManager from '@/components/ThemeManager';
import ThemeToggle from '@/components/ThemeToggle';
import OffersPopup from '@/components/public/OffersPopup';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

const readex = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Digital Catalog',
  description: 'Modern digital catalog for any business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${tajawal.variable} ${almarai.variable} ${readex.variable} font-cairo antialiased`} suppressHydrationWarning>
        <ThemeManager />
        <ThemeToggle />
        <OffersPopup />
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
