import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

const HeroSection = ({ onScrollTo }: HeroSectionProps) => {
  const [returns, setReturns] = useState(84729441);
  const [partners, setPartners] = useState(1247);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simAmount, setSimAmount] = useState(250000);
  const [simYears, setSimYears] = useState(5);

  useEffect(() => {
    const ri = setInterval(() => setReturns(r => r + Math.floor(Math.random() * 720 + 480)), 3000);
    const pi = setInterval(() => setPartners(p => {
      const next = p + (Math.random() > 0.5 ? 1 : -1);
      return Math.max(1240, Math.min(1262, next));
    }), 22000);
    return () => { clearInterval(ri); clearInterval(pi); };
  }, []);

  const avgRate = 0.273;
  const projected = Math.round(simAmount * Math.pow(1 + avgRate, simYears));
  const presets = [500, 3000, 5000, 10000];
  const yearPresets = [1, 3, 5, 7, 10];

  // Generate chart points
  const chartPoints = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const y = simAmount * Math.pow(1 + avgRate, t * simYears);
    return { x: (i / 19) * 540 + 30, y: 150 - ((y - simAmount) / (projected - simAmount || 1)) * 120 };
  });
  const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L570,160 L30,160 Z`;

  return (
    <section className="min-h-[calc(100vh-94px)] grid grid-cols-1 lg:grid-cols-2 border-b border-b1 relative overflow-hidden" style={{ padding: 0 }}>
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-px left-0 right-0 bg-[hsl(var(--b1))]" style={{ top: '38.2%' }} />
        <div className="absolute w-px top-0 bottom-0 bg-[hsl(var(--b1))]" style={{ left: '50%' }} />
      </div>

      {/* Left: Hero text */}
      <div className="py-20 px-[52px] max-md:px-7 flex flex-col justify-center relative z-[1]">
        <div className="flex items-center gap-3 mb-7 animate-fadeUp">
          <div className="w-8 h-px bg-gold" />
          <span className="font-label text-[0.65rem] text-gold tracking-[0.25em] uppercase">Private Capital · By Invitation Only</span>
        </div>
        <div className="font-heading text-[clamp(2.4rem,5.5vw,5.8rem)] font-light leading-[0.92] tracking-[-0.025em] text-t1 mb-1 animate-fadeUp-1">Where Elite</div>
        <div className="font-heading text-[clamp(2.4rem,5.5vw,5.8rem)] font-light leading-[0.92] tracking-[-0.025em] text-t1 mb-1 animate-fadeUp-1">Capital Meets</div>
        <div className="font-heading text-[clamp(2.4rem,5.5vw,5.8rem)] font-light italic leading-[0.92] tracking-[-0.025em] mb-9 animate-fadeUp-2 hero-gold-gradient">Opportunity</div>
        <p className="text-base text-t3 leading-[1.85] max-w-[440px] mb-11 animate-fadeUp-3">
          Institutional-grade investment access for accredited investors, entertainers, athletes, and corporate brands. Start from just $500.
        </p>
        <div className="flex items-center gap-4 flex-wrap animate-fadeUp-4">
          <button onClick={() => setShowSimulator(true)} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-[15px] px-8 max-md:px-6 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">
            Project Your Growth ▷
          </button>
          <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-t3 bg-transparent border border-b2 py-[15px] px-8 max-md:px-6 cursor-pointer hover:border-b3 hover:text-t2 transition-all no-underline inline-block min-h-[48px] flex items-center">
            Request Access →
          </Link>
        </div>
      </div>

      {/* Right: Stats + chart */}
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

      {/* Returns Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={() => setShowSimulator(false)} />
          <div className="relative bg-void border border-b2 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center py-4 px-6 border-b border-b1">
              <span className="font-label text-[0.72rem] text-gold tracking-[0.2em] uppercase">Project Your Growth</span>
              <button onClick={() => setShowSimulator(false)} className="font-mono text-t3 text-lg bg-transparent border-none cursor-pointer hover:text-t1 transition-colors">✕</button>
            </div>
            <div className="p-6">
              {/* Amount */}
              <div className="mb-6">
                <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-3">Investment Amount</div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {presets.map(p => (
                    <button key={p} onClick={() => setSimAmount(p)}
                      className={`font-label text-[0.62rem] tracking-[0.1em] uppercase py-2 px-4 cursor-pointer transition-all border min-h-[40px] ${simAmount === p ? 'bg-gold text-void border-gold' : 'bg-transparent text-t3 border-b2 hover:border-b3'}`}>
                      ${(p / 1000)}K
                    </button>
                  ))}
                </div>
                <input type="range" min={100000} max={5000000} step={50000} value={simAmount}
                  onChange={e => setSimAmount(Number(e.target.value))}
                  className="w-full accent-[hsl(43,55%,54%)] h-1 cursor-pointer" />
                <div className="font-mono text-[1.4rem] text-gold mt-2">${simAmount.toLocaleString()}</div>
              </div>

              {/* Time Horizon */}
              <div className="mb-6">
                <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-3">Time Horizon</div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {yearPresets.map(y => (
                    <button key={y} onClick={() => setSimYears(y)}
                      className={`font-label text-[0.62rem] tracking-[0.1em] uppercase py-2 px-4 cursor-pointer transition-all border min-h-[40px] ${simYears === y ? 'bg-gold text-void border-gold' : 'bg-transparent text-t3 border-b2 hover:border-b3'}`}>
                      {y} {y === 1 ? 'Year' : 'Years'}
                    </button>
                  ))}
                </div>
                <input type="range" min={1} max={10} step={1} value={simYears}
                  onChange={e => setSimYears(Number(e.target.value))}
                  className="w-full accent-[hsl(43,55%,54%)] h-1 cursor-pointer" />
                <div className="font-mono text-[1rem] text-t2 mt-2">{simYears} {simYears === 1 ? 'Year' : 'Years'}</div>
              </div>

              {/* Chart */}
              <div className="bg-s1 border border-b1 p-5 mb-5">
                <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">📈 Projected Growth</div>
                <div className="font-mono text-[2.2rem] text-gold mb-3">${projected.toLocaleString()}</div>
                <svg viewBox="0 0 600 170" className="w-full h-[140px]">
                  <defs>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(201,168,76,0.2)" />
                      <stop offset="100%" stopColor="rgba(201,168,76,0)" />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill="url(#simGrad)" />
                  <path d={pathD} fill="none" stroke="hsl(43 55% 54%)" strokeWidth="2" />
                </svg>
                <div className="flex justify-between font-mono text-[0.62rem] text-t4 mt-1">
                  <span>{new Date().getFullYear()}</span>
                  <span>{new Date().getFullYear() + simYears}</span>
                </div>
              </div>

              <div className="font-body text-[0.72rem] text-t4 leading-[1.7] mb-5">
                Based on 27.3% average partner ROI. Projections are illustrative. All investments involve risk.
              </div>

              <div className="flex gap-3">
                <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all no-underline inline-block min-h-[48px] flex items-center">
                  Invest ${(simAmount / 1000)}K Now →
                </Link>
                <button onClick={() => navigator.clipboard.writeText(`Adams Streett Partners: $${simAmount.toLocaleString()} invested over ${simYears} years → $${projected.toLocaleString()} projected`)}
                  className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-t3 bg-transparent border border-b2 py-3.5 px-6 cursor-pointer hover:border-b3 hover:text-t2 transition-all min-h-[48px]">
                  Copy Projection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
