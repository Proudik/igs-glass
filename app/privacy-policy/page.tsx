import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[72px]">
      <div className="border-b border-[#dedede] px-8 md:px-14 py-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-4 font-semibold">Legal</p>
        <h1 className="font-display text-[clamp(48px,6vw,88px)] text-[#050505] leading-[0.88] tracking-tight">
          PRIVACY<br />POLICY
        </h1>
        <p className="text-sm text-[#777] mt-4">Last updated: 1 November 2024</p>
      </div>

      <div className="px-8 md:px-14 py-12 max-w-4xl">
        <div className="prose prose-sm max-w-none">
          {sections.map((s) => (
            <div key={s.title} className="mb-8 pb-8 border-b border-[#f0f0f0] last:border-b-0">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#b00000] font-bold mb-3">{s.title}</h2>
              <div className="space-y-3">
                {s.content.map((para, i) => (
                  <p key={i} className="text-sm text-[#333] leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-[#FAFAF8] border border-[#dedede]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Contact Our Data Controller</p>
          <p className="text-sm text-[#555] leading-relaxed">
            IGS Glass Ltd, Unit 12 Kelham Island Industrial Park, Sheffield, S3 8RR.<br />
            Email: <a href="mailto:privacy@igs-glass.co.uk" className="text-[#b00000] hover:underline">privacy@igs-glass.co.uk</a><br />
            Telephone: <a href="tel:01142000100" className="text-[#b00000] hover:underline">0114 200 0100</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: '1. Who We Are',
    content: [
      'IGS Glass Ltd ("IGS", "we", "us", "our") is a company registered in England and Wales (Company No. 12345678). Our registered office is at Unit 12, Kelham Island Industrial Park, Sheffield, S3 8RR.',
      'We operate the website igs-glass.co.uk and are committed to protecting and respecting your privacy. This policy explains how we collect, use, store and share personal information when you use our website or services.',
    ],
  },
  {
    title: '2. Information We Collect',
    content: [
      'We collect information you provide directly to us when you: create an account, place an order, submit a contact form, subscribe to our newsletter, or apply for a trade account.',
      'Personal data we collect includes: name, email address, phone number, company name, billing and delivery addresses, and payment information (processed securely via Stripe — we do not store card details).',
      'We also automatically collect certain technical data when you visit our website, including IP address, browser type, device type, pages visited, and session duration, via cookies and similar technologies.',
    ],
  },
  {
    title: '3. How We Use Your Information',
    content: [
      'We use your personal information to: process and fulfil your orders; communicate with you about orders, deliveries, and after-sales matters; manage your customer account; respond to enquiries and provide technical support; comply with legal and regulatory obligations.',
      'With your consent, we may also use your information to: send marketing communications about products and services; conduct customer satisfaction research; improve our website and services through analytics.',
    ],
  },
  {
    title: '4. Cookies',
    content: [
      'We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can manage your cookie preferences at any time using the cookie banner displayed on your first visit.',
      'Essential cookies are required for the website to function correctly and cannot be disabled. Analytics cookies (such as Google Analytics and PostHog) and marketing cookies (such as Meta Pixel) are only set with your explicit consent.',
    ],
  },
  {
    title: '5. Data Sharing',
    content: [
      'We do not sell your personal data to third parties. We may share your data with: delivery partners (for order fulfilment); payment processors (Stripe, for payment processing); our professional advisors; regulatory or law enforcement authorities where required by law.',
      'All third-party processors are required to handle your data in accordance with GDPR and our contractual requirements.',
    ],
  },
  {
    title: '6. Data Retention',
    content: [
      'We retain personal data for as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law. Customer account data is retained for 7 years from your last transaction for legal and accounting purposes. You may request deletion of your data at any time, subject to legal retention obligations.',
    ],
  },
  {
    title: '7. Your Rights',
    content: [
      'Under UK GDPR, you have the right to: access your personal data; rectify inaccurate data; request erasure of your data; restrict or object to processing; data portability; and to withdraw consent at any time.',
      'To exercise any of these rights, please contact our Data Controller at privacy@igs-glass.co.uk. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk.',
    ],
  },
  {
    title: '8. Security',
    content: [
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, disclosure, alteration, or destruction. Our website uses HTTPS encryption, and payment processing is handled exclusively through PCI DSS-compliant providers.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    content: [
      'We may update this privacy policy from time to time. The latest version will always be available on this page, and we will notify registered customers of material changes by email.',
    ],
  },
];
