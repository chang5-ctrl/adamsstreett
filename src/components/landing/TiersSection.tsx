const tiers = [
  { name: 'Starter', color: '#cd7f32', range: 'From $500', perks: ['Access to General Fund, DeFi Yield & Fixed Income Bond', 'BTC, ETH and USDC payment methods', 'Bronze tier status', 'Monthly investor briefing participation', 'Portfolio analytics dashboard', 'Document vault access'], highlight: false },
  { name: 'Growth', color: '#c0c0c0', range: 'From $3,000', perks: ['Access to all funds except Frontier and Longevity', 'Silver tier status', '5% referral commission on all referred commitments', 'Flex Pool and Growth Pool staking access', 'Priority commitment processing', 'Secondary market trading access'], highlight: false },
  { name: 'Premium', color: 'hsl(43 55% 54%)', range: 'From $5,000', perks: ['Access to ALL 21 investment products', 'Gold tier status', 'Apex Pool staking (35% APY, 365-day)', 'Priority processing on all commitments', 'Personal portfolio intelligence reports', 'Early access to new fund launches', 'Wealth DNA Report generation'], highlight: true },
  { name: 'Elite', color: '#e5c158', range: '$10,000+', perks: ['Everything in Premium tier', 'Platinum tier status', 'ASP Black Card (exclusive digital partner credential)', 'Dedicated partner success manager', 'Same-day processing on all commitments', 'Bespoke investment strategy sessions', 'Co-investment deal flow access', 'Retirement Wealth Projector (personalised)'], highlight: false },
];

const TiersSection = () => (
  <section id="s-tiers" className="py-24 px-[52px] max-lg:px-7 border-b border-b1">
    <div className="mb-16 text-center">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Investment Tiers</div>
      <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">The Higher You Climb, The More You Earn</h2>
      <div className="w-12 h-px bg-gold mx-auto mb-4" />
      <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px] mx-auto">Start from just $500. Your tier unlocks exclusive funds, priority processing, and concierge access as you grow.</p>
    </div>
    <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
      {tiers.map((t, i) => (
        <div key={i} className={`bg-s1 py-9 px-[30px] relative overflow-hidden ${t.highlight ? 'bg-gold-glow2 border border-gold-dim' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: t.color }} />
          <div className="font-heading text-[2rem] font-light mb-1.5" style={{ color: t.color }}>{t.name}</div>
          <div className="font-mono text-[0.8rem] text-t3 mb-6">{t.range}</div>
          <div className="flex flex-col gap-2.5">
            {t.perks.map((p, j) => (
              <div key={j} className="font-body text-[0.8rem] text-t2 flex items-start gap-2.5 leading-[1.5]">
                <span className="text-gold font-mono text-[0.7rem] flex-shrink-0 mt-px">—</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TiersSection;
