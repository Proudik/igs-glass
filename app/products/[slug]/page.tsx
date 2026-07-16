'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProductBySlug, ALL_PRODUCTS } from '@/lib/all-products';

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const currentIndex = ALL_PRODUCTS.findIndex((p) => p.slug === params.slug);
  const prevProduct = currentIndex > 0 ? ALL_PRODUCTS[currentIndex - 1] : null;
  const nextProduct = currentIndex < ALL_PRODUCTS.length - 1 ? ALL_PRODUCTS[currentIndex + 1] : null;

  return (
    <div className="pt-[72px]">
      {/* Back link */}
      <div className="px-8 md:px-[70px] py-5 border-b border-[#dedede] flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] text-[#b00000] hover:text-[#050505] transition-colors font-semibold"
        >
          <ArrowLeft size={12} />
          All Products
        </Link>
        {product.category && (
          <span className="text-[12px] uppercase tracking-[0.2em] text-[#999]">{product.category}</span>
        )}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        {/* Image */}
        <div className="relative min-h-[480px] lg:min-h-[700px] border-b lg:border-b-0 lg:border-r border-[#dedede] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#050505]/25" />

          {/* Category badge on image */}
          {product.category && (
            <div className="absolute top-8 left-8">
              <span className="bg-white/90 text-[11px] uppercase tracking-[0.2em] text-[#b00000] px-4 py-2">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-8 md:px-[70px] py-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-8">Product Specification</p>

            <h1 className="font-display text-[clamp(58px,7vw,104px)] leading-[0.88] tracking-[-0.025em] text-[#050505] mb-[42px]">
              {product.titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < product.titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="text-[22px] leading-[1.55] text-[#333] max-w-[600px] mb-10">
              {product.copy}
            </p>

            {/* Spec table */}
            <div className="border-t border-[#dedede] mb-10">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid border-b border-[#dedede] py-[18px] gap-3"
                  style={{ gridTemplateColumns: '140px 1fr' }}
                >
                  <strong className="text-[12px] uppercase tracking-[0.2em] text-[#b00000] pt-[3px]">{spec.label}</strong>
                  <span className="text-[17px] leading-[1.5] text-[#333]">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
              >
                Get a Quote <ArrowRight size={13} />
              </Link>
              <Link
                href="/products"
                className="border border-[#265954] text-[#265954] text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#265954] hover:text-white transition-colors"
              >
                View All Products
              </Link>
            </div>

            <p className="text-[14px] text-[#666] mt-6 leading-relaxed">
              For bespoke sizes or specific project requirements, please{' '}
              <Link href="/get-a-quote" className="text-[#b00000] hover:underline">contact the office</Link>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="grid grid-cols-2 border-b border-[#dedede]">
        <div className={`border-r border-[#dedede] ${!prevProduct ? 'opacity-30 pointer-events-none' : ''}`}>
          {prevProduct ? (
            <Link
              href={`/products/${prevProduct.slug}`}
              className="group flex items-center gap-4 px-8 md:px-[70px] py-8 hover:bg-[#FAFAF8] transition-colors"
            >
              <ArrowLeft size={16} className="text-[#b00000] flex-shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#999] mb-1">Previous</p>
                <p className="text-[15px] font-semibold text-[#050505] group-hover:text-[#b00000] transition-colors">{prevProduct.name}</p>
              </div>
            </Link>
          ) : (
            <div className="px-8 md:px-[70px] py-8" />
          )}
        </div>

        <div className={`${!nextProduct ? 'opacity-30 pointer-events-none' : ''}`}>
          {nextProduct ? (
            <Link
              href={`/products/${nextProduct.slug}`}
              className="group flex items-center justify-end gap-4 px-8 md:px-[70px] py-8 hover:bg-[#FAFAF8] transition-colors text-right"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#999] mb-1">Next</p>
                <p className="text-[15px] font-semibold text-[#050505] group-hover:text-[#b00000] transition-colors">{nextProduct.name}</p>
              </div>
              <ArrowRight size={16} className="text-[#b00000] flex-shrink-0" />
            </Link>
          ) : (
            <div className="px-8 md:px-[70px] py-8" />
          )}
        </div>
      </div>

      {/* Related CTA */}
      <div className="px-8 md:px-[70px] py-[70px] bg-[#FAFAF8] border-b border-[#dedede]">
        <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-4">Project Enquiries</p>
        <p className="text-[28px] font-black text-[#050505] leading-tight max-w-2xl mb-5">
          For bespoke specifications not listed above, our team is ready to help.
        </p>
        <p className="text-[17px] text-[#555] max-w-xl leading-relaxed mb-7">
          Contact us at{' '}
          <a href="mailto:info@igs-projects.com" className="text-[#b00000]">info@igs-projects.com</a>{' '}
          or call <a href="tel:01895762795" className="text-[#b00000]">01895 762795</a>.
        </p>
        <Link
          href="/get-a-quote"
          className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
        >
          Submit an Enquiry <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
