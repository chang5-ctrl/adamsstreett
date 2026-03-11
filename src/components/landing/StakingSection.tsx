const pools = [
  { apy: '14%', name: 'Flex Pool', desc: '90-day lock period. Ideal for partners seeking predictable short-term yield without long-term commitment exposure.', rows: [
    { l: 'Lock Period', v: '90 Days' }, { l: 'Minimum', v: '$100,000' }, { l: '$100K Matures To', v: '$103,500', green: true }, { l: 'Availability', v: 'All Tiers', green: true }
  ]},
  { apy: '22%', name: 'Growth Pool', desc: '180-day lock period. Our most popular staking instrument for partners prioritising compound growth over liquidity.', rows: [
    { l: 'Lock Period', v: '180 Days' }, { l: 'Minimum', v: '$100,000' }, { l: '$100K Matures To', v: '$111,000', green: true }, { l: 'Availability', v: 'All Tiers', green: true }
  ]},
  { apy: '35%', name: 'Apex Pool', desc: '365-day lock period. Exclusively available to Silver and Gold tier partners. Maximum yield instrument on the platform.', rows: [
    { l: 'Lock Period', v: '365 Days' }, { l: 'Minimum', v: '$250,000' }, { l: '$250K Matures To', v: '$337,500', gold: true }, { l: 'Availability', v: 'Silver+ Only', gold: true }
  ]},
];

const StakingSection = () => (
  <section id="s-staking" className="py-24 px-[52px] max-lg:px-7 border-b border-b1 bg-base">
    <div className="mb-16">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Staking Pools</div>
      <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">Lock Capital. Earn More.</h2>
      <div className="w-12 h-px bg-gold mb-4" />
      <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px]">Partner commitment pools with fixed yield rates above market. Lock periods range from 90 to 365 days. Returns paid at maturity.</p>
    </div>
    <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
      {pools.map((p, i) => (
        <div key={i} className="bg-s1 py-9 px-[30px]">
          <div className="font-label text-[0.55rem] text-t4 tracking-[0.18em] uppercase mb-1.5">Fixed Annual Yield</div>
          <div className="font-mono text-[2.6rem] text-gold tracking-[-0.03em] mb-3">{p.apy}</div>
          <div className="font-heading text-[1.1rem] text-t1 mb-2.5">{p.name}</div>
          <p className="font-body text-[0.8rem] text-t3 leading-[1.75] mb-5">{p.desc}</p>
          <div className="flex flex-col border-t border-b1">
            {p.rows.map((r, j) => (
              <div key={j} className="flex justify-between py-2.5 border-b border-b1">
                <span className="font-label text-[0.6rem] text-t4 tracking-[0.12em] uppercase">{r.l}</span>
                <span className={`font-mono text-[0.75rem] ${r.green ? 'text-asp-green' : r.gold ? 'text-gold' : 'text-t2'}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StakingSection;
