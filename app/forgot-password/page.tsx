'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const schema = z.object({ email: z.string().email('Valid email required') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await resetPassword(data.email);
    setSent(true);
  }

  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="w-full max-w-md border border-[#dedede] bg-white p-10">
        {!sent ? (
          <>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-4 font-semibold">Account Recovery</p>
            <h1 className="font-display text-[48px] text-[#050505] leading-none tracking-tight mb-4">
              RESET<br />PASSWORD
            </h1>
            <p className="text-sm text-[#777] mb-6 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-md hover:bg-[#3B8A82] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : <>Send Reset Link <ArrowRight size={14} /></>}
              </button>
            </form>
            <Link href="/sign-in" className="flex items-center gap-1 mt-4 text-[11px] text-[#777] hover:text-[#050505] transition-colors">
              <ArrowLeft size={12} /> Back to Sign In
            </Link>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle size={40} className="text-[#265954] mx-auto mb-4" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#265954] mb-2 font-semibold">Email Sent</p>
            <h2 className="text-2xl font-black text-[#050505] uppercase mb-3">Check Your Inbox</h2>
            <p className="text-sm text-[#777] mb-6 leading-relaxed">
              If an account exists with that email, you'll receive a password reset link within a few minutes.
            </p>
            <Link href="/sign-in" className="flex items-center justify-center gap-2 border border-[#265954] text-[#265954] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3 rounded-md hover:bg-[#265954] hover:text-white transition-colors">
              <ArrowLeft size={12} /> Return to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
