const TIERS = [
  {
    name: 'ASP Starter', price: 'Free', period: '', featured: false,
    features: ['Basic dashboard access', '3 fund limit (General, DeFi, Fixed Income)', 'Standard processing', 'Community access'],
    missing: ['Advanced analytics', 'All 21 funds', 'Priority processing', 'Dedicated concierge', 'Early fund access', 'Monthly briefing VIP'],
  },
  {
    name: 'ASP Pro', price: '$29', period: '/month', featured: true,
    features: ['Full dashboard access', 'All 21 funds unlocked', 'Advanced analytics & reports', 'Priority processing', '5% referral commission boost', 'Weekly market briefings'],
    missing: ['Dedicated concierge', 'Early fund access', 'Monthly briefing VIP seat'],
  },
  {
    name: 'ASP Elite', price: '$99', period: '/month', featured: false,
    features: ['Everything in Pro', 'Dedicated concierge', 'Early fund access (48h before public)', 'Monthly briefing VIP seat', 'ASP Black Card generation', 'Direct line to fund managers', 'Custom portfolio reports'],
    missing: [],
  },
];

const MembershipPage = () => (
  <div>
    <div className="mb-8">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Premium Access</div>
      <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">ASP Membership Tiers</h2>
      <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Unlock advanced features, analytics, and exclusive access.</p>
    </div>
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
      {TIERS.map((tier, i) => (
        <div key={i} className={`bg-s1 border p-6 flex flex-col ${tier.featured ? 'border-gold shadow-[0_0_24px_rgba(201,168,76,0.1)]' : 'border-b1'}`}>
          {tier.featured && <div className="font-label text-[0.5rem] text-gold tracking-[0.15em] uppercase mb-3">Most Popular</div>}
          <div className="font-heading text-[1.2rem] text-t1 mb-1">{tier.name}</div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="font-mono text-[2rem] text-gold">{tier.price}</span>
            <span className="font-mono text-[0.72rem] text-t3">{tier.period}</span>
          </div>
          <div className="flex flex-col gap-2.5 mb-6 flex-1">
            {tier.features.map((f, fi) => (
              <div key={fi} className="flex items-start gap-2 font-body text-[0.82rem] text-t2">
                <span className="text-gold flex-shrink-0">✓</span> {f}
              </div>
            ))}
            {tier.missing.map((f, fi) => (
              <div key={fi} className="flex items-start gap-2 font-body text-[0.82rem] text-t4">
                <span className="flex-shrink-0">—</span> {f}
              </div>
            ))}
          </div>
          {tier.price === 'Free' ? (
            <div className="font-label text-[0.62rem] text-t3 tracking-[0.12em] uppercase text-center py-3 border border-b1 min-h-[44px] flex items-center justify-center">Current Plan</div>
          ) : (
            <button className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-void bg-gold border-none py-3 cursor-pointer hover:bg-gold-bright transition-all min-h-[44px]">Subscribe →</button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default MembershipPage;
