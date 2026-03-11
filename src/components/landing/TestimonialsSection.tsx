const testimonials = [
  { text: 'The yield intelligence dashboard alone justifies the minimum. I have never had this level of visibility into my own capital in one place.', loc: 'Partner, Dubai', since: 'Since Oct 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
  { text: 'The compound calculator showed me exactly what my money looks like in 5 years. I committed the same week I discovered this platform.', loc: 'Partner, Lagos', since: 'Since Dec 2025', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: "The Apex staking pool is extraordinary. 35% on a 12-month lock is something no private banker in Switzerland could offer me.", loc: 'Partner, Zurich', since: 'Since Sep 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
  { text: 'Adams Streett understands that real wealth is built quietly. No noise. No theatrics. Just returns.', loc: 'Partner, Cairo', since: 'Since Oct 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: 'From signup to active portfolio in under 10 minutes. The onboarding experience matches the calibre of the product itself.', loc: 'Partner, Riyadh', since: 'Since Jan 2026', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: 'Institutional access at this entry point simply does not exist anywhere else. I referred two colleagues within the first month.', loc: 'Partner, Singapore', since: 'Since Nov 2025', tier: 'Silver', tierColor: '#c0c0c0' },
];

const TestimonialsSection = () => (
  <section id="s-proof" className="py-24 px-[52px] max-lg:px-7 border-b border-b1 bg-base">
    <div className="mb-16 text-center">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Partner Voices</div>
      <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">Trusted Across 6 Continents</h2>
      <div className="w-12 h-px bg-gold mx-auto mb-4" />
      <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px] mx-auto">Selected experiences from our global partner community. Identities anonymized at partner request.</p>
    </div>
    <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-s1 py-9 px-[30px] relative">
          <span className="font-heading text-[5rem] text-gold opacity-15 leading-none absolute top-5 left-6">"</span>
          <p className="font-heading text-[0.95rem] italic text-t2 leading-[1.85] pt-4 mb-6">{t.text}</p>
          <div className="h-px bg-[hsl(var(--b1))] mb-5" />
          <div className="flex justify-between items-end">
            <div>
              <div className="font-body text-[0.78rem] text-t1 font-normal">{t.loc}</div>
              <div className="font-mono text-[0.6rem] text-t3 mt-0.5">{t.since}</div>
            </div>
            <span className="font-label text-[0.52rem] tracking-[0.15em] uppercase py-0.5 px-2.5 border" style={{ color: t.tierColor, borderColor: t.tierColor }}>{t.tier}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
