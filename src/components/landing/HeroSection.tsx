import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

const HeroSection = ({ onScrollTo }: HeroSectionProps) => {
  const [returns, setReturns] = useState(84.7);
  const [partners, setPartners] = useState(1247);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simAmount, setSimAmount] = useState(500);
  const [simHorizon, setSimHorizon] = useState('12');
  const [flash, setFlash] = useState(false);
  const flashTimeout = useRef<ReturnType<typeof setTimeout>>();

  const MULTIPLIERS: Record<string, number> = { '3': 1.9, '6': 2.8, '12': 4.2, '24': 6.5, '36': 9.8, '60': 18 };

  useEffect(() => {
    const ri = setInterval(() => {
      setReturns(r => parseFloat((r + (Math.random() * 6 + 2) / 1000).toFixed(1)));
      setFlash(true);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(false), 300);
    }, 800);
    const pi = setInterval(() => setPartners(p => Math.max(1240, Math.min(1262, p + (Math.random() > 0.5 ? 1 : -1)))), 22000);
    return () => { clearInterval(ri); clearInterval(pi); if (flashTimeout.current) clearTimeout(flashTimeout.current); };
  }, []);

  const projected = Math.round(simAmount * MULTIPLIERS[simHorizon]);
  const presets = [500, 3000, 5000, 10000];
  const horizonPresets = [
    { value: '3', label: '3M' }, { value: '6', label: '6M' }, { value: '12', label: '1Y' },
    { value: '24', label: '2Y' }, { value: '36', label: '3Y' }, { value: '60', label: '5Y' },
  ];

  const chartPoints = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const mult = 1 + (MULTIPLIERS[simHorizon] - 1) * t;
    const y = simAmount * mult;
    return { x: (i / 19) * 540 + 30, y: 150 - ((y - simAmount) / (projected - simAmount || 1)) * 120 };
  });
  const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L570,160 L30,160 Z`;

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

      <div className="hidden lg:flex flex-col justify-end border-l border-b1 relative z-[1] animate-fadeIn">
        <div className="grid grid-cols-2">
          {[
            { label: 'Live Returns', value: `$${returns.toFixed(1)}B`, cls: flash ? 'text-[#e8c96a]' : 'text-asp-green', sub: 'Total generated' },
            { label: 'Capital Deployed', value: '$1.24B', cls: 'text-t1', sub: 'Across all funds' },
            { label: 'Average ROI', value: '27.3%', cls: 'text-gold', sub: 'Partner average' },
            { label: 'Active Partners', value: partners.toLocaleString(), cls: 'text-t1', sub: 'Across 6 continents' },
          ].map((stat, i) => (
            <div key={i} className={`py-9 px-8 border-b1 ${i < 2 ? '' : 'border-t'} ${i % 2 === 1 ? 'border-l' : ''}`}>
              <div className="font-label text-[0.55rem] text-t4 tracking-[0.2em] uppercase mb-2">{stat.label}</div>
              <div className={`font-mono text-[1.6rem] tabular-nums tracking-[-0.02em] mb-1 transition-colors duration-300 ${stat.cls}`}>{stat.value}</div>
              <div className="font-body text-[0.72rem] text-t4">{stat.sub}</div>
            </div>
          ))}
        </div>
        <div className="h-[200px] border-t border-b1 relative overflow-hidden">
          <div className="font-label text-[0.55rem] text-t4 tracking-[0.15em] uppercase absolute top-3 left-5">General Fund Performance · 1972–2026</div>
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

      {showSimulator && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={() => setShowSimulator(false)} />
          <div className="relative bg-void border border-b2 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center py-4 px-6 border-b border-b1">
              <span className="font-label text-[0.72rem] text-gold tracking-[0.2em] uppercase">Project Your Growth</span>
              <button onClick={() => setShowSimulator(false)} className="font-mono text-t3 text-lg bg-transparent border-none cursor-pointer hover:text-t1 transition-colors">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-3">Investment Amount</div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {presets.map(p => (
                    <button key={p} onClick={() => setSimAmount(p)}
                      className={`font-label text-[0.62rem] tracking-[0.1em] uppercase py-2 px-4 cursor-pointer transition-all border min-h-[40px] ${simAmount === p ? 'bg-gold text-void border-gold' : 'bg-transparent text-t3 border-b2 hover:border-b3'}`}>
                      ${(p >= 1000 ? (p / 1000) + 'K' : p)}
                    </button>
                  ))}
                </div>
                <input type="range" min={500} max={100000} step={500} value={simAmount}
                  onChange={e => setSimAmount(Number(e.target.value))}
                  className="w-full accent-[hsl(43,55%,54%)] h-1 cursor-pointer" />
                <div className="font-mono text-[1.4rem] text-gold mt-2">${simAmount.toLocaleString()}</div>
              </div>

              <div className="mb-6">
                <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-3">Time Horizon</div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {horizonPresets.map(h => (
                    <button key={h.value} onClick={() => setSimHorizon(h.value)}
                      className={`font-label text-[0.62rem] tracking-[0.1em] uppercase py-2 px-4 cursor-pointer transition-all border min-h-[40px] ${simHorizon === h.value ? 'bg-gold text-void border-gold' : 'bg-transparent text-t3 border-b2 hover:border-b3'}`}>
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-s1 border border-b1 p-5 mb-5">
                <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">📈 Projected Growth ({MULTIPLIERS[simHorizon]}x)</div>
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
                  <span>Today</span>
                  <span>{simHorizon} months</span>
                </div>
              </div>

              <div className="font-body text-[0.72rem] text-t4 leading-[1.7] mb-5">
                Based on {MULTIPLIERS[simHorizon]}x multiplier for {simHorizon}-month horizon. Projections are illustrative. All investments involve risk.
              </div>

              <div className="flex gap-3">
                <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all no-underline inline-block min-h-[48px] flex items-center">
                  Invest ${simAmount >= 1000 ? (simAmount / 1000) + 'K' : simAmount} Now →
                </Link>
                <button onClick={() => navigator.clipboard.writeText(`Adams Streett Partners: $${simAmount.toLocaleString()} invested over ${simHorizon} months → $${projected.toLocaleString()} projected (${MULTIPLIERS[simHorizon]}x)`)}
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
