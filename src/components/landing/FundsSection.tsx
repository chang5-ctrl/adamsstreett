import { useState } from 'react';
import { FUNDS, SPONSORED_FUNDS } from '@/data/funds';

const riskColors: Record<string, string> = {
  low: 'text-asp-teal border-[hsl(var(--teal))]',
  mod: 'text-asp-amber border-[hsl(var(--amber))]',
  high: 'text-[#f97316] border-[#f97316]',
  top: 'text-asp-red border-[hsl(var(--red))]',
};

const fundBadges: Record<string, { text: string; color: string }> = {
  'African Unicorn Fund': { text: '🔥 Near Capacity', color: 'text-asp-red border-[hsl(var(--red))]' },
  'Adams Streett Frontier Fund': { text: '🔥 Near Capacity', color: 'text-asp-red border-[hsl(var(--red))]' },
  'Longevity Fund': { text: '✨ New Launch', color: 'text-gold border-gold' },
  'Web3 Infrastructure Fund': { text: '✨ New Launch', color: 'text-gold border-gold' },
  'Alpha Fund': { text: '📈 Top Performer Q1', color: 'text-asp-green border-[hsl(var(--green))]' },
  'IPO Access Fund': { text: '📈 Top Performer Q1', color: 'text-asp-green border-[hsl(var(--green))]' },
};

const tierLocked: Record<string, string> = {
  'Alpha Fund': '👑 Premium+ Only',
  'IPO Access Fund': '👑 Premium+ Only',
};

const fundGradients: Record<string, string> = {
  'African Unicorn Fund': 'from-[#1a3a2a] to-[#0a1510]',
  'Luxury Assets Fund': 'from-[#2a1f0a] to-[#100d04]',
  'Adams Streett Frontier Fund': 'from-[#0a1a2e] to-[#040a14]',
  'Sports Capital Fund': 'from-[#1a0a2a] to-[#0a0414]',
  'Longevity Fund': 'from-[#0a2a1a] to-[#040f0a]',
  'Web3 Infrastructure Fund': 'from-[#0a1a2e] to-[#040a14]',
  'Real Estate Fund': 'from-[#1a1a0a] to-[#0a0a04]',
  'Music & Royalties Fund': 'from-[#2a0a1a] to-[#14040a]',
};

const FundsSection = () => {
  const [filter, setFilter] = useState('all');
  const cats = [
    { key: 'all', label: 'All Funds' },
    { key: 'income', label: 'Income' },
    { key: 'growth', label: 'Growth' },
    { key: 'frontier', label: 'Frontier' },
    { key: 'ethical', label: 'Ethical' },
  ];
  const filtered = filter === 'all' ? FUNDS : FUNDS.filter(f => f.cat === filter);

  return (
    <section id="s-funds" className="py-24 px-[52px] max-lg:px-7 border-b border-b1">
      <div className="mb-16">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Investment Products</div>
        <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">21 Institutional-Grade Funds</h2>
        <div className="w-12 h-px bg-gold mb-4" />
        <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px]">From private equity to space technology. From Sharia-compliant instruments to African venture. Start from $500.</p>
      </div>
      <div className="flex justify-between items-center mb-10 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
        <div className="flex border border-b1 max-sm:flex-wrap">
          {cats.map(c => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className={`font-label text-[0.62rem] tracking-[0.12em] uppercase py-[9px] px-[18px] cursor-pointer border-r border-b1 last:border-r-0 transition-all min-h-[44px] ${filter === c.key ? 'bg-gold text-void' : 'text-t3 bg-transparent hover:bg-s2 hover:text-t2'}`}>
              {c.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[0.7rem] text-t4">Showing {filtered.length} funds</span>
      </div>
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
        {filtered.map((fund, i) => {
          const badge = fundBadges[fund.name];
          const tier = tierLocked[fund.name];
          const gradient = fundGradients[fund.name];
          return (
            <div key={i} className="bg-s1 cursor-pointer hover:bg-s2 transition-colors relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-0 bg-gold transition-all duration-200 group-hover:w-[3px] z-10" />
              {gradient && (
                <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              )}
              <div className="relative z-[1]">
                <div className="py-[22px] px-6 border-b border-b1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-heading text-[0.95rem] text-t1 group-hover:text-gold transition-colors">{fund.name}</div>
                  </div>
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span className="font-label text-[0.52rem] tracking-[0.12em] uppercase py-0.5 px-2 border border-b2 text-t3">{fund.badge}</span>
                    <span className={`font-label text-[0.52rem] tracking-[0.1em] uppercase py-0.5 px-2 border ${riskColors[fund.risk]}`}>{fund.riskLabel}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {badge && <span className={`font-label text-[0.5rem] tracking-[0.1em] uppercase py-0.5 px-2 border ${badge.color}`}>{badge.text}</span>}
                    {tier && <span className="font-label text-[0.5rem] tracking-[0.1em] uppercase py-0.5 px-2 border border-gold text-gold">{tier}</span>}
                  </div>
                </div>
                <div className="py-[22px] px-6">
                  <div className="font-label text-[0.55rem] text-t4 tracking-[0.15em] uppercase mb-1">Target APY</div>
                  <div className="font-mono text-[1.9rem] text-gold tracking-[-0.02em] mb-4">{fund.apy}</div>
                  <div className="flex justify-between py-[7px] border-b border-b1">
                    <span className="font-body text-[0.72rem] text-t3">$500 → 1 Year</span>
                    <span className="font-mono text-[0.72rem] text-asp-green">{fund.returns1y}</span>
                  </div>
                  <div className="flex justify-between py-[7px] border-b border-b1">
                    <span className="font-body text-[0.72rem] text-t3">$500 → 3 Years</span>
                    <span className="font-mono text-[0.72rem] text-asp-green">{fund.returns3y}</span>
                  </div>
                  <div className="flex justify-between py-[7px]">
                    <span className="font-body text-[0.72rem] text-t3">Minimum</span>
                    <span className="font-mono text-[0.72rem] text-gold">From $500</span>
                  </div>
                </div>
                <div className="py-3.5 px-6 border-t border-b1 font-label text-[0.55rem] text-t4 tracking-[0.08em] flex justify-between items-center">
                  <span>{fund.footer}</span>
                  <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">View Fund →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FundsSection;
