'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, vatAmount, total, formatCartPrice, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#dedede]">
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#050505]">Shopping Cart</h2>
                {itemCount > 0 && (
                  <p className="text-xs text-[#777] mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:text-[#b00000] transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <ShoppingBag size={40} className="text-[#dedede]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#777] mb-2">Your cart is empty</p>
                    <p className="text-sm text-[#777]">Browse our rooflight collection to get started.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b00000] hover:text-[#050505] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#f0f0f0]">
                  {items.map((item) => (
                    <li key={item.id} className="p-6">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-[#FAFAF8] border border-[#dedede] overflow-hidden">
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.images[0]?.alt ?? item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#050505] leading-tight mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-[11px] text-[#777] mb-1">
                            {item.variant.dimensions.width} × {item.variant.dimensions.length}mm
                          </p>
                          <p className="text-[11px] text-[#777] mb-3">
                            SKU: {item.variant.sku}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Qty controls */}
                            <div className="flex items-center border border-[#dedede]">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-[#FAFAF8] transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-[#FAFAF8] transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-semibold text-[#050505]">
                                {formatCartPrice(item.totalPrice)}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[10px] text-[#b00000] hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Summary + CTA */}
            {items.length > 0 && (
              <div className="border-t border-[#dedede] p-6 bg-[#FAFAF8]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-[#777]">
                    <span>Subtotal (exc. VAT)</span>
                    <span>{formatCartPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#777]">
                    <span>VAT (20%)</span>
                    <span>{formatCartPrice(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#050505] pt-2 border-t border-[#dedede]">
                    <span>Total (inc. VAT)</span>
                    <span>{formatCartPrice(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-md hover:bg-[#3B8A82] transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full mt-2 text-[10px] uppercase tracking-[0.18em] text-[#777] hover:text-[#050505] transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
