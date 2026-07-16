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
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

function SignInForm() {
  const [showPw, setShowPw] = useState(false);
  const { signIn, isLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/account';

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const res = await signIn(data.email, data.password);
    if (res.error) {
      setError('email', { message: res.error });
    } else {
      router.push(redirect);
    }
  }

  return (
    <div className="pt-[72px] min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 lg:py-24 border-r border-[#dedede]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-6 font-semibold">Customer Account</p>
        <h1 className="font-display text-[clamp(48px,6vw,80px)] text-[#050505] leading-none tracking-tight mb-8">
          SIGN IN
        </h1>
        <p className="text-sm text-[#777] mb-8 leading-relaxed max-w-sm">
          Sign in to access your order history, saved addresses, and track deliveries.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Email Address</label>
            <input
              {...register('email')}
              type="email"
              className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-[#b00000] mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#050505]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[#b00000] mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-[11px] text-[#b00000] hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-md hover:bg-[#3B8A82] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={14} /></>}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#777]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#b00000] font-semibold hover:underline">Create one</Link>
        </p>
        <p className="mt-3 text-sm text-[#777]">
          Or{' '}
          <Link href="/checkout" className="text-[#777] underline hover:text-[#050505]">continue as guest</Link>
        </p>
      </div>

      {/* Right panel — photo */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Architectural glass"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-[#050505]/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full p-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#265954] mb-4">Your Account</p>
          <h2 className="font-display text-[42px] leading-none text-white mb-8 tracking-tight">
            BUILT FOR<br />YOUR PROJECT
          </h2>
          <div className="w-8 h-[1px] bg-[#b00000] mb-8" />
          <ul className="space-y-3">
            {['Track orders in real time', 'Save delivery addresses', 'Order history & invoices', 'Faster checkout', 'Request technical support'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/75 text-[13px] tracking-wide">
                <span className="w-1 h-1 bg-[#265954] rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
