import { useState, useEffect, useRef } from 'react';

const testimonials = [
  { text: "The yield intelligence dashboard alone justifies the minimum. I've never had this level of visibility into my own capital.", loc: 'Partner, Dubai', since: 'Since Oct 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
  { text: 'The compound calculator showed me what my money could look like in 5 years. I committed the same week.', loc: 'Partner, Lagos', since: 'Since Dec 2025', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: "35% APY on a 12-month lock is something my Swiss banker couldn't offer me.", loc: 'Partner, Zurich', since: 'Since Sep 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
  { text: 'Adams Streett understands that real wealth is built quietly. No noise, just returns.', loc: 'Partner, Cairo', since: 'Since Oct 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: 'From signup to active portfolio in under 10 minutes.', loc: 'Partner, Riyadh', since: 'Since Jan 2026', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: "Institutional access at this entry point doesn't exist anywhere else. I referred two colleagues within a month.", loc: 'Partner, Singapore', since: 'Since Nov 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: 'The referral system alone has paid for my management fees twice over.', loc: 'Partner, Nairobi', since: 'Since Nov 2025', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: 'The Halal Fund was the deciding factor for me. Sharia-compliant returns at this level are rare.', loc: 'Partner, Riyadh', since: 'Since Aug 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: "I've invested with three platforms. Adams Streett is the only one that feels institutional.", loc: 'Partner, Berlin', since: 'Since Jan 2026', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: 'The staking pool matured exactly as projected. No surprises.', loc: 'Partner, Toronto', since: 'Since Sep 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: "The African Unicorn Fund is exactly what the continent needs. I'm proud to be part of it.", loc: 'Partner, Accra', since: 'Since Dec 2025', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: 'My portfolio dashboard looks better than my Bloomberg terminal.', loc: 'Partner, Abu Dhabi', since: 'Since Jul 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
  { text: 'Crypto payments made committing capital frictionless. BTC confirmed in minutes.', loc: 'Partner, Mumbai', since: 'Since Feb 2026', tier: 'Bronze', tierColor: '#cd7f32' },
  { text: 'The monthly briefings alone are worth the minimum commitment.', loc: 'Partner, Frankfurt', since: 'Since Oct 2025', tier: 'Silver', tierColor: '#c0c0c0' },
  { text: "I tripled my initial position after seeing my first quarter's performance.", loc: 'Partner, Shanghai', since: 'Since Jun 2025', tier: 'Gold', tierColor: 'hsl(43 55% 54%)' },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const t = testimonials[current];

  return (
    <section id="s-proof" className="py-24 px-[52px] max-lg:px-7 border-b border-b1 bg-base">
      <div className="mb-16 text-center">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Partner Voices</div>
        <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">Trusted Across 6 Continents</h2>
        <div className="w-12 h-px bg-gold mx-auto mb-4" />
        <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px] mx-auto">Selected experiences from our global partner community. Identities anonymized at partner request.</p>
      </div>

      {/* Carousel */}
      <div
        className="relative max-w-[800px] mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[hsl(var(--base))] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[hsl(var(--base))] to-transparent z-10 pointer-events-none" />

        <div className="bg-s1 border border-b1 py-12 px-10 max-sm:px-6 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold" />
          <span className="font-heading text-[5rem] text-gold opacity-15 leading-none absolute top-2 left-6">"</span>
          <div key={current} className="animate-fadeUp">
            <p className="font-heading text-[1.15rem] max-sm:text-[1rem] italic text-t2 leading-[1.85] pt-4 mb-8 min-h-[80px]">
              {t.text}
            </p>
            <div className="h-px bg-[hsl(var(--b1))] mb-5" />
            <div className="flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-s3 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="hsl(var(--text3))" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="hsl(var(--text3))" />
                  </svg>
                </div>
                <div>
                  <div className="font-body text-[0.78rem] text-t1 font-normal">{t.loc}</div>
                  <div className="font-mono text-[0.6rem] text-t3 mt-0.5">{t.since}</div>
                </div>
              </div>
              <span className="font-label text-[0.52rem] tracking-[0.15em] uppercase py-0.5 px-2.5 border" style={{ color: t.tierColor, borderColor: t.tierColor }}>{t.tier}</span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 transition-all cursor-pointer border-none p-0 ${i === current ? 'bg-gold w-6' : 'bg-[hsl(var(--b3))]'}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Grid below carousel showing 3 quotes */}
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))] mt-12">
        {testimonials.slice(0, 6).map((item, i) => (
          <div key={i} className={`bg-s1 py-7 px-6 hover:bg-s2 transition-colors cursor-pointer ${i === current ? 'border-l-2 border-l-[hsl(var(--gold))]' : ''}`} onClick={() => setCurrent(i)}>
            <p className="font-heading text-[0.88rem] italic text-t3 leading-[1.75] line-clamp-3 mb-3">"{item.text}"</p>
            <div className="flex justify-between items-center">
              <span className="font-body text-[0.72rem] text-t4">{item.loc}</span>
              <span className="font-label text-[0.48rem] tracking-[0.12em] uppercase py-0.5 px-2 border" style={{ color: item.tierColor, borderColor: item.tierColor }}>{item.tier}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
