import { Link } from 'react-router-dom';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

const Footer = ({ onScrollTo }: FooterProps) => (
  <footer className="py-[72px] px-[52px] max-lg:px-7 pb-10 border-t border-b1">
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] max-lg:grid-cols-2 max-sm:grid-cols-1 gap-12 mb-14">
      <div>
        <div className="font-heading text-base text-gold border border-gold-dim py-0.5 px-2.5 inline-block mb-4">ASP</div>
        <div className="font-heading text-[1.15rem] text-gold mb-1.5">Adams Streett Partners</div>
        <p className="text-[0.8rem] text-t4 leading-[1.8] max-w-[280px] mb-5">Private investment firm offering accredited investors exclusive institutional-grade opportunities across 21 funds. Minimum commitment $100,000.</p>
        <div className="font-mono text-[0.65rem] text-t3">adamsstreettspartners@gmail.com</div>
      </div>
      <div>
        <div className="font-label text-[0.6rem] text-t4 tracking-[0.2em] uppercase mb-5">Investment Products</div>
        <div className="flex flex-col gap-[11px]">
          {['General Fund', 'Private Equity Pool', 'Frontier Fund', 'Halal Investment Fund', 'African Unicorn Fund'].map(f => (
            <button key={f} onClick={() => onScrollTo('s-funds')} className="text-[0.8rem] text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none text-left p-0">{f}</button>
          ))}
          <button onClick={() => onScrollTo('s-funds')} className="text-[0.8rem] text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none text-left p-0">View All 21 Funds →</button>
        </div>
      </div>
      <div>
        <div className="font-label text-[0.6rem] text-t4 tracking-[0.2em] uppercase mb-5">Platform</div>
        <div className="flex flex-col gap-[11px]">
          {['Partner Dashboard', 'Staking Pools', 'Referral Program', 'Monthly Briefings', 'Returns Simulator', 'Request Access →'].map(l => (
            <Link key={l} to="/auth" className="text-[0.8rem] text-t3 hover:text-t2 transition-colors no-underline">{l}</Link>
          ))}
        </div>
      </div>
      <div>
        <div className="font-label text-[0.6rem] text-t4 tracking-[0.2em] uppercase mb-5">Partner Tiers</div>
        <div className="flex flex-col gap-[11px]">
          {['Bronze · $100K+', 'Silver · $500K+', 'Gold · $1M+', 'Compare Tiers'].map(t => (
            <button key={t} onClick={() => onScrollTo('s-tiers')} className="text-[0.8rem] text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none text-left p-0">{t}</button>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-b1 pt-7 flex justify-between items-start gap-10 max-sm:flex-col max-sm:gap-5">
      <p className="text-[0.7rem] text-t4 leading-[1.75] max-w-[640px]">All projected return figures are illustrative targets based on historical performance and strategy models. Past performance does not guarantee future results. All investments carry risk including possible loss of principal. Adams Streett Partners does not solicit or accept investments from US persons. This platform is available to accredited investors only. Adams Streett Partners is not a registered investment adviser. Nothing on this platform constitutes investment advice.</p>
      <div className="font-mono text-[0.62rem] text-t4 whitespace-nowrap text-right">© 2026 Adams Streett Partners<br />Private Investment</div>
    </div>
  </footer>
);

export default Footer;
