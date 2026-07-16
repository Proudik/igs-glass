'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowRight, ChevronDown } from 'lucide-react';
import { PRODUCTS, formatPrice, getPrimaryImage, getDefaultVariant } from '@/lib/products';
import type { Product } from '@/lib/types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const SUBCATEGORIES = [
  { label: 'All Products', value: '' },
  { label: 'Flat Rooflights', value: 'flat-rooflights' },
  { label: 'Pitched Rooflights', value: 'pitched-rooflights' },
  { label: 'Walk-On Rooflights', value: 'walk-on-rooflights' },
  { label: 'Modular Systems', value: 'modular-systems' },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name A–Z', value: 'name' },
];

function ProductCard({ product }: { product: Product }) {
  const image = getPrimaryImage(product);
  const defaultVariant = getDefaultVariant(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/marketplace/${product.slug}`}
        className="group block border border-[#dedede] hover:border-[#050505] transition-colors duration-300 bg-white overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#FAFAF8] grid-bg-dense">
          <img
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-[#265954] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1">
              Popular
            </div>
          )}
          {defaultVariant && defaultVariant.stockLevel <= 3 && (
            <div className="absolute top-3 right-3 bg-[#b00000] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1">
              Low Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">
            {product.subcategory?.replace(/-/g, ' ')}
          </p>
          <h3 className="font-display text-[28px] text-[#050505] leading-none mb-3">{product.name.toUpperCase()}</h3>
          <p className="text-sm text-[#666] leading-relaxed mb-4 line-clamp-2">{product.shortDescription}</p>

          {/* Key specs */}
          <div className="flex gap-4 mb-4 pb-4 border-b border-[#f0f0f0]">
            {product.uValue && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#999]">U-Value</p>
                <p className="text-xs font-semibold text-[#050505]">{product.uValue} W/m²K</p>
              </div>
            )}
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Warranty</p>
              <p className="text-xs font-semibold text-[#050505]">{product.warrantyYears} years</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Lead Time</p>
              <p className="text-xs font-semibold text-[#050505]">
                {defaultVariant ? `${defaultVariant.leadTimeDays} days` : 'TBC'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {defaultVariant ? (
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#777]">From</p>
                <p className="text-xl font-bold text-[#050505]">{formatPrice(defaultVariant.price)}</p>
                <p className="text-[10px] text-[#777]">exc. VAT</p>
              </div>
            ) : (
              <p className="text-sm text-[#777]">Price on enquiry</p>
            )}
            <span className="text-2xl text-[#dedede] group-hover:text-[#b00000] transition-colors duration-300 font-light">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (subcategory) {
      list = list.filter((p) => p.subcategory === subcategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => {
          const av = getDefaultVariant(a)?.price ?? Infinity;
          const bv = getDefaultVariant(b)?.price ?? Infinity;
          return av - bv;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          const av = getDefaultVariant(a)?.price ?? 0;
          const bv = getDefaultVariant(b)?.price ?? 0;
          return bv - av;
        });
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [search, subcategory, sort]);

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <div className="border-b border-[#dedede]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
          <div className="p-8 md:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#dedede]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-5 font-semibold">IGS Marketplace</p>
            <h1 className="font-display text-[clamp(52px,7vw,104px)] text-[#050505] leading-[0.88] tracking-tight">
              SHOP
              <br />
              <span className="text-outline">ROOFLIGHTS</span>
            </h1>
            <p className="text-base text-[#555] mt-6 max-w-[480px] leading-relaxed">
              Standard rooflights, ready to order. All units are UK-manufactured and shipped nationwide within 7–21 working days.
            </p>
          </div>
          <div className="grid-bg bg-[#FAFAF8] relative min-h-[200px]">
            <img
              src="https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Rooflight collection"
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8]/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="border-b border-[#dedede] bg-white sticky top-[72px] z-30">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#dedede]">
          {/* Search */}
          <div className="flex items-center gap-2 px-5 py-3 flex-1 min-w-0">
            <Search size={14} className="text-[#999] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search rooflights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-[#050505] placeholder-[#999] outline-none bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={14} className="text-[#999] hover:text-[#050505]" />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="sm:hidden flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#050505]"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Category filters (desktop) */}
          <div className="hidden sm:flex items-center divide-x divide-[#dedede]">
            {SUBCATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSubcategory(cat.value)}
                className={`px-4 py-3 text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors whitespace-nowrap ${
                  subcategory === cat.value
                    ? 'text-[#050505] bg-[#FAFAF8]'
                    : 'text-[#777] hover:text-[#050505]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#777] hidden md:inline">Sort:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-[11px] uppercase tracking-[0.15em] text-[#050505] font-semibold bg-transparent outline-none cursor-pointer pr-5 appearance-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="sm:hidden border-t border-[#dedede] p-4 flex flex-wrap gap-2">
            {SUBCATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setSubcategory(cat.value); setShowFilters(false); }}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold border transition-colors ${
                  subcategory === cat.value
                    ? 'bg-[#265954] text-white border-[#265954]'
                    : 'border-[#dedede] text-[#777] hover:border-[#265954] hover:text-[#265954]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="px-8 md:px-14 py-4 border-b border-[#dedede]">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#777]">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Product grid */}
      <div className="px-6 md:px-14 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#999] mb-3">No results</p>
            <p className="text-sm text-[#777]">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setSubcategory(''); }}
              className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#b00000] hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-0 border border-[#dedede]">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className={`border-b border-r border-[#dedede] ${
                  i % 3 === 2 ? 'xl:border-r-0' : ''
                } ${i % 2 === 1 ? 'sm:border-r-0 xl:border-r' : ''}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-[#dedede] px-8 md:px-14 py-16 bg-[#FAFAF8]">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Can't find what you need?</p>
          <p className="text-2xl font-bold text-[#050505] mb-4 leading-tight">
            We also manufacture bespoke rooflights to any specification.
          </p>
          <p className="text-sm text-[#555] mb-6 leading-relaxed">
            Our technical team works directly with architects, contractors, and homeowners to produce custom sizes, shapes, and specifications not available in our standard range.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-4 rounded-md hover:bg-[#3B8A82] transition-colors"
          >
            Request a Bespoke Quote
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
