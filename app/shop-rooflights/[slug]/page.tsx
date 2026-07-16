'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { fetchRooflightBySlug, mapDbToProduct, type ProductWithRelations } from '@/lib/product-service';

export default function RooflightDetailPage({ params }: { params: { slug: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<ProductWithRelations | null | undefined>(undefined);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRooflightBySlug(params.slug);
        setProduct(data);
      } catch {
        setProduct(null);
      }
    })();
  }, [params.slug]);

  if (product === undefined) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-[12px] uppercase tracking-[0.2em] text-[#999]">Loading...</div>
      </div>
    );
  }

  if (product === null || (product && !product.is_active)) {
    notFound();
  }

  const p = product!;
  const defaultVariant = p.product_variants.find((v) => v.is_available) ?? p.product_variants[0];
  const specs = [...p.product_specifications].sort((a, b) => a.sort_order - b.sort_order);
  const images = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order);

  function handleEnquire() {
    if (defaultVariant && p) {
      const product = mapDbToProduct(p);
      const variant = product.variants.find((v) => v.id === defaultVariant.id) ?? product.variants[0];
      if (variant) addItem(product, variant, 1);
    }
  }

  return (
    <div className="pt-[72px]">
      {/* Back link */}
      <div className="px-8 md:px-[70px] py-5 border-b border-[#dedede]">
        <Link
          href="/shop-rooflights"
          className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] text-[#b00000] hover:text-[#050505] transition-colors font-semibold"
        >
          <ArrowLeft size={12} />
          Shop Rooflights
        </Link>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        {/* Image */}
        <div
          className="relative min-h-[700px] border-b lg:border-b-0 lg:border-r border-[#dedede] flex items-center justify-center"
          style={{
            background: 'linear-gradient(90deg,transparent 49%,#eee 50%,transparent 51%),linear-gradient(0deg,transparent 49%,#eee 50%,transparent 51%),#FAFAF8',
            backgroundSize: '80px 80px',
          }}
        >
          {images.length > 0 ? (
            <>
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImage]?.url}
                alt={images[activeImage]?.alt ?? p.name}
                className="w-full h-full object-cover absolute inset-0"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-[#dedede] z-10"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-[#dedede] z-10"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </>
          ) : (
            <span className="text-[12px] uppercase tracking-[0.2em] text-[#999]">Image</span>
          )}
        </div>

        {/* Info */}
        <div className="px-8 md:px-[70px] py-[80px]">
          <Link
            href="/shop-rooflights"
            className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.2em] text-[#b00000] hover:text-[#050505] transition-colors mb-10"
          >
            ← Back
          </Link>

          <h1 className="font-display text-[clamp(58px,7vw,104px)] leading-[0.88] tracking-[-0.025em] text-[#050505] mb-5">
            {p.name.toUpperCase()}
          </h1>

          {defaultVariant && (
            <p className="text-[32px] font-semibold text-[#050505] mb-2">
              {formatPrice(defaultVariant.price)}
              <span className="text-[16px] font-normal text-[#777] ml-2">exc. VAT</span>
            </p>
          )}

          <p className="text-[23px] leading-[1.55] text-[#333] max-w-[720px] mb-8">
            {p.short_description}
          </p>

          {/* Spec table */}
          {specs.length > 0 && (
            <div className="mt-9 mb-9 border-t border-[#dedede]">
              {specs.map((spec) => (
                <div
                  key={spec.id}
                  className="grid border-b border-[#dedede] py-[18px] text-[17px] leading-[1.4]"
                  style={{ gridTemplateColumns: '160px 1fr' }}
                >
                  <strong className="text-[12px] uppercase tracking-[0.2em] text-[#b00000]">{spec.key}</strong>
                  <span className="text-[#333]">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEnquire}
              className="bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors"
            >
              Add to Basket
            </button>
          </div>

          <p className="text-[14px] text-[#666] mt-5 leading-relaxed">
            For bespoke sizes or alternative glass specifications, please{' '}
            <Link href="/get-a-quote" className="text-[#b00000] hover:underline">contact the office</Link>.
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex border-b border-[#dedede]">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(i)}
              className={`flex-1 aspect-square border-r last:border-r-0 border-[#dedede] overflow-hidden transition-opacity max-w-[120px] ${
                i === activeImage ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
