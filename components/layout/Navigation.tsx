'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

const NAV_LINKS = [
  { label: 'About Us', href: '/#about' },
  { label: 'Products', href: '/products' },
  { label: 'Shop Rooflights', href: '/shop-rooflights' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Get a Quote', href: '/get-a-quote' },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#dedede]">
        <div className="flex items-center justify-between px-7 md:px-[56px] h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/IGS_logo.png"
              alt="IGS Innovative Glass Solutions"
              width={72}
              height={72}
              className="h-[52px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-[34px]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium uppercase tracking-[0.22em] transition-colors duration-[250ms] relative ${
                  pathname === link.href.split('#')[0] && !link.href.includes('#')
                    ? 'text-[#050505]'
                    : 'text-[#b00000] hover:text-[#050505]'
                } ${link.label === 'Get a Quote' ? 'after:absolute after:left-0 after:bottom-[-9px] after:h-[1px] after:bg-[#b00000] after:w-0 hover:after:w-full after:transition-all after:duration-300' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Basket + Account */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={isAuthenticated ? '/account' : '/sign-in'}
              className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#777] hover:text-[#050505] transition-colors"
            >
              {isAuthenticated ? user?.firstName : 'Account'}
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#265954] hover:text-[#3B8A82] transition-colors"
              >
                Admin
              </Link>
            )}
            <button
              onClick={openCart}
              className="text-[15px] font-medium uppercase tracking-[0.22em] text-[#b00000] hover:text-[#050505] transition-colors"
              aria-label="Open basket"
            >
              Basket{itemCount > 0 && <span className="font-black"> ({itemCount})</span>}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="md:hidden p-2 text-[#050505]"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-[#dedede] shadow-xl"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-7 py-4 text-[12px] uppercase tracking-[0.2em] font-normal text-[#b00000] hover:text-[#050505] border-b border-[#f0f0f0] last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={openCart}
                className="text-left px-7 py-4 text-[12px] uppercase tracking-[0.2em] font-normal text-[#b00000] hover:text-[#050505] border-b border-[#f0f0f0] transition-colors"
              >
                Basket{itemCount > 0 ? ` (${itemCount})` : ''}
              </button>
              <Link
                href={isAuthenticated ? '/account' : '/sign-in'}
                className="block px-7 py-4 text-[12px] uppercase tracking-[0.2em] font-normal text-[#777] hover:text-[#050505] transition-colors"
              >
                {isAuthenticated ? `My Account (${user?.firstName})` : 'Sign In / Register'}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
