'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { fetchActiveRooflights, mapDbToProduct, type ProductWithRelations } from '@/lib/product-service';
import { formatPrice } from '@/lib/products';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ShopRooflightsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchActiveRooflights();
        setProducts(data);
      } catch {
        // RLS or network error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        <div className="px-8 md:px-[70px] pt-[90px] pb-[70px] border-b lg:border-b-0 lg:border-r border-[#dedede]">
          <p className="text-[12px] uppercase tracking-[0.22em] text-[#b00000] mb-9">Available Now</p>
          <h1 className="font-display text-[clamp(58px,7vw,104px)] leading-[0.88] tracking-[-0.025em] text-[#050505]">
            SHOP<br />ROOFLIGHTS
          </h1>
          <p className="text-[23px] leading-[1.55] text-[#333] max-w-[720px] mt-8">
            A focused collection of fixed rooflights available in standard sizes. For bespoke sizes or specialist glass specifications, please contact the office.
          </p>
        </div>
        <div
          className="min-h-[260px] lg:min-h-0"
          style={{
            background: 'linear-gradient(90deg,transparent 49%,#e7e7e7 50%,transparent 51%),linear-gradient(0deg,transparent 49%,#e7e7e7 50%,transparent 51%),#FAFAF8',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="py-20 text-center text-[12px] uppercase tracking-[0.2em] text-[#999]">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#dedede]">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.08}>
              <ShopCard product={product} />
            </FadeIn>
          ))}

          {/* Bespoke card */}
          <FadeIn delay={products.length * 0.08}>
            <div className="flex flex-col justify-between min-h-[520px] border-l border-[#dedede] px-[46px] py-[46px]">
              <div
                className="h-[220px] border border-[#dedede] flex items-center justify-center mb-9 text-[12px] uppercase tracking-[0.2em] text-[#999]"
                style={{
                  background: 'linear-gradient(90deg,transparent 49%,#eee 50%,transparent 51%),linear-gradient(0deg,transparent 49%,#eee 50%,transparent 51%),#FAFAF8',
                  backgroundSize: '55px 55px',
                }}
              >
                Image
              </div>

              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="font-display text-[44px] leading-[0.95] uppercase text-[#050505] mb-[22px]">
                    Bespoke Sizes &amp; Glass Spec
                  </h2>
                  <p className="text-[18px] leading-[1.5] text-[#555] mb-7">
                    For custom sizes, specialist glazing make-ups, solar control, laminated glass or project-specific requirements, contact the office.
                  </p>
                </div>
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center gap-2 border border-[#265954] text-[#265954] text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#265954] hover:text-white transition-colors self-start"
                >
                  Contact Office →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

function ShopCard({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const image = product.product_images.find((i) => i.is_primary)?.url ?? product.product_images[0]?.url;
  const defaultVariant = product.product_variants.find((v) => v.is_available) ?? product.product_variants[0];

  function handleAddToCart() {
    if (defaultVariant) {
      const mapped = mapDbToProduct(product);
      const variant = mapped.variants.find((v) => v.id === defaultVariant.id) ?? mapped.variants[0];
      if (variant) addItem(mapped, variant, 1);
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-[520px] border-r border-[#dedede] px-[46px] py-[46px]">
      {/* Image */}
      <div
        className="h-[220px] border border-[#dedede] mb-9 overflow-hidden relative"
        style={{
          background: 'linear-gradient(90deg,transparent 49%,#eee 50%,transparent 51%),linear-gradient(0deg,transparent 49%,#eee 50%,transparent 51%),#FAFAF8',
          backgroundSize: '55px 55px',
        }}
      >
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[12px] uppercase tracking-[0.2em] text-[#999]">Image</div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h2 className="font-display text-[44px] leading-[0.95] uppercase text-[#050505] mb-3">
            {product.name}
          </h2>
          {defaultVariant && (
            <p className="text-[22px] font-semibold text-[#050505] mb-4">
              {formatPrice(defaultVariant.price)}
              <span className="text-[14px] font-normal text-[#777] ml-1">exc. VAT</span>
            </p>
          )}
          <p className="text-[18px] leading-[1.5] text-[#555] mb-7">
            {product.short_description}
          </p>
        </div>

        <Link
          href={`/shop-rooflights/${product.slug}`}
          className="inline-flex items-center gap-2 bg-[#265954] text-white text-[12px] uppercase tracking-[0.2em] px-6 py-[18px] rounded-md hover:bg-[#3B8A82] transition-colors self-start"
        >
          View Product →
        </Link>
      </div>
    </div>
  );
}
