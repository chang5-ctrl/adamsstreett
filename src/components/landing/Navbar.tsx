import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FUNDS } from '@/data/funds';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

const NAV_ITEMS = [
  { label: 'Funds', id: 's-funds' },
  { label: 'Staking Pools', id: 's-staking' },
  { label: 'Partner Tiers', id: 's-tiers' },
  { label: 'Testimonials', id: 's-proof' },
  { label: 'Monthly Briefing', id: 's-briefing' },
];

const Navbar = ({ onScrollTo }: NavbarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [partners, setPartners] = useState(1247);

  useEffect(() => {
    const pi = setInterval(() => setPartners(p => Math.max(1240, Math.min(1265, p + (Math.random() > 0.5 ? 1 : -1)))), 20000);
    return () => clearInterval(pi);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(5,5,5,0.92)] backdrop-blur-[20px] border-b border-b1 flex items-center justify-between px-[52px] z-[100] transition-all duration-300 max-md:px-5">
        <Link to="/" className="flex items-center gap-3.5 no-underline">
          <span className="font-heading text-[1.15rem] font-medium text-gold tracking-[0.05em] border border-gold-dim px-2.5 py-1">ASP</span>
          <div className="flex flex-col gap-px">
            <span className="font-label text-[0.72rem] text-t2 tracking-[0.15em] uppercase">Adams Streett Partners</span>
            <span className="font-label text-[0.5rem] text-t4 tracking-[0.2em] uppercase">Private Investment · Est. 1972</span>
          </div>
        </Link>

        {/* Hamburger trigger — desktop + mobile */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-3 min-w-[44px] min-h-[44px] items-center justify-center relative z-[110]"
          aria-label="Menu"
        >
          <span className={`block w-[22px] h-[1.5px] bg-gold transition-all duration-400 origin-center ${drawerOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <span className={`block w-[22px] h-[1.5px] bg-gold transition-all duration-300 ${drawerOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-[22px] h-[1.5px] bg-gold transition-all duration-400 origin-center ${drawerOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[105] bg-[rgba(0,0,0,0.6)] transition-opacity duration-200 ${drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[108] w-[380px] max-md:w-full bg-base border-l border-b1 overflow-y-auto transition-transform duration-400 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="pt-[80px] pb-8 px-8">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-6">
            <span className="font-heading text-[1.15rem] font-medium text-gold tracking-[0.05em] border border-gold-dim px-2.5 py-1">ASP</span>
            <div className="flex flex-col gap-px">
              <span className="font-label text-[0.72rem] text-t2 tracking-[0.15em] uppercase">Adams Streett Partners</span>
              <span className="font-label text-[0.5rem] text-t4 tracking-[0.2em] uppercase">Private Investment · Est. 2024</span>
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--b1))] my-5" />

          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { onScrollTo(item.id); setDrawerOpen(false); }}
                className="text-left font-heading text-[1.4rem] font-light text-t2 py-3 px-4 bg-transparent border-none border-l-2 border-l-transparent cursor-pointer hover:text-gold hover:border-l-[hsl(var(--gold))] transition-all min-h-[52px]"
                style={{
                  opacity: drawerOpen ? 1 : 0,
                  transform: drawerOpen ? 'translateX(0)' : 'translateX(20px)',
                  transition: `opacity 300ms ${i * 50 + 200}ms, transform 300ms ${i * 50 + 200}ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms, border-color 200ms`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-[hsl(var(--b1))] my-5" />

          {/* Live stats */}
          <div className="flex flex-col gap-3 px-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="font-label text-[0.58rem] text-t4 tracking-[0.18em] uppercase">Active Partners</span>
              <span className="font-mono text-[0.82rem] text-gold tabular-nums">{partners.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label text-[0.58rem] text-t4 tracking-[0.18em] uppercase">Capital Deployed</span>
              <span className="font-mono text-[0.82rem] text-t1">$4.8B</span>
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--b1))] my-5" />

          {/* Funds quick list */}
          <div className="px-4 mb-5">
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase mb-3">21 Investment Products</div>
            <div className="max-h-[30vh] overflow-y-auto flex flex-col gap-px">
              {FUNDS.map((fund, i) => (
                <button key={i} onClick={() => { onScrollTo('s-funds'); setDrawerOpen(false); }}
                  className="w-full text-left py-2.5 px-3 bg-transparent border-none cursor-pointer hover:bg-s2 transition-colors min-h-[40px] flex justify-between items-center gap-2">
                  <span className="font-body text-[0.75rem] text-t3 truncate">{fund.name}</span>
                  <span className="font-mono text-[0.58rem] text-gold flex-shrink-0">{fund.apy}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--b1))] my-5" />

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 px-4">
            <Link to="/auth" onClick={() => setDrawerOpen(false)}
              className="font-label text-[0.68rem] tracking-[0.15em] uppercase text-gold border border-gold py-3.5 px-6 no-underline text-center hover:bg-gold hover:text-void transition-all min-h-[48px] flex items-center justify-center">
              Partner Login
            </Link>
            <Link to="/auth" onClick={() => setDrawerOpen(false)}
              className="font-label text-[0.68rem] tracking-[0.15em] uppercase text-void bg-gold border border-gold py-3.5 px-6 no-underline text-center hover:bg-gold-bright transition-all min-h-[48px] flex items-center justify-center">
              Request Access
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-8 px-4">
            <div className="font-mono text-[0.58rem] text-t4">adamsstreettspartners@gmail.com</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
