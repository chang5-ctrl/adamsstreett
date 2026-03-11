import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

const Navbar = ({ onScrollTo }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Funds', id: 's-funds' },
    { label: 'Staking', id: 's-staking' },
    { label: 'Partner Tiers', id: 's-tiers' },
    { label: 'Partners', id: 's-proof' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(5,5,5,0.92)] backdrop-blur-[20px] border-b border-b1 flex items-center justify-between px-[52px] z-[100] transition-all duration-300 max-md:px-5">
        <Link to="/" className="flex items-center gap-3.5 no-underline">
          <span className="font-heading text-[1.15rem] font-medium text-gold tracking-[0.05em] border border-gold-dim px-2.5 py-1">ASP</span>
          <div className="flex flex-col gap-px">
            <span className="font-label text-[0.72rem] text-t2 tracking-[0.15em] uppercase">Adams Streett Partners</span>
            <span className="font-label text-[0.5rem] text-t4 tracking-[0.2em] uppercase">Private Investment · Est. 2024</span>
          </div>
        </Link>
        <div className="flex gap-10 items-center max-md:hidden">
          {navItems.map(item => (
            <button key={item.id} onClick={() => onScrollTo(item.id)} className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none">{item.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-t3 border border-b2 px-5 py-2 no-underline hover:text-t1 hover:border-b3 transition-all max-md:hidden">Login</Link>
          <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-void bg-gold border-none px-[22px] py-[9px] no-underline hover:bg-gold-bright transition-all max-md:hidden">Request Access</Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hidden max-md:flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
            aria-label="Menu"
          >
            <span className={`block w-5 h-[1.5px] bg-[hsl(var(--text))] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[hsl(var(--text))] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[hsl(var(--text))] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out panel */}
      <div className={`fixed inset-0 z-[99] transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-[rgba(0,0,0,0.6)] transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-[60px] left-0 bottom-0 w-[280px] bg-void border-r border-b1 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="py-6">
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase px-6 mb-3">Navigation</div>
            {navItems.map(item => (
              <button key={item.id} onClick={() => { onScrollTo(item.id); setMobileOpen(false); }}
                className="w-full text-left font-body text-[0.88rem] text-t2 py-3.5 px-6 bg-transparent border-none cursor-pointer hover:bg-s2 hover:text-t1 transition-colors">
                {item.label}
              </button>
            ))}
            <div className="h-px bg-[hsl(var(--b1))] my-4 mx-6" />
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase px-6 mb-3">Account</div>
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block font-body text-[0.88rem] text-t2 py-3.5 px-6 no-underline hover:bg-s2 hover:text-t1 transition-colors">Login</Link>
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block font-body text-[0.88rem] text-gold py-3.5 px-6 no-underline hover:bg-s2 transition-colors">Request Access →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
