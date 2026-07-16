export default function TermsPage() {
  return (
    <div className="pt-[72px]">
      <div className="border-b border-[#dedede] px-8 md:px-14 py-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b00000] mb-4 font-semibold">Legal</p>
        <h1 className="font-display text-[clamp(48px,6vw,88px)] text-[#050505] leading-[0.88] tracking-tight">
          TERMS &amp;<br />CONDITIONS
        </h1>
        <p className="text-sm text-[#777] mt-4">Last updated: 1 November 2024</p>
      </div>

      <div className="px-8 md:px-14 py-12 max-w-4xl">
        <div className="mb-6 p-5 bg-[#F4F8F6] border border-[#DCE9E3]">
          <p className="text-sm text-[#333] leading-relaxed">
            Please read these Terms and Conditions carefully before placing an order with IGS Glass Ltd. By placing an order, you confirm that you have read, understood, and agree to these Terms.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="pb-8 border-b border-[#f0f0f0] last:border-b-0">
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
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#b00000] mb-2 font-semibold">Governing Law</p>
          <p className="text-sm text-[#555] leading-relaxed">
            These Terms are governed by the laws of England and Wales. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: '1. Company Information',
    content: [
      'IGS Glass Ltd is registered in England and Wales (Company No. 12345678). VAT Registration No. GB123456789. Registered office: Unit 12, Kelham Island Industrial Park, Sheffield, S3 8RR.',
    ],
  },
  {
    title: '2. Orders and Contract',
    content: [
      'All orders placed through our website or directly with our sales team constitute an offer to purchase goods subject to these Terms. A contract is formed only upon our written acceptance of your order (Order Confirmation email).',
      'We reserve the right to decline any order, including where products are unavailable, where a pricing error has occurred, or where we cannot verify customer details.',
      'Once an Order Confirmation is issued, orders can only be cancelled by mutual written agreement. Bespoke and made-to-order items cannot be cancelled once manufacturing has commenced.',
    ],
  },
  {
    title: '3. Pricing and Payment',
    content: [
      'All prices on our website are exclusive of VAT unless stated otherwise. VAT at the current standard rate (20%) will be added at checkout.',
      'Payment is due in full prior to dispatch unless a trade account with approved credit terms has been established.',
      'We reserve the right to adjust prices without prior notice. The price applicable to your order is fixed at the time of Order Confirmation.',
    ],
  },
  {
    title: '4. Delivery',
    content: [
      'Lead times quoted are estimates only and are not guaranteed. Lead times commence from the date of cleared payment unless otherwise agreed.',
      'Delivery is to kerbside only unless otherwise agreed. The customer is responsible for providing adequate access and offloading equipment for pallet deliveries.',
      'Risk in goods passes to the customer upon delivery. You must inspect goods immediately on delivery and notify us of any visible damage or shortfall within 48 hours.',
    ],
  },
  {
    title: '5. Returns and Defects',
    content: [
      'Standard products may be returned unused and in original packaging within 14 days for a full refund, subject to a restocking charge of 15% plus return delivery costs.',
      'Bespoke, made-to-order, and custom-specification products cannot be returned unless defective.',
      'Defective goods must be reported within 7 days of delivery. We will inspect and, where a genuine defect is found, repair, replace, or refund at our discretion.',
    ],
  },
  {
    title: '6. Warranties',
    content: [
      'Our standard rooflight products carry a 10-year frame warranty and 5-year glazing unit warranty from the date of delivery, subject to correct installation and maintenance in accordance with our guidelines.',
      'Warranties cover defects in materials and workmanship. They do not cover damage caused by improper installation, misuse, accidental damage, or failure to maintain the product.',
      'Walk-on glazing products carry a 5-year structural warranty.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'Our total liability to you in connection with any order shall not exceed the total value of that order.',
      'We shall not be liable for any indirect, consequential, or economic loss arising from the supply or use of our products, including loss of profit, business interruption, or project delays.',
    ],
  },
  {
    title: '8. Intellectual Property',
    content: [
      'All content on this website, including drawings, specifications, photographs, and text, is the property of IGS Glass Ltd and protected by UK and international intellectual property law. It may not be reproduced without our express written permission.',
    ],
  },
  {
    title: '9. Data Protection',
    content: [
      'We process personal data in accordance with our Privacy Policy and applicable UK data protection legislation. By placing an order you acknowledge our Privacy Policy.',
    ],
  },
];
