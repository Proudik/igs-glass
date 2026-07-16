'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  company: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});
type FormData = z.infer<typeof schema>;

function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const { signUp, isLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/account';

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const res = await signUp(data);
    if (res.error) {
      setError('email', { message: res.error });
    } else {
      router.push(redirect);
    }
  }

  return (
    <div className="pt-[72px] min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 border-r border-[#dedede]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-6 font-semibold">Create Account</p>
        <h1 className="font-display text-[clamp(48px,6vw,80px)] text-[#050505] leading-none tracking-tight mb-8">
          REGISTER
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
          <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Email *</label>
            <input {...register('email')} type="email" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
            {errors.email && <p className="text-xs text-[#b00000] mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Company (optional)</label>
            <input {...register('company')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Phone (optional)</label>
            <input {...register('phone')} type="tel" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Password *</label>
            <div className="relative">
              <input {...register('password')} type={showPw ? 'text' : 'password'} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] pr-10 transition-colors" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#050505]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[#b00000] mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Confirm Password *</label>
            <input {...register('confirmPassword')} type="password" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
            {errors.confirmPassword && <p className="text-xs text-[#b00000] mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <p className="text-xs text-[#777] leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms-and-conditions" className="text-[#b00000] hover:underline">Terms & Conditions</Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-[#b00000] hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-md hover:bg-[#3B8A82] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : <>Create Account <ArrowRight size={14} /></>}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#777]">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#b00000] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Architectural glass"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050505]/50" />
        <div className="relative z-10 flex flex-col justify-end h-full p-16">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#265954] mb-6">Benefits</p>
          <ul className="space-y-3 text-white/80 text-[15px] max-w-xs">
            {[
              'Order tracking & status updates',
              'Saved billing & delivery addresses',
              'Order history & repeat orders',
              'Invoice history & downloads',
              'Priority technical support',
              'Trade account application',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#b00000] rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
