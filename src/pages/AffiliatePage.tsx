import { AFFILIATE_PARTNERS } from '@/data/funds';

const AffiliatePage = () => (
  <div>
    <div className="mb-8">
      <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Partner Network</div>
      <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">Affiliate Partners</h2>
      <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Earn commissions by sharing trusted platforms with your network.</p>
    </div>
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
      {AFFILIATE_PARTNERS.map((p, i) => (
        <div key={i} className="bg-s1 border border-b1 p-6">
          <div className="font-heading text-[1rem] text-t1 mb-2">{p.name}</div>
          <div className="font-mono text-[1.8rem] text-gold mb-3">{p.commission}</div>
          <p className="font-body text-[0.82rem] text-t3 leading-[1.7] mb-5">{p.desc}</p>
          <button className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-2.5 px-6 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[44px]">Get Link →</button>
        </div>
      ))}
    </div>
  </div>
);

export default AffiliatePage;
