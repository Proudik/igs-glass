'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useInView, motion } from 'framer-motion';
import { ALL_PRODUCTS } from '@/lib/all-products';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <div className="pt-[72px]">
      {/* Page header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        <div className="px-8 md:px-[70px] pt-[90px] pb-[70px] border-b lg:border-b-0 lg:border-r border-[#dedede]">
          <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9">Our Range</p>
          <h1 className="font-display text-[clamp(58px,7vw,104px)] leading-[0.88] tracking-[-0.025em] text-[#050505]">
            PRODUCTS
          </h1>
          <p className="text-[23px] leading-[1.55] text-[#333] max-w-[720px] mt-8">
            A focused range of high-performance glass units manufactured for exceptional architectural projects. For bespoke specifications, contact the office.
          </p>
        </div>
        <div
          className="min-h-[220px] lg:min-h-0"
          style={{
            background: 'linear-gradient(90deg,transparent 49%,#e7e7e7 50%,transparent 51%),linear-gradient(0deg,transparent 49%,#e7e7e7 50%,transparent 51%),#FAFAF8',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#dedede]">
        {ALL_PRODUCTS.map((product, i) => (
          <FadeIn key={product.slug} delay={(i % 4) * 0.06}>
            <Link
              href={`/products/${product.slug}`}
              className="group relative min-h-[420px] flex flex-col justify-center overflow-hidden bg-white transition-colors duration-[350ms] hover:bg-[#265954]"
              style={{
                borderRight: i % 2 === 0 ? '1px solid #dedede' : 'none',
                borderBottom: '1px solid #dedede',
                padding: '62px 70px',
              }}
            >
              {/* Decorative glass pane overlay */}
              <div
                className="absolute opacity-0 group-hover:opacity-[0.14] transition-all duration-[350ms] pointer-events-none border border-white/45"
                style={{
                  top: 34,
                  bottom: 34,
                  right: 34,
                  width: '42%',
                  background:
                    'linear-gradient(180deg,rgba(255,255,255,.85),rgba(199,218,224,.35)),repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 1px,transparent 1px 54px),repeating-linear-gradient(0deg,rgba(255,255,255,.35) 0 1px,transparent 1px 72px)',
                }}
              />

              <div className="relative z-10">
                <h2 className="font-display text-[58px] leading-[1] text-[#050505] group-hover:text-white mb-7 transition-colors duration-[350ms]">
                  {product.name.toUpperCase()}
                </h2>
                <p className="text-[22px] leading-[1.45] text-[#666] group-hover:text-white/[0.78] max-w-[580px] transition-colors duration-[350ms] line-clamp-3">
                  {product.copy}
                </p>
              </div>

              {/* Arrow */}
              <span className="absolute right-[68px] bottom-[58px] text-[62px] leading-[1] text-[#050505] group-hover:text-[#b00000] transition-all duration-[350ms] group-hover:translate-x-[14px] z-10 font-light">
                →
              </span>

              {/* Red underline bar */}
              <div className="absolute bottom-[42px] left-[70px] h-[2px] bg-[#b00000] w-0 group-hover:w-[120px] transition-all duration-[350ms]" />
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Bespoke CTA */}
      <div className="px-8 md:px-[70px] py-[70px] bg-[#FAFAF8] border-b border-[#dedede]">
        <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-4">Project Enquiries</p>
        <p className="text-[28px] font-black text-[#050505] leading-tight max-w-2xl mb-6">
          For bespoke specifications not listed above, our team is ready to help.
        </p>
        <p className="text-[17px] text-[#555] max-w-xl leading-relaxed mb-8">
          Drawings, dimensions and reference images are always helpful. Contact us at{' '}
          <a href="mailto:info@igs-projects.com" className="text-[#b00000]">info@igs-projects.com</a>{' '}
          or call <a href="tel:01895762795" className="text-[#b00000]">01895 762795</a>.
        </p>
        <Link
          href="/get-a-quote"
          className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
        >
          Submit an Enquiry →
        </Link>
      </div>
    </div>
  );
}
