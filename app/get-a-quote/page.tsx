'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle, Mail, Phone, Clock, ChevronRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

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

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectLocation: z.string().optional(),
  productInterest: z.string().min(1, 'Please select a product'),
  dimensions: z.string().optional(),
  message: z.string().min(1, 'Please provide details'),
});
type FormData = z.infer<typeof schema>;

const PRODUCT_OPTIONS = [
  'Oversized Units',
  'Double Glazed Units',
  'Triple Glazed Units',
  'Rooflights',
  'Walk-On Glass Floors',
  'Balustrades',
  'Other / Bespoke',
];

const STEPS = [
  { n: '01', title: 'Submit your details', body: 'Fill in the form with your project requirements, dimensions and any reference images.' },
  { n: '02', title: 'We review & quote', body: 'Our team reviews your enquiry and prepares a detailed specification and pricing response.' },
  { n: '03', title: 'We deliver', body: 'Once approved, we manufacture and deliver your glazing to programme.' },
];

const inputCls = 'w-full border border-[#dedede] rounded-md px-4 py-3 text-[15px] text-[#111] bg-white placeholder:text-[#bbb] focus:outline-none focus:border-[#265954] focus:ring-2 focus:ring-[#265954]/10 transition-all';
const labelCls = 'block text-[11px] uppercase tracking-[0.18em] text-[#777] mb-1.5 font-medium';

export default function GetAQuotePage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { productInterest: '' },
  });

  const [submitError, setSubmitError] = useState('');

  async function onSubmit(data: FormData) {
    setSubmitError('');
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const response = await fetch(`${supabaseUrl}/functions/v1/send-quote-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error('Request failed');
      }

      setSent(true);
    } catch {
      setSubmitError('Something went wrong sending your enquiry. Please try again or call us on 01895 762 795.');
    }
  }

  return (
    <div className="pt-[72px] bg-[#FAFAF8]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#f0f5f3] border-b border-[#dedede]">
        {/* Blobs */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ width: '50%', paddingBottom: '50%', top: '-25%', right: '-10%', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: 'radial-gradient(ellipse at 40% 40%, #c7ddd6 0%, #dceae4 55%, transparent 100%)', filter: 'blur(22px)', opacity: 0.9 }}
          animate={{ borderRadius: ['60% 40% 70% 30% / 50% 60% 40% 50%', '40% 60% 30% 70% / 60% 40% 50% 50%', '60% 40% 70% 30% / 50% 60% 40% 50%'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{ width: '35%', paddingBottom: '35%', bottom: '-20%', left: '5%', borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%', background: 'radial-gradient(ellipse at 60% 60%, #b4cfc5 0%, #cfe0d8 60%, transparent 100%)', filter: 'blur(26px)', opacity: 0.6 }}
          animate={{ borderRadius: ['40% 60% 50% 50% / 60% 40% 60% 40%', '60% 40% 40% 60% / 40% 60% 40% 60%', '40% 60% 50% 50% / 60% 40% 60% 40%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 px-8 md:px-[70px] py-[80px] md:py-[110px] max-w-3xl">
          <motion.p
            className="text-[11px] uppercase tracking-[0.28em] text-[#265954] mb-6 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Specification &amp; Pricing
          </motion.p>
          <motion.h1
            className="font-display text-[clamp(64px,8vw,112px)] leading-[0.88] tracking-[-0.025em] text-[#050505]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            GET A<br />QUOTE
          </motion.h1>
          <motion.p
            className="text-[18px] md:text-[20px] leading-[1.6] text-[#444] max-w-[560px] mt-7"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            Send us your project details and our team will be in touch with specification guidance and accurate pricing.
          </motion.p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] min-h-[600px]">

        {/* Form column */}
        <div className="px-8 md:px-[70px] py-[64px] border-b lg:border-b-0 lg:border-r border-[#dedede]">
          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">

              {/* Contact details group */}
              <FadeIn>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-5 font-semibold">Your Details</p>
              </FadeIn>
              <FadeIn delay={0.05}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                <div>
                  <label className={labelCls}>Name <span className="text-[#b00000]">*</span></label>
                  <input {...register('name')} className={inputCls} placeholder="Jane Smith" />
                  {errors.name && <p className="text-xs text-[#b00000] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email <span className="text-[#b00000]">*</span></label>
                  <input {...register('email')} type="email" className={inputCls} placeholder="you@example.com" />
                  {errors.email && <p className="text-xs text-[#b00000] mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input {...register('phone')} type="tel" className={inputCls} placeholder="07700 000000" />
                </div>
                <div>
                  <label className={labelCls}>Company</label>
                  <input {...register('company')} className={inputCls} placeholder="Your company" />
                </div>
                </div>
              </FadeIn>

              {/* Project details group */}
              <FadeIn delay={0.1}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-5 font-semibold">Project Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelCls}>Project Location</label>
                  <input {...register('projectLocation')} className={inputCls} placeholder="London, UK" />
                </div>
                <div>
                  <label className={labelCls}>Product Interest <span className="text-[#b00000]">*</span></label>
                  <select {...register('productInterest')} className={inputCls}>
                    <option value="">Select a product…</option>
                    {PRODUCT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.productInterest && <p className="text-xs text-[#b00000] mt-1">{errors.productInterest.message}</p>}
                </div>
                </div>
                <div className="mb-5">
                  <label className={labelCls}>Dimensions / Glass Specification</label>
                  <input {...register('dimensions')} className={inputCls} placeholder="e.g. 1200 × 2400 mm, double glazed, Low-E coating" />
                </div>
              <div className="mb-6">
                <label className={labelCls}>Message <span className="text-[#b00000]">*</span></label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`${inputCls} resize-y`}
                  placeholder="Tell us about your project — drawings, timelines, or anything helpful…"
                />
                {errors.message && <p className="text-xs text-[#b00000] mt-1">{errors.message.message}</p>}
              </div>

              <p className="text-[13px] text-[#888] leading-[1.5] mb-5">
                By submitting this form you agree to our{' '}
                <a href="/privacy-policy" className="text-[#265954] hover:underline">Privacy Policy</a>.
              </p>

              {submitError && (
                <div className="mb-5 bg-[#b00000]/10 border border-[#b00000]/20 rounded-md px-4 py-3 text-sm text-[#b00000]">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2.5 bg-[#265954] text-white text-[12px] uppercase tracking-[0.18em] font-medium px-7 py-4 rounded-md hover:bg-[#3B8A82] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending…' : <>Submit an Enquiry <ArrowRight size={14} /></>}
              </button>
              </FadeIn>
            </form>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-[#f0f5f3] flex items-center justify-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                <CheckCircle size={32} className="text-[#265954]" />
              </motion.div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#265954] mb-3 font-semibold">Enquiry Received</p>
              <h2 className="font-display text-[56px] text-[#050505] leading-none mb-4">THANK YOU</h2>
              <p className="text-[16px] text-[#555] leading-relaxed">
                We will review your enquiry and be in touch with guidance on specification, suitability and pricing.
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-[#265954] text-white flex flex-col">
          <div className="px-8 py-[64px] flex flex-col gap-10 flex-1">

            {/* Process steps */}
            <FadeIn>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#4b8b78] mb-7 font-semibold">What Happens Next</p>
              <div className="space-y-7">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                    className="flex gap-4"
                  >
                    <span className="font-display text-[28px] leading-none text-[#265954] flex-shrink-0 mt-0.5">{s.n}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-white mb-1 leading-snug">{s.title}</p>
                      <p className="text-[13px] text-white/55 leading-relaxed">{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Contact */}
            <FadeIn delay={0.1}>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#265954] mb-6 font-semibold">Contact Us Directly</p>
              <div className="space-y-4">
                <a href="mailto:info@igs-projects.com" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-md bg-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#265954]/30 transition-colors">
                    <Mail size={14} className="text-[#265954]" />
                  </div>
                  <span className="text-[14px] text-white/75 group-hover:text-white transition-colors">info@igs-projects.com</span>
                </a>
                <a href="tel:01895762795" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-md bg-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#265954]/30 transition-colors">
                    <Phone size={14} className="text-[#265954]" />
                  </div>
                  <span className="text-[14px] text-white/75 group-hover:text-white transition-colors">01895 762 795</span>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-[#265954]" />
                  </div>
                  <span className="text-[13px] text-white/55 leading-snug">Mon–Fri 8:00–17:00<br />Sat 9:00–13:00</span>
                </div>
              </div>
            </FadeIn>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Trust note */}
            <FadeIn delay={0.15}>
              <div className="flex items-start gap-3">
                <ChevronRight size={14} className="text-[#265954] flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-white/50 leading-relaxed">
                  We typically respond to all enquiries within one working day. Complex specifications may take a little longer.
                </p>
              </div>
            </FadeIn>

          </div>
        </div>

      </div>
    </div>
  );
}
