'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Truck, Package, CreditCard, FileText, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { createOrder } from '@/lib/product-service';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const customerSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone required'),
  company: z.string().optional(),
});

const addressSchema = z.object({
  line1: z.string().min(3, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  postcode: z.string().min(3, 'Postcode required'),
  country: z.string().min(2, 'Country required'),
});

const deliverySchema = z.object({
  method: z.enum(['collection', 'delivery']),
  sameAsBilling: z.boolean(),
  billingLine1: z.string().min(3, 'Required'),
  billingLine2: z.string().optional(),
  billingCity: z.string().min(2, 'Required'),
  billingPostcode: z.string().min(3, 'Required'),
  billingCountry: z.string().min(2, 'Required'),
  deliveryLine1: z.string().optional(),
  deliveryLine2: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryPostcode: z.string().optional(),
  deliveryCountry: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;
type DeliveryForm = z.infer<typeof deliverySchema>;

type CheckoutStep = 'mode' | 'details' | 'delivery' | 'payment' | 'confirmation';
type CheckoutMode = 'guest' | 'signin' | 'register';
type PaymentMethod = 'online' | 'invoice';

function StepIndicator({ step }: { step: CheckoutStep }) {
  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmation', label: 'Confirm' },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold ${
            i < currentIdx ? 'text-[#265954]' : i === currentIdx ? 'text-[#050505]' : 'text-[#ccc]'
          }`}>
            <div className={`w-5 h-5 flex items-center justify-center border text-[9px] ${
              i < currentIdx ? 'bg-[#265954] border-[#265954] text-white' :
              i === currentIdx ? 'border-[#050505] text-[#050505]' :
              'border-[#ccc] text-[#ccc]'
            }`}>
              {i < currentIdx ? <Check size={10} /> : i + 1}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-2 w-6 h-[1px] ${i < currentIdx ? 'bg-[#265954]' : 'bg-[#dedede]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderSummary() {
  const { items, subtotal, vatAmount, total, formatCartPrice } = useCart();
  return (
    <div className="bg-[#FAFAF8] border border-[#dedede] p-6 sticky top-24">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#050505] font-bold mb-4">Order Summary</p>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-12 h-12 flex-shrink-0 border border-[#dedede] overflow-hidden bg-white">
              <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#050505] leading-tight">{item.product.name}</p>
              <p className="text-[10px] text-[#777]">Qty: {item.quantity}</p>
            </div>
            <span className="text-xs font-semibold text-[#050505] flex-shrink-0">{formatCartPrice(item.totalPrice)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#dedede] pt-3 space-y-1.5">
        <div className="flex justify-between text-sm text-[#777]">
          <span>Subtotal (exc. VAT)</span><span>{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#777]">
          <span>VAT (20%)</span><span>{formatCartPrice(vatAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-[#050505] pt-1 border-t border-[#dedede]">
          <span>Total (inc. VAT)</span><span>{formatCartPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mode selection ───────────────────────────────────────────────────────────

function ModeStep({ onSelect }: { onSelect: (m: CheckoutMode) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#050505] uppercase tracking-tight mb-6">How would you like to continue?</h2>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onSelect('guest')}
          className="group border border-[#dedede] hover:border-[#050505] p-6 text-left transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b00000] mb-1 font-semibold">Continue as Guest</p>
              <p className="text-sm text-[#555]">No account required. Order history will be linked to your email.</p>
            </div>
            <ArrowRight size={16} className="text-[#dedede] group-hover:text-[#050505] transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>
        <button
          onClick={() => onSelect('signin')}
          className="group border border-[#dedede] hover:border-[#050505] p-6 text-left transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b00000] mb-1 font-semibold">Sign In</p>
              <p className="text-sm text-[#555]">Sign in to use saved addresses and view order history.</p>
            </div>
            <ArrowRight size={16} className="text-[#dedede] group-hover:text-[#050505] transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>
        <button
          onClick={() => onSelect('register')}
          className="group border border-[#dedede] hover:border-[#050505] p-6 text-left transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b00000] mb-1 font-semibold">Create an Account</p>
              <p className="text-sm text-[#555]">Create an account to track orders, save addresses, and get faster checkout next time.</p>
            </div>
            <ArrowRight size={16} className="text-[#dedede] group-hover:text-[#050505] transition-colors flex-shrink-0 ml-4" />
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Details step ─────────────────────────────────────────────────────────────

function DetailsStep({ onNext, defaultValues }: { onNext: (data: CustomerForm) => void; defaultValues?: Partial<CustomerForm> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-black text-[#050505] uppercase tracking-tight mb-6">Your Details</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">First Name *</label>
          <input {...register('firstName')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          {errors.firstName && <p className="text-xs text-[#b00000] mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Last Name *</label>
          <input {...register('lastName')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          {errors.lastName && <p className="text-xs text-[#b00000] mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Company (optional)</label>
        <input {...register('company')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" placeholder="Trading as or company name" />
      </div>
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Email Address *</label>
        <input {...register('email')} type="email" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
        {errors.email && <p className="text-xs text-[#b00000] mt-1">{errors.email.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Phone Number *</label>
        <input {...register('phone')} type="tel" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
        {errors.phone && <p className="text-xs text-[#b00000] mt-1">{errors.phone.message}</p>}
      </div>
      <button type="submit" className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-4 rounded-md hover:bg-[#3B8A82] transition-colors">
        Continue to Delivery
        <ArrowRight size={14} />
      </button>
    </form>
  );
}

// ─── Delivery step ────────────────────────────────────────────────────────────

function DeliveryStep({
  onNext, onBack, defaultValues,
}: {
  onNext: (data: DeliveryForm) => void;
  onBack: () => void;
  defaultValues?: Partial<DeliveryForm>;
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DeliveryForm>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { method: 'delivery', sameAsBilling: true, billingCountry: 'United Kingdom', deliveryCountry: 'United Kingdom', ...defaultValues },
  });
  const method = watch('method');
  const sameAsBilling = watch('sameAsBilling');

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-black text-[#050505] uppercase tracking-tight mb-6">Delivery & Address</h2>

      {/* Delivery method */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-3 font-semibold">Delivery Method *</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ value: 'delivery', label: 'Delivery', desc: 'Nationwide pallet delivery', icon: Truck },
            { value: 'collection', label: 'Collection', desc: 'Collect from Sheffield', icon: Package }
          ].map(({ value, label, desc, icon: Icon }) => (
            <label key={value} className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${method === value ? 'border-[#050505] bg-[#FAFAF8]' : 'border-[#dedede] hover:border-[#050505]'}`}>
              <input type="radio" value={value} {...register('method')} className="sr-only" />
              <Icon size={16} className={method === value ? 'text-[#050505]' : 'text-[#999]'} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#050505]">{label}</p>
                <p className="text-xs text-[#777]">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Billing address */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-3 font-semibold">Billing Address *</p>
        <div className="space-y-3">
          <input {...register('billingLine1')} placeholder="Address line 1" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          {errors.billingLine1 && <p className="text-xs text-[#b00000]">{errors.billingLine1.message}</p>}
          <input {...register('billingLine2')} placeholder="Address line 2 (optional)" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...register('billingCity')} placeholder="City" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
              {errors.billingCity && <p className="text-xs text-[#b00000] mt-1">{errors.billingCity.message}</p>}
            </div>
            <div>
              <input {...register('billingPostcode')} placeholder="Postcode" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors uppercase" />
              {errors.billingPostcode && <p className="text-xs text-[#b00000] mt-1">{errors.billingPostcode.message}</p>}
            </div>
          </div>
          <input {...register('billingCountry')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
        </div>
      </div>

      {/* Delivery address */}
      {method === 'delivery' && (
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" {...register('sameAsBilling')} className="w-4 h-4 accent-[#050505]" />
            <span className="text-sm text-[#555]">Delivery address is the same as billing address</span>
          </label>

          {!sameAsBilling && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-3 font-semibold">Delivery Address *</p>
              <div className="space-y-3">
                <input {...register('deliveryLine1')} placeholder="Address line 1" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                <input {...register('deliveryLine2')} placeholder="Address line 2 (optional)" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                <div className="grid grid-cols-2 gap-3">
                  <input {...register('deliveryCity')} placeholder="City" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                  <input {...register('deliveryPostcode')} placeholder="Postcode" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors uppercase" />
                </div>
                <input {...register('deliveryCountry')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
              </div>
            </div>
          )}

          {method === 'delivery' && (
            <div className="mt-4 p-4 bg-[#F4F8F6] border border-[#DCE9E3]">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#265954] mb-1 font-semibold">Delivery Pricing</p>
              <p className="text-xs text-[#555]">Delivery costs will be calculated based on your postcode and order size. Our sales team will confirm the delivery charge before processing your order.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-2 border border-[#dedede] text-[#777] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-4 rounded-md hover:border-[#050505] hover:text-[#050505] transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button type="submit" className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-4 rounded-md hover:bg-[#3B8A82] transition-colors">
          Continue to Payment <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}

// ─── Payment step ─────────────────────────────────────────────────────────────

function PaymentStep({
  onNext, onBack,
}: {
  onNext: (method: PaymentMethod) => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('online');
  const { total, formatCartPrice } = useCart();

  return (
    <div>
      <h2 className="text-2xl font-black text-[#050505] uppercase tracking-tight mb-6">Payment</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <button
          onClick={() => setMethod('online')}
          className={`flex items-center justify-between border p-5 text-left transition-colors ${method === 'online' ? 'border-[#050505] bg-[#FAFAF8]' : 'border-[#dedede] hover:border-[#050505]'}`}
        >
          <div className="flex items-center gap-3">
            <CreditCard size={16} className={method === 'online' ? 'text-[#050505]' : 'text-[#999]'} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#050505]">Pay Online</p>
              <p className="text-xs text-[#777]">Secure card payment via Stripe. Order confirmed immediately.</p>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${method === 'online' ? 'border-[#050505] bg-[#050505]' : 'border-[#dedede]'}`} />
        </button>

        <button
          onClick={() => setMethod('invoice')}
          className={`flex items-center justify-between border p-5 text-left transition-colors ${method === 'invoice' ? 'border-[#050505] bg-[#FAFAF8]' : 'border-[#dedede] hover:border-[#050505]'}`}
        >
          <div className="flex items-center gap-3">
            <FileText size={16} className={method === 'invoice' ? 'text-[#050505]' : 'text-[#999]'} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#050505]">Request Invoice</p>
              <p className="text-xs text-[#777]">We'll send a manual invoice. Order proceeds on receipt of payment.</p>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${method === 'invoice' ? 'border-[#050505] bg-[#050505]' : 'border-[#dedede]'}`} />
        </button>
      </div>

      {method === 'online' && (
        <div className="border border-[#DCE9E3] bg-[#F4F8F6] p-5 mb-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#265954] mb-2 font-semibold">Stripe Integration</p>
          <p className="text-sm text-[#555] leading-relaxed">
            Online card payment is coming soon. In the meantime, please select <strong>Request Invoice</strong> and our team will process your order manually.
          </p>
        </div>
      )}

      <div className="bg-[#265954] text-white p-5 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">Order Total</span>
          <span className="text-xl font-black">{formatCartPrice(total)}</span>
        </div>
        <p className="text-[10px] text-white/50 mt-1">Including 20% VAT</p>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-2 border border-[#dedede] text-[#777] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-4 rounded-md hover:border-[#050505] hover:text-[#050505] transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => onNext(method)}
          className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-4 rounded-md hover:bg-[#3B8A82] transition-colors"
        >
          {method === 'invoice' ? 'Submit Order' : 'Pay Now'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Confirmation step ────────────────────────────────────────────────────────

function ConfirmationStep({
  orderNumber, paymentMethod, customerEmail,
}: {
  orderNumber: string;
  paymentMethod: PaymentMethod;
  customerEmail: string;
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[#265954] flex items-center justify-center mx-auto mb-6">
        <Check size={28} className="text-white" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#265954] mb-2 font-semibold">Order Received</p>
      <h2 className="text-3xl font-black text-[#050505] uppercase tracking-tight mb-3">Thank You!</h2>
      <p className="text-lg text-[#333] mb-1">Order reference: <strong>{orderNumber}</strong></p>
      <p className="text-sm text-[#777] mb-6">Confirmation sent to <strong>{customerEmail}</strong></p>

      {paymentMethod === 'invoice' ? (
        <div className="border border-[#DCE9E3] bg-[#F4F8F6] p-6 text-left mb-6 max-w-lg mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#265954] mb-2 font-semibold">Invoice Request Received</p>
          <p className="text-sm text-[#555] leading-relaxed">
            Our accounts team will issue your invoice within 1 working day. Payment can be made by BACS transfer or card over the phone.
            Your order will be scheduled for production on receipt of cleared funds.
          </p>
        </div>
      ) : (
        <div className="border border-[#DCE9E3] bg-[#F4F8F6] p-6 text-left mb-6 max-w-lg mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#265954] mb-2 font-semibold">Payment Confirmed</p>
          <p className="text-sm text-[#555] leading-relaxed">
            Your payment has been processed successfully. Your order is now in our production queue.
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/account"
          className="flex items-center gap-2 border border-[#265954] text-[#265954] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3 rounded-md hover:bg-[#265954] hover:text-white transition-colors"
        >
          Track Order
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3 rounded-md hover:bg-[#3B8A82] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ─── Main checkout page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal, vatAmount, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>('mode');
  const [mode, setMode] = useState<CheckoutMode>('guest');
  const [customerData, setCustomerData] = useState<CustomerForm | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryForm | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('invoice');
  const [orderNumber, setOrderNumber] = useState('');
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <ShoppingBag size={48} className="text-[#dedede]" />
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#777]">Your cart is empty</p>
        <Link href="/marketplace" className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#b00000] hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  function handleModeSelect(m: CheckoutMode) {
    setMode(m);
    if (m === 'signin') { router.push('/sign-in?redirect=/checkout'); return; }
    if (m === 'register') { router.push('/register?redirect=/checkout'); return; }
    setStep('details');
  }

  function handleDetailsNext(data: CustomerForm) {
    setCustomerData(data);
    setStep('delivery');
  }

  function handleDeliveryNext(data: DeliveryForm) {
    setDeliveryData(data);
    setStep('payment');
  }

  async function handlePaymentNext(method: PaymentMethod) {
    setPaymentMethod(method);
    setSubmitError('');

    const num = `IGS-${Date.now().toString().slice(-6)}`;
    setOrderNumber(num);

    try {
      await createOrder({
        orderNumber: num,
        userId: user?.id ?? null,
        customer: {
          firstName: customerData?.firstName ?? '',
          lastName: customerData?.lastName ?? '',
          email: customerData?.email ?? '',
          phone: customerData?.phone ?? '',
          company: customerData?.company,
        },
        billing: {
          line1: deliveryData?.billingLine1 ?? '',
          line2: deliveryData?.billingLine2,
          city: deliveryData?.billingCity ?? '',
          postcode: deliveryData?.billingPostcode ?? '',
          country: deliveryData?.billingCountry ?? 'United Kingdom',
        },
        delivery: {
          method: (deliveryData?.method ?? 'delivery') as 'collection' | 'delivery',
          line1: deliveryData?.deliveryLine1 || (deliveryData?.sameAsBilling ? deliveryData?.billingLine1 : undefined),
          line2: deliveryData?.deliveryLine2 || (deliveryData?.sameAsBilling ? deliveryData?.billingLine2 : undefined),
          city: deliveryData?.deliveryCity || (deliveryData?.sameAsBilling ? deliveryData?.billingCity : undefined),
          postcode: deliveryData?.deliveryPostcode || (deliveryData?.sameAsBilling ? deliveryData?.billingPostcode : undefined),
          country: deliveryData?.deliveryCountry || (deliveryData?.sameAsBilling ? deliveryData?.billingCountry : undefined),
        },
        paymentMethod: method,
        subtotal,
        vatAmount,
        deliveryAmount: 0,
        total,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productSku: item.variant.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          width: item.variant.dimensions.width,
          length: item.variant.dimensions.length,
        })),
      });
      clearCart();
      setStep('confirmation');
    } catch {
      setSubmitError('Failed to submit your order. Please try again or call us on 01895 762 795.');
    }
  }

  return (
    <div className="pt-[72px] min-h-screen bg-white">
      <div className="border-b border-[#dedede] px-6 md:px-14 py-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#050505] font-bold">Secure Checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[calc(100vh-72px)]">
        {/* Main checkout */}
        <div className="p-6 md:p-12 lg:p-14 border-r border-[#dedede]">
          {step !== 'mode' && step !== 'confirmation' && <StepIndicator step={step} />}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              {step === 'mode' && <ModeStep onSelect={handleModeSelect} />}
              {step === 'details' && <DetailsStep onNext={handleDetailsNext} />}
              {step === 'delivery' && (
                <DeliveryStep
                  onNext={handleDeliveryNext}
                  onBack={() => setStep('details')}
                />
              )}
              {step === 'payment' && (
                <PaymentStep
                  onNext={handlePaymentNext}
                  onBack={() => setStep('delivery')}
                />
              )}
              {step === 'confirmation' && (
                <ConfirmationStep
                  orderNumber={orderNumber}
                  paymentMethod={paymentMethod}
                  customerEmail={customerData?.email ?? 'your email'}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Order summary */}
        {step !== 'confirmation' && (
          <div className="p-6 md:p-8 bg-white border-t lg:border-t-0">
            <OrderSummary />
          </div>
        )}
      </div>

      {submitError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#b00000] text-white text-sm px-5 py-3 rounded-md shadow-lg max-w-md text-center">
          {submitError}
        </div>
      )}
    </div>
  );
}
