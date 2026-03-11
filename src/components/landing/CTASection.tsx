import { Link } from 'react-router-dom';

const CTASection = () => (
  <div className="py-24 px-[52px] max-lg:px-7 bg-base">
    <div className="border border-b2 py-[72px] px-[72px] max-sm:px-7 max-sm:py-10 relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(201,168,76,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold-dim))] to-transparent" />
      <div className="grid grid-cols-[1fr_auto] max-lg:grid-cols-1 gap-16 items-center">
        <div>
          <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Begin Your Partnership</div>
          <h2 className="font-heading text-[clamp(1.8rem,2.5vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-4 text-t1">The Minimum Is $100,000.<br />The Ceiling Is Yours.</h2>
          <p className="text-[0.9rem] text-t3 leading-[1.85] max-w-[480px]">Join over 1,200 accredited investors, athletes, entertainers, and corporate brands who have committed capital to Adams Streett Partners. BTC, ETH, and USDC accepted.</p>
        </div>
        <div className="flex flex-col gap-3 items-end max-lg:items-start flex-shrink-0">
          <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-[15px] px-11 cursor-pointer hover:bg-gold-bright transition-all no-underline inline-block whitespace-nowrap">Request Partnership Access</Link>
          <span className="font-mono text-[0.65rem] text-t4 text-center">Accredited investors only · Not available to US persons</span>
        </div>
      </div>
    </div>
  </div>
);

export default CTASection;
