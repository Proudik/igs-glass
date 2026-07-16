'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="min-h-[88vh] grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
      {/* Left */}
      <div className="relative flex flex-col justify-center px-8 md:px-[70px] pt-32 pb-16 lg:pt-[88px] lg:pb-[88px] border-b lg:border-b-0 lg:border-r border-[#dedede] overflow-hidden">

        {/* Light ray — one-shot on load, clipped by overflow-hidden as it exits toward the photo */}
        <motion.div
          aria-hidden="true"
          initial={{ x: -320, rotate: -22 }}
          animate={{ x: 1600, rotate: -22 }}
          transition={{ duration: 1.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
          className="absolute pointer-events-none"
          style={{ top: '-50%', left: 0, width: 72, height: '240%', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)' }}
        />
        <motion.div
          aria-hidden="true"
          initial={{ x: -400, rotate: -22 }}
          animate={{ x: 1600, rotate: -22 }}
          transition={{ duration: 1.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.88 }}
          className="absolute pointer-events-none"
          style={{ top: '-50%', left: 0, width: 200, height: '240%', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.02) 70%, transparent 100%)' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9"
        >
          BESPOKE ARCHITECTURAL GLASS SPECIALISTS — EST. FAMILY BUSINESS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(60px,7.5vw,140px)] leading-[0.88] tracking-[-0.025em] text-[#050505]"
        >
          LIGHT
          <br />
          <span className="text-outline">THROUGH</span>
          <br />
          GLASS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="text-[clamp(18px,2.2vw,28px)] leading-[1.42] mt-11 max-w-[570px] text-[#333]"
        >
          Structural glass, facades and bespoke glazing solutions manufactured for exceptional architectural projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.4 }}
          className="flex flex-wrap gap-3 mt-10"
        >
          <Link
            href="/shop-rooflights"
            className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
          >
            Shop Rooflights <ArrowRight size={13} />
          </Link>
          <Link
            href="/get-a-quote"
            className="inline-flex items-center gap-2 border border-[#265954] text-[#265954] text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#265954] hover:text-white transition-colors"
          >
            Get a Quote
          </Link>
        </motion.div>
      </div>

      {/* Right — photo + overlay */}
      <div className="relative min-h-[55vw] lg:min-h-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Architectural glass rooflight"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[#050505]/40" />

        {/* Red accent bar */}
        <div className="absolute top-16 right-16 w-[150px] h-[2px] bg-[#b00000]" />

        {/* Abstract outline box */}
        <div className="absolute inset-0 flex items-end p-[60px]">
          <div
            className="relative border-2 border-white/25"
            style={{ width: '68%', paddingBottom: '52%' }}
          >
            <div className="absolute border border-[#265954]" style={{ top: 24, left: 24, right: -24, bottom: -24 }} />
            <div
              className="absolute left-6 bottom-5 font-display leading-none select-none text-[#265954]"
              style={{ fontSize: 72, opacity: 0.9, letterSpacing: '-4px' }}
            >
              IGS
            </div>
          </div>
        </div>

        {/* Vertical text */}
        <div className="absolute right-[42px] bottom-[60px] hidden lg:block">
          <span
            className="text-[11px] uppercase tracking-[0.25em] text-white/60"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            PRECISION / PERFORMANCE / POSSIBILITY
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Statement grid ───────────────────────────────────────────────────────────

function StatementGrid() {
  const statements = [
    {
      strong: 'Oversized Architectural Units',
      copy: 'Specialist large-format glazing manufactured for projects where scale, clarity and visual impact are central to the design.',
    },
    {
      strong: 'Bespoke Glazing Systems',
      copy: 'Tailored glazing solutions developed around your dimensions, specification requirements and architectural intent.',
    },
    {
      strong: 'Manufactured in London. Supplied across the UK and beyond.',
      copy: 'Produced with close control over quality, consistency and communication throughout the manufacturing process.',
    },
    {
      strong: 'Family Run Business',
      copy: 'A hands-on, personal approach that values responsiveness, reliability and attention to detail at every stage.',
    },
    {
      strong: 'Precision Engineered',
      copy: 'Carefully manufactured for projects where technical accuracy, performance and refined finish are essential.',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 border-b border-[#dedede]">
      {statements.map((s, i) => (
        <FadeIn key={i} delay={i * 0.06}>
          <div className={`min-h-[205px] p-[24px] md:p-[30px] flex flex-col justify-between h-full ${i < statements.length - 1 ? 'border-b sm:border-b-0 border-r-0 sm:border-r border-[#dedede]' : ''}`}>
            <strong className="text-[16px] md:text-[18px] font-black leading-[1.1] uppercase tracking-[-0.5px] text-[#050505]">{s.strong}</strong>
            <p className="text-[14px] leading-[1.5] text-[#555] mt-3">{s.copy}</p>
          </div>
        </FadeIn>
      ))}
    </section>
  );
}

// ─── About section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="border-b border-[#dedede]">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        {/* Left col — title */}
        <div className="px-8 md:px-[70px] pt-[90px] pb-[70px] border-b lg:border-b-0 lg:border-r border-[#dedede]">
          <FadeIn>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9">About Us</p>
            <h2 className="font-display text-[clamp(64px,8vw,140px)] leading-[0.88] tracking-[-0.025em] text-[#050505]">
              GLASS WITH
              <br />
              NO <span className="text-outline">LIMITS</span>
            </h2>
          </FadeIn>
        </div>

        {/* Right col — photo */}
        <div className="relative min-h-[320px] lg:min-h-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Modern architectural glass space"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[#050505]/20" />
        </div>
      </div>

      {/* Copy row */}
      <FadeIn delay={0.1}>
        <div className="px-8 md:px-[70px] py-[70px] grid grid-cols-1 md:grid-cols-3 gap-[40px]">
          <p className="text-[19px] leading-[1.65] text-[#333]">
            IGS specialises in oversized, high-performance glass units for architects, builders, contractors and complex residential or commercial projects.
          </p>
          <p className="text-[19px] leading-[1.65] text-[#333]">
            Manufactured in London and supplied across the UK and internationally, our glazing solutions are produced with close attention to detail, reliable lead times and the technical requirements of each project.
          </p>
          <p className="text-[19px] leading-[1.65] text-[#333]">
            As a family-run business, we believe in responsive service, careful communication and long-term relationships built on trust. We manufacture glazing solutions where scale, clarity, structure and detail matter.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ─── Products preview ─────────────────────────────────────────────────────────

const PREVIEW_PRODUCTS = [
  {
    title: 'DOUBLE GLAZED UNITS',
    copy: 'High-performance insulated glass units for residential, commercial and architectural projects. Typical centre-pane U-values from 1.0–1.2 W/m²K, depending on specification.',
    href: '/products/double-glazed-units',
    img: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'TRIPLE GLAZED UNITS',
    copy: 'Premium insulated glazing engineered for excellent thermal performance, comfort and energy efficiency. Typical centre-pane U-values from 0.5–0.7 W/m²K, depending on build-up.',
    href: '/products/triple-glazed-units',
    img: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'OVERSIZED UNITS',
    copy: 'Large-format glazing manufactured for ambitious architecture where scale, clarity and visual impact matter. Engineered to project-specific dimensions and performance requirements.',
    href: '/products/oversized-units',
    img: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'ROOFLIGHTS',
    copy: 'Bespoke rooflight glazing systems designed to maximise daylight and thermal performance. IGS can supply both insulated glass units and supporting frames where required.',
    href: '/products/rooflights',
    img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

function ProductsPreview() {
  return (
    <section id="products" className="border-b border-[#dedede]">
      <div className="px-8 md:px-[70px] pt-[70px] pb-[32px] flex items-end justify-between gap-4 border-b border-[#dedede]">
        <FadeIn>
          <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-4">Our Products</p>
          <h2 className="font-display text-[clamp(52px,7vw,104px)] leading-[0.88] tracking-[-0.025em] text-[#050505]">
            PRODUCTS
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[#b00000] hover:text-[#050505] transition-colors mb-2 font-semibold"
          >
            View All <ArrowRight size={12} />
          </Link>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {PREVIEW_PRODUCTS.map((product, i) => (
          <FadeIn key={product.title} delay={i * 0.07}>
            <Link
              href={product.href}
              className="group relative min-h-[460px] flex flex-col justify-end overflow-hidden"
              style={{
                borderRight: i % 2 === 0 ? '1px solid #dedede' : 'none',
                borderBottom: '1px solid #dedede',
              }}
            >
              {/* Background photo */}
              <img
                src={product.img}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {/* Gradient overlay — strong bottom scrim for guaranteed readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/55 via-50% to-[#050505]/10 transition-all duration-300 group-hover:from-[#0d2e26]/95 group-hover:via-[#0d2e26]/60" />

              {/* Decorative glass pane */}
              <div
                className="absolute opacity-0 group-hover:opacity-[0.12] transition-all duration-300 pointer-events-none border border-white/50"
                style={{
                  top: 28, bottom: 28, right: 28,
                  width: '38%',
                  background: 'linear-gradient(180deg,rgba(255,255,255,.8),rgba(199,218,224,.3))',
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-[48px] pb-[52px]">
                <h3 className="font-display text-[52px] leading-[0.95] text-white mb-4 drop-shadow-sm">
                  {product.title}
                </h3>
                <p className="text-[17px] leading-[1.6] text-white/90 max-w-[520px] transition-colors duration-300">
                  {product.copy}
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors duration-300">View Range</span>
                  <span className="text-white/70 group-hover:text-[#b00000] group-hover:translate-x-2 transition-all duration-300 text-[20px] leading-none">→</span>
                </div>
              </div>

              {/* Red underline bar */}
              <div className="absolute bottom-0 left-0 h-[3px] bg-[#b00000] w-0 group-hover:w-full transition-all duration-500" />
            </Link>
          </FadeIn>
        ))}
      </div>

      <div className="px-8 md:px-[70px] py-6 border-b border-[#dedede] md:hidden">
        <Link href="/products" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[#b00000] font-semibold">
          View All Products <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}

// ─── Precision section ────────────────────────────────────────────────────────

function PrecisionSection() {
  return (
    <section className="border-b border-[#dedede]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left copy */}
        <div className="px-8 md:px-[70px] py-[90px] border-b lg:border-b-0 lg:border-r border-[#dedede]">
          <FadeIn>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9">Our Approach</p>
            <h2 className="font-display text-[clamp(64px,8vw,140px)] leading-[0.88] tracking-[-0.025em] text-[#050505] mb-[48px]">
              BUILT
              <br />
              <span className="text-outline">AROUND</span>
              <br />
              PRECISION
            </h2>
            <div className="space-y-[20px] text-[20px] leading-[1.62] text-[#333] max-w-[580px]">
              <p>With over 20 years of experience in the glass industry, our dedicated team is driven by passion, precision, and professionalism to produce high-quality glass solutions tailored to your needs.</p>
              <p>Our knowledgeable sales team is here to guide you through every step of the process with clarity and transparency, ensuring you find the perfect solution for your project.</p>
              <p>We ensure every unit meets the highest standards of durability, efficiency, and aesthetics. At IGS, we do not just manufacture glass — we create solutions that enhance spaces with elegance and sophistication.</p>
              <p className="text-[#265954] font-semibold">Let&apos;s innovate together.</p>
            </div>
          </FadeIn>
        </div>

        {/* Right — photo + stats */}
        <div className="flex flex-col">
          <div className="relative flex-1 min-h-[360px] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Glass manufacturing precision"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#050505]/25" />
          </div>
          <div className="grid grid-cols-3 border-t border-[#dedede]">
            {[
              { stat: '20+', label: 'Years Experience' },
              { stat: 'UK+', label: 'International Supply' },
              { stat: '100%', label: 'Family Run' },
            ].map((item, i) => (
              <FadeIn key={item.stat} delay={0.1 + i * 0.08}>
                <div className={`p-4 md:p-8 text-center ${i < 2 ? 'border-r border-[#dedede]' : ''}`}>
                  <strong className="block font-display text-[clamp(28px,6vw,52px)] leading-none text-[#050505]">{item.stat}</strong>
                  <span className="text-[10px] md:text-[12px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-[#b00000] mt-2 block leading-tight">{item.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Accreditations ───────────────────────────────────────────────────────────

function Accreditations() {
  const items = ['Brand / Standard', 'Partner Logo', 'Supplier Logo', 'Certification'];

  return (
    <FadeIn>
      <section className="border-b border-[#dedede] grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-[#dedede] px-[42px] py-[34px] flex items-center">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#b00000]">Accreditations &amp; Partners</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item}
              className={`min-h-[120px] bg-[#FAFAF8] flex items-center justify-center p-7 ${i < items.length - 1 ? 'border-r border-[#dedede]' : ''} text-[#aaa] text-[12px] uppercase tracking-[0.2em] text-center`}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery() {
  const items = [
    { label: 'Photo 01', title: 'OVERSIZED UNITS', url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photo 02', title: 'ROOFLIGHTS', url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photo 03', title: 'STRUCTURAL GLASS', url: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photo 04', title: 'LAMINATED UNITS', url: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photo 05', title: 'WALK-ON GLASS', url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photo 06', title: 'BALUSTRADES', url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  return (
    <section id="gallery" className="border-b border-[#dedede]">
      <div className="px-8 md:px-[70px] py-[70px] border-b border-[#dedede]">
        <FadeIn>
          <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-4">Gallery</p>
          <h2 className="font-display text-[clamp(64px,8vw,140px)] leading-[0.88] tracking-[-0.025em] text-[#050505]">
            PHOTO
            <br />
            <span className="text-outline">GALLERY</span>
          </h2>
        </FadeIn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <FadeIn
            key={item.title}
            delay={i * 0.05}
            className="relative group overflow-hidden border-r border-b border-[#dedede]"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-[#050505]/10 to-transparent group-hover:from-[#050505]/80 transition-colors duration-300" />
              <div className="absolute bottom-6 left-6 flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-1">{item.label}</span>
                <strong className="text-[22px] leading-[1.1] uppercase text-white">{item.title}</strong>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── Family + Quote CTA ───────────────────────────────────────────────────────

function FamilyQuoteCTA() {
  return (
    <section className="border-b border-[#dedede]">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        {/* Family panel — light with liquid blobs */}
        <div className="relative px-8 md:px-[70px] py-[90px] flex flex-col justify-between min-h-[420px] border-b lg:border-b-0 lg:border-r border-[#dedede] overflow-hidden bg-[#f0f5f3]">

          {/* Liquid blob 1 — top right */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '55%',
              paddingBottom: '55%',
              top: '-18%',
              right: '-12%',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              background: 'radial-gradient(ellipse at 40% 40%, #c7ddd6 0%, #dceae4 55%, transparent 100%)',
              filter: 'blur(18px)',
              opacity: 0.85,
            }}
            animate={{
              borderRadius: [
                '60% 40% 70% 30% / 50% 60% 40% 50%',
                '40% 60% 30% 70% / 60% 40% 60% 40%',
                '55% 45% 65% 35% / 45% 55% 45% 55%',
                '60% 40% 70% 30% / 50% 60% 40% 50%',
              ],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Liquid blob 2 — bottom left */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '40%',
              paddingBottom: '40%',
              bottom: '-10%',
              left: '-8%',
              borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%',
              background: 'radial-gradient(ellipse at 60% 60%, #b4cfc5 0%, #cfe0d8 60%, transparent 100%)',
              filter: 'blur(22px)',
              opacity: 0.65,
            }}
            animate={{
              borderRadius: [
                '40% 60% 50% 50% / 60% 40% 60% 40%',
                '60% 40% 35% 65% / 40% 60% 45% 55%',
                '50% 50% 60% 40% / 55% 45% 55% 45%',
                '40% 60% 50% 50% / 60% 40% 60% 40%',
              ],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />

          {/* Subtle grain texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat',
              backgroundSize: '180px',
            }}
          />

          <FadeIn className="relative z-10">
            <div className="w-[90px] h-[2px] bg-[#b00000] mb-10" />
            <h2 className="font-display text-[clamp(52px,6vw,110px)] leading-[0.9] tracking-[-0.025em] text-[#050505] mb-8">
              FAMILY<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #265954' }}>RUN.</span>
              <br />DETAIL<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #265954' }}>DRIVEN.</span>
            </h2>
            <p className="text-[20px] leading-[1.55] text-[#444] max-w-[480px]">
              We manufacture glass units with the care of a family business and the standards expected on high-end architectural projects.
            </p>
          </FadeIn>
        </div>

        {/* Quote CTA */}
        <div className="px-8 md:px-[70px] py-[90px] flex flex-col justify-between">
          <FadeIn delay={0.1}>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9">Specification &amp; Pricing</p>
            <h2 className="font-display text-[clamp(64px,8vw,140px)] leading-[0.88] tracking-[-0.025em] text-[#050505] mb-8">
              GET A<br />QUOTE
            </h2>
            <p className="text-[20px] leading-[1.62] text-[#333] max-w-[500px] mb-8">
              Send us your project details and our team will review your enquiry with guidance on specification, suitability and pricing. Drawings, dimensions and reference images are always helpful if available.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
              >
                Submit an Enquiry <ArrowRight size={13} />
              </Link>
              <Link
                href="/shop-rooflights"
                className="inline-flex items-center gap-2 border border-[#265954] text-[#265954] text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#265954] hover:text-white transition-colors"
              >
                Shop Rooflights
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Contact strip */}
      <FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Email', value: 'info@igs-projects.com', href: 'mailto:info@igs-projects.com' },
            { label: 'Telephone', value: '01895 762795', href: 'tel:01895762795' },
            { label: 'Location', value: 'London, UK', href: null },
            { label: 'Lead Times', value: 'From 14 days', href: null },
          ].map((item, i) => (
            <div key={item.label} className={`px-8 md:px-[46px] py-8 border-t border-[#dedede] ${i < 3 ? 'border-r border-[#dedede]' : ''}`}>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#b00000] mb-2">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-[17px] text-[#333] hover:text-[#b00000] transition-colors">{item.value}</a>
              ) : (
                <p className="text-[17px] text-[#333]">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatementGrid />
      <AboutSection />
      <ProductsPreview />
      <PrecisionSection />
      <Accreditations />
      <Gallery />
      <FamilyQuoteCTA />
    </>
  );
}
