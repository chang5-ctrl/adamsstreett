import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

const HeroSection = ({ onScrollTo }: HeroSectionProps) => {
  const [returns, setReturns] = useState(84729441);
  const [partners, setPartners] = useState(1247);

  useEffect(() => {
    const ri = setInterval(() => setReturns(r => r + Math.floor(Math.random() * 720 + 480)), 3000);
    const pi = setInterval(() => setPartners(p => {
      const next = p + (Math.random() > 0.5 ? 1 : -1);
      return Math.max(1240, Math.min(1262, next));
    }), 22000);
    return () => { clearInterval(ri); clearInterval(pi); };
  }, []);

  return (
    <section className="min-h-[calc(100vh-94px)] grid grid-cols-1 lg:grid-cols-2 border-b border-b1 relative overflow-hidden" style={{ padding: 0 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-px left-0 right-0 bg-[hsl(var(--b1))]" style={{ top: '38.2%' }} />
        <div className="absolute w-px top-0 bottom-0 bg-[hsl(var(--b1))]" style={{ left: '50%' }} />
      </div>
      <div className="py-20 px-[52px] max-md:px-7 flex flex-col justify-center relative z-[1]">
        <div className="flex items-center gap-3 mb-7 animate-fadeUp">
          <div className="w-8 h-px bg-gold" />
          <span className="font-label text-[0.65rem] text-gold tracking-[0.25em] uppercase">Private Capital · By Invitation Only</span>
        </div>
        <div className="font-heading text-[clamp(3.2rem,5.5vw,5.8rem)] font-light leading-[0.92] tracking-[-0.025em] text-t1 mb-1 animate-fadeUp-1">Where Elite</div>
        <div className="font-heading text-[clamp(3.2rem,5.5vw,5.8rem)] font-light leading-[0.92] tracking-[-0.025em] text-t1 mb-1 animate-fadeUp-1">Capital Meets</div>
        <div className="font-heading text-[clamp(3.2rem,5.5vw,5.8rem)] font-light italic leading-[0.92] tracking-[-0.025em] text-gold mb-9 animate-fadeUp-2">Opportunity</div>
        <p className="text-base text-t3 leading-[1.85] max-w-[440px] mb-11 animate-fadeUp-3">
          Institutional-grade investment access for accredited investors, entertainers, athletes, and corporate brands. Minimum commitment $100,000.
        </p>
        <div className="flex items-center gap-4 animate-fadeUp-4">
          <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-[15px] px-11 cursor-pointer hover:bg-gold-bright transition-all no-underline inline-block">
            Request Partnership
          </Link>
          <button onClick={() => onScrollTo('s-funds')} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-t3 bg-transparent border border-b2 py-[15px] px-11 cursor-pointer hover:border-b3 hover:text-t2 transition-all">
            View All 21 Funds
          </button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-end border-l border-b1 relative z-[1] animate-fadeIn">
        <div className="grid grid-cols-2">
          {[
            { label: 'Live Returns', value: `$${returns.toLocaleString()}`, cls: 'text-asp-green', sub: 'Total generated' },
            { label: 'Capital Deployed', value: '$1.24B', cls: 'text-t1', sub: 'Across all funds' },
            { label: 'Average ROI', value: '27.3%', cls: 'text-gold', sub: 'Partner average' },
            { label: 'Active Partners', value: partners.toLocaleString(), cls: 'text-t1', sub: 'Across 6 continents' },
          ].map((stat, i) => (
            <div key={i} className={`py-9 px-8 border-b1 ${i < 2 ? '' : 'border-t'} ${i % 2 === 1 ? 'border-l' : ''}`}>
              <div className="font-label text-[0.55rem] text-t4 tracking-[0.2em] uppercase mb-2">{stat.label}</div>
              <div className={`font-mono text-[1.6rem] tabular-nums tracking-[-0.02em] mb-1 ${stat.cls}`}>{stat.value}</div>
              <div className="font-body text-[0.72rem] text-t4">{stat.sub}</div>
            </div>
          ))}
        </div>
        <div className="h-[200px] border-t border-b1 relative overflow-hidden">
          <div className="font-label text-[0.55rem] text-t4 tracking-[0.15em] uppercase absolute top-3 left-5">General Fund Performance · 2024–2026</div>
          <svg className="w-full h-full absolute bottom-0" viewBox="0 0 600 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(201,168,76,0.15)" />
                <stop offset="100%" stopColor="rgba(201,168,76,0)" />
              </linearGradient>
            </defs>
            <path d="M0,160 L60,145 L120,130 L180,118 L240,100 L300,85 L360,70 L420,52 L480,38 L540,22 L600,10 L600,180 L0,180 Z" fill="url(#chartGrad)" />
            <path d="M0,160 L60,145 L120,130 L180,118 L240,100 L300,85 L360,70 L420,52 L480,38 L540,22 L600,10" fill="none" stroke="hsl(43 55% 54%)" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
