const payments = [
  { icon: '₿', name: 'Bitcoin', desc: 'Direct BTC transfer. Blockchain-detected via BlockCypher. Portfolio activates automatically upon confirmation.', tag: 'Auto-Detection', active: true },
  { icon: 'Ξ', name: 'Ethereum', desc: 'Direct ETH transfer. Etherscan verified. USD value locked at submission price.', tag: 'Auto-Detection', active: true },
  { icon: '◎', name: 'USDC', desc: 'USDC on Ethereum network. 1:1 USD value. No price conversion or exchange required.', tag: 'Stable · No Volatility', active: true },
  { icon: '⇄', name: 'Wire Transfer', desc: 'Traditional bank wire for commitments above $500,000. Available to Silver and Gold tier partners.', tag: 'Coming Soon', active: false },
];

const PaymentSection = () => (
  <section className="py-24 px-[52px] max-lg:px-7 border-b border-b1 bg-base">
    <div className="mb-16 text-center">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Payment Infrastructure</div>
      <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">Commit Capital Your Way</h2>
      <div className="w-12 h-px bg-gold mx-auto mb-4" />
      <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px] mx-auto">BTC, ETH, and USDC accepted. Real-time blockchain confirmation activates your portfolio automatically within minutes.</p>
    </div>
    <div className="grid grid-cols-4 max-sm:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
      {payments.map((p, i) => (
        <div key={i} className={`bg-s1 py-8 px-7 cursor-pointer transition-colors ${p.active ? 'hover:bg-s2' : 'opacity-[0.38] cursor-not-allowed'}`}>
          <div className={`font-mono text-[1.6rem] mb-[18px] ${p.active ? 'text-gold' : 'text-t3'}`}>{p.icon}</div>
          <div className={`font-heading text-base mb-2 ${p.active ? 'text-t1' : 'text-t3'}`}>{p.name}</div>
          <p className="font-body text-[0.78rem] text-t3 leading-[1.75]">{p.desc}</p>
          <span className={`font-label text-[0.52rem] tracking-[0.12em] uppercase py-0.5 px-2 border inline-block mt-3.5 ${p.active ? 'border-[hsl(var(--teal))] text-asp-teal' : 'border-b2 text-t4'}`}>{p.tag}</span>
        </div>
      ))}
    </div>
  </section>
);

export default PaymentSection;
