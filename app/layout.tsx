import './globals.css';
import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { CookieConsentProvider } from '@/lib/cookie-consent-context';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CookieBanner } from '@/components/gdpr/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const BASE_URL = 'https://www.igs-glass.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'IGS Glass — Bespoke Architectural Glass & Rooflights, Sheffield',
    template: '%s | IGS Glass',
  },
  description:
    'IGS Glass Ltd manufactures bespoke structural glass, facades, and premium fixed rooflights for exceptional architectural projects. UK family business, Sheffield-made.',
  keywords: [
    'rooflights', 'skylights', 'flat rooflights', 'architectural glass',
    'structural glass', 'bespoke glazing', 'glass facades', 'Sheffield',
    'UK manufactured', 'fixed rooflights', 'laminated glass', 'toughened glass',
  ],
  authors: [{ name: 'IGS Glass Ltd', url: BASE_URL }],
  creator: 'IGS Glass Ltd',
  publisher: 'IGS Glass Ltd',
  category: 'construction',
  other: {
    'powered-by': 'Managewise',
    'powered-by-url': 'https://managewise.app',
  },
  openGraph: {
    title: 'IGS Glass — Bespoke Architectural Glass & Rooflights',
    description:
      'Structural glass, facades and bespoke glazing solutions manufactured for exceptional architectural projects. UK family business based in Sheffield.',
    url: BASE_URL,
    siteName: 'IGS Glass',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IGS Glass — Bespoke Architectural Glass & Rooflights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGS Glass — Bespoke Architectural Glass & Rooflights',
    description:
      'Structural glass, facades and bespoke glazing solutions manufactured for exceptional architectural projects.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${anton.variable}`}>
      <body className="font-sans bg-white text-[#050505] antialiased">
        <CookieConsentProvider>
          <AuthProvider>
            <CartProvider>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartDrawer />
              <CookieBanner />
            </CartProvider>
          </AuthProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
