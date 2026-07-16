import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 md:px-[70px] py-[58px] border-b border-[#dedede] gap-4">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/IGS_logo.png"
            alt="IGS Innovative Glass Solutions"
            width={100}
            height={100}
            className="h-[52px] w-auto"
          />
        </Link>
        <nav className="flex flex-wrap gap-[22px]">
          {[
            { label: 'About Us', href: '/#about' },
            { label: 'Products', href: '/products' },
            { label: 'Shop Rooflights', href: '/shop-rooflights' },
            { label: 'Gallery', href: '/#gallery' },
            { label: 'Get a Quote', href: '/get-a-quote' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12px] uppercase tracking-[0.15em] text-[#555] hover:text-[#b00000] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Four-column bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-7 md:px-[70px] py-9 bg-[#FAFAF8] text-[14px] text-[#333] leading-[1.5]">
        <div>
          <strong className="block text-[12px] uppercase tracking-[0.2em] text-[#b00000] mb-[10px]">Terms</strong>
          <Link href="/terms-and-conditions" className="hover:text-[#b00000] transition-colors block">Terms and Conditions</Link>
          <Link href="/privacy-policy" className="hover:text-[#b00000] transition-colors block">Privacy Policy</Link>
        </div>
        <div>
          <strong className="block text-[12px] uppercase tracking-[0.2em] text-[#b00000] mb-[10px]">Contact Us</strong>
          <a href="mailto:info@igs-projects.com" className="hover:text-[#b00000] transition-colors block">info@igs-projects.com</a>
          <a href="tel:01895762795" className="hover:text-[#b00000] transition-colors block">01895 762795</a>
        </div>
        <div>
          <strong className="block text-[12px] uppercase tracking-[0.2em] text-[#b00000] mb-[10px]">Social</strong>
          <a href="https://www.instagram.com/igs_london" target="_blank" rel="noopener noreferrer" className="hover:text-[#b00000] transition-colors">Follow us on Instagram</a>
        </div>
        <div>
          <strong className="block text-[12px] uppercase tracking-[0.2em] text-[#b00000] mb-[10px]">IGS</strong>
          <p>Innovative Glass Solutions</p>
        </div>
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-center px-7 md:px-[70px] py-5 bg-[#FAFAF8] border-t border-[#dedede]">
        <a
          href="https://managewise.app"
          target="_blank"
          rel="noopener noreferrer follow"
          className="text-[11px] uppercase tracking-[0.2em] text-[#999] hover:text-[#555] transition-colors"
        >
          Powered by Managewise
        </a>
      </div>
    </footer>
  );
}
