'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Check, Truck, Shield, Award } from 'lucide-react';
import { getProductBySlug, formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import type { ProductVariant } from '@/lib/types';

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const productData = getProductBySlug(params.slug);

  // All hooks must be called before any conditional throws
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    (productData?.variants.find((v) => v.isAvailable) ?? productData?.variants[0]) as ProductVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  if (!productData) notFound();
  const product = productData!;

  function handleAddToCart() {
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="pt-[72px]">
      {/* Breadcrumb */}
      <div className="px-6 md:px-14 py-4 border-b border-[#dedede] flex items-center gap-2">
        <Link href="/marketplace" className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-[#b00000] hover:text-[#050505] transition-colors font-semibold">
          <ArrowLeft size={12} />
          All Products
        </Link>
        <span className="text-[#dedede]">/</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#777]">{product.name}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dedede]">
        {/* Images */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#dedede]">
          {/* Main image */}
          <div className="relative aspect-square bg-[#FAFAF8] grid-bg overflow-hidden">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[activeImage]?.url}
              alt={product.images[activeImage]?.alt ?? product.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors border border-[#dedede]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors border border-[#dedede]"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 text-[10px] text-[#050505] font-medium">
              {activeImage + 1} / {product.images.length}
            </div>
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex border-t border-[#dedede]">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-1 aspect-square border-r last:border-r-0 border-[#dedede] overflow-hidden transition-opacity ${
                    i === activeImage ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-8 md:p-12 lg:p-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-3 font-semibold">
            {product.subcategory?.replace(/-/g, ' ')}
          </p>
          <h1 className="font-display text-[clamp(40px,5vw,72px)] text-[#050505] leading-none tracking-tight mb-4">
            {product.name.toUpperCase()}
          </h1>
          <p className="text-sm text-[#777] mb-1">SKU: {selectedVariant.sku}</p>

          <p className="text-base text-[#333] leading-relaxed mb-8 max-w-[500px]">
            {product.shortDescription}
          </p>

          {/* Variant selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-3 font-semibold">Select Specification</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.isAvailable}
                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold border transition-colors ${
                      selectedVariant.id === v.id
                        ? 'bg-[#265954] text-white border-[#265954]'
                        : v.isAvailable
                        ? 'border-[#dedede] text-[#777] hover:border-[#050505] hover:text-[#050505]'
                        : 'border-[#f0f0f0] text-[#ccc] cursor-not-allowed'
                    }`}
                  >
                    {v.sku.split('-').slice(-1)[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          <div className="flex gap-6 mb-6 pb-6 border-b border-[#f0f0f0]">
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#999] mb-1">Dimensions</p>
              <p className="text-sm font-semibold text-[#050505]">
                {selectedVariant.dimensions.width} × {selectedVariant.dimensions.length}mm
              </p>
            </div>
            {selectedVariant.dimensions.height && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#999] mb-1">Frame Depth</p>
                <p className="text-sm font-semibold text-[#050505]">{selectedVariant.dimensions.height}mm</p>
              </div>
            )}
            {selectedVariant.dimensions.weight && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#999] mb-1">Weight</p>
                <p className="text-sm font-semibold text-[#050505]">{selectedVariant.dimensions.weight}kg</p>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#050505]">{formatPrice(selectedVariant.price)}</span>
              <span className="text-sm text-[#777]">exc. VAT</span>
            </div>
            <p className="text-sm text-[#777] mt-0.5">
              {formatPrice(Math.round(selectedVariant.price * 1.2))} inc. VAT
            </p>
          </div>

          {/* Stock & lead time */}
          <div className="flex gap-4 mb-6">
            <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${selectedVariant.stockLevel > 3 ? 'text-[#265954]' : selectedVariant.stockLevel > 0 ? 'text-amber-600' : 'text-[#b00000]'}`}>
              <div className={`w-2 h-2 rounded-full ${selectedVariant.stockLevel > 3 ? 'bg-[#265954]' : selectedVariant.stockLevel > 0 ? 'bg-amber-500' : 'bg-[#b00000]'}`} />
              {selectedVariant.stockLevel > 3 ? 'In Stock' : selectedVariant.stockLevel > 0 ? `${selectedVariant.stockLevel} remaining` : 'Out of Stock'}
            </div>
            <div className="text-[11px] text-[#777]">
              Lead time: {selectedVariant.leadTimeDays} working days
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-stretch gap-3 mb-6">
            <div className="flex items-center border border-[#dedede]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-3 hover:bg-[#FAFAF8] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-3 hover:bg-[#FAFAF8] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant.isAvailable}
              className={`flex-1 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-colors ${
                added
                  ? 'bg-[#265954] text-white'
                  : selectedVariant.isAvailable
                  ? 'bg-[#265954] text-white hover:bg-[#3B8A82]'
                  : 'bg-[#f0f0f0] text-[#ccc] cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check size={14} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Delivery info */}
          <div className="bg-[#FAFAF8] border border-[#dedede] p-4 mb-6">
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-[#265954] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#555] leading-relaxed">{product.deliveryInfo}</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-[#777]">
              <Shield size={12} className="text-[#265954]" />
              {product.warrantyYears}-Year Warranty
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#777]">
              <Award size={12} className="text-[#265954]" />
              CE & UKCA Certified
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#777]">
              <Check size={12} className="text-[#265954]" />
              UK Manufactured
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Features */}
      <ProductTabs product={product} />
    </div>
  );
}

function ProductTabs({ product }: { product: ReturnType<typeof getProductBySlug> }) {
  const [tab, setTab] = useState<'description' | 'specifications' | 'features' | 'certifications'>('description');

  if (!product) return null;

  return (
    <div className="border-b border-[#dedede]">
      {/* Tab headers */}
      <div className="flex border-b border-[#dedede] overflow-x-auto">
        {(['description', 'specifications', 'features', 'certifications'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 md:px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors flex-shrink-0 ${
              tab === t
                ? 'text-[#050505] border-b-2 border-[#050505] -mb-[2px]'
                : 'text-[#777] hover:text-[#050505]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-8 md:p-14">
        {tab === 'description' && (
          <div className="max-w-3xl">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-base text-[#333] leading-relaxed mb-5 last:mb-0">{para}</p>
            ))}
          </div>
        )}

        {tab === 'specifications' && (
          <div className="max-w-2xl">
            <div className="border-t border-[#dedede]">
              {product.specifications.map((spec) => (
                <div key={spec.key} className="grid grid-cols-[200px_1fr] border-b border-[#dedede] py-4">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#b00000] font-semibold">{spec.key}</span>
                  <span className="text-sm text-[#333]">
                    {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'features' && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Check size={14} className="text-[#265954] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#333]">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === 'certifications' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {product.certifications.map((cert) => (
              <div key={cert} className="border border-[#dedede] bg-[#FAFAF8] p-4 flex items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#777] font-medium">{cert}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
