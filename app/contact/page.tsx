'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  enquiryType: z.enum(['general', 'technical', 'quote', 'trade', 'installation', 'complaint']),
  message: z.string().min(20, 'Please provide at least 20 characters'),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { enquiryType: 'general' },
  });

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  }

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <div className="border-b border-[#dedede] grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#dedede]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-6 font-semibold">Get In Touch</p>
          <h1 className="font-display text-[clamp(52px,7vw,104px)] text-[#050505] leading-[0.88] tracking-tight">
            CONTACT
            <br />
            <span className="text-outline">IGS</span>
          </h1>
          <p className="text-base text-[#555] mt-6 max-w-[480px] leading-relaxed">
            Our team is on hand to help with technical specifications, quotes, trade accounts, and general enquiries. We typically respond within 4 working hours.
          </p>
        </div>
        <div className="grid-bg bg-[#FAFAF8] min-h-[200px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* Contact details */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#dedede] p-8 md:p-10">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Address</p>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#265954] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#333] leading-relaxed">
                  IGS Glass Ltd<br />
                  Unit 12, Kelham Island Industrial Park<br />
                  Sheffield, S3 8RR<br />
                  United Kingdom
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Phone</p>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#265954] flex-shrink-0" />
                <a href="tel:01142000100" className="text-sm text-[#333] hover:text-[#b00000] transition-colors">0114 200 0100</a>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Email</p>
              <div className="space-y-2">
                {[
                  { label: 'Sales & Orders', email: 'sales@igs-glass.co.uk' },
                  { label: 'Technical', email: 'technical@igs-glass.co.uk' },
                  { label: 'Accounts', email: 'accounts@igs-glass.co.uk' },
                ].map(({ label, email }) => (
                  <div key={email} className="flex items-start gap-3">
                    <Mail size={14} className="text-[#265954] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#999] uppercase tracking-[0.1em]">{label}</p>
                      <a href={`mailto:${email}`} className="text-sm text-[#333] hover:text-[#b00000] transition-colors">{email}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Opening Hours</p>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#265954] mt-0.5 flex-shrink-0" />
                <table className="text-sm text-[#333]">
                  <tbody>
                    {[
                      ['Monday – Friday', '8:00 – 17:00'],
                      ['Saturday', '9:00 – 13:00'],
                      ['Sunday', 'Closed'],
                    ].map(([day, hours]) => (
                      <tr key={day}>
                        <td className="pr-4 py-0.5 font-medium">{day}</td>
                        <td className="text-[#777]">{hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map placeholder */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b00000] mb-4 font-semibold">Location</p>
              <div className="w-full h-48 bg-[#FAFAF8] border border-[#dedede] grid-bg flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#aaa]">Google Maps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="p-8 md:p-10 lg:p-14">
          {!sent ? (
            <>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#050505] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Email Address *</label>
                  <input {...register('email')} type="email" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                  {errors.email && <p className="text-xs text-[#b00000] mt-1">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Phone</label>
                    <input {...register('phone')} type="tel" className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Company</label>
                    <input {...register('company')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Enquiry Type *</label>
                  <select {...register('enquiryType')} className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors bg-white">
                    <option value="general">General Enquiry</option>
                    <option value="technical">Technical / Specification</option>
                    <option value="quote">Bespoke Quote</option>
                    <option value="trade">Trade Account Application</option>
                    <option value="installation">Installation Enquiry</option>
                    <option value="complaint">After-Sales / Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Message *</label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full border border-[#dedede] px-4 py-3 text-sm focus:outline-none focus:border-[#050505] transition-colors resize-y"
                    placeholder="Please include as much detail as possible..."
                  />
                  {errors.message && <p className="text-xs text-[#b00000] mt-1">{errors.message.message}</p>}
                </div>
                <p className="text-xs text-[#777] leading-relaxed">
                  By submitting this form you agree to our{' '}
                  <a href="/privacy-policy" className="text-[#b00000] hover:underline">Privacy Policy</a>.
                  We will not share your details with third parties.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-4 rounded-md hover:bg-[#3B8A82] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : <>Send Message <ArrowRight size={14} /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle size={48} className="text-[#265954] mb-4" />
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#265954] mb-2 font-semibold">Message Received</p>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#050505] mb-3">Thank You</h2>
              <p className="text-sm text-[#777] max-w-sm leading-relaxed">
                Your message has been received. A member of our team will be in touch within 4 working hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
