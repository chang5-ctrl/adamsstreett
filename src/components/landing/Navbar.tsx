import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FUNDS } from '@/data/funds';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

interface DropdownState {
  open: boolean;
  openedAt: number;
}

const Navbar = ({ onScrollTo }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownState>({ open: false, openedAt: 0 });
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setDropdown({ open: true, openedAt: Date.now() });
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdown(prev => {
      // Minimum 800ms open time
      if (Date.now() - prev.openedAt < 800) {
        closeTimerRef.current = setTimeout(() => setDropdown(p => ({ ...p, open: false })), 300);
        return prev;
      }
      return { ...prev, open: false };
    });
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(closeDropdown, 300);
  }, [closeDropdown]);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Close on outside click for mobile
  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  const navItems = [
    { label: 'Funds', id: 's-funds', hasDropdown: true },
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
            <div key={item.id} className="relative"
              ref={item.hasDropdown ? dropdownRef : undefined}
              onMouseEnter={item.hasDropdown ? openDropdown : undefined}
              onMouseLeave={item.hasDropdown ? scheduleClose : undefined}
            >
              <button
                onClick={() => { onScrollTo(item.id); setDropdown(p => ({ ...p, open: false })); }}
                className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none py-4"
              >
                {item.label} {item.hasDropdown && '▾'}
              </button>

              {/* Funds dropdown */}
              {item.hasDropdown && dropdown.open && (
                <>
                  {/* Hover bridge */}
                  <div className="absolute top-full left-0 w-full h-3" />
                  <div
                    className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[560px] max-h-[70vh] overflow-y-auto bg-void border border-b2 z-[110] animate-fadeUp"
                    style={{ animationDuration: '200ms' }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="py-3 px-5 border-b border-b1 flex justify-between items-center">
                      <span className="font-label text-[0.58rem] text-gold tracking-[0.2em] uppercase">21 Investment Products</span>
                      <button onClick={() => { onScrollTo('s-funds'); setDropdown(p => ({ ...p, open: false })); }} className="font-label text-[0.52rem] text-t3 tracking-[0.1em] uppercase bg-transparent border-none cursor-pointer hover:text-t2">View All →</button>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-[hsl(var(--b1))]">
                      {FUNDS.slice(0, 12).map((fund, i) => (
                        <button
                          key={i}
                          onClick={() => { onScrollTo('s-funds'); setDropdown(p => ({ ...p, open: false })); }}
                          className="bg-s1 hover:bg-s2 transition-colors py-3 px-4 text-left cursor-pointer border-none flex justify-between items-center gap-2 min-h-[44px]"
                        >
                          <span className="font-body text-[0.75rem] text-t2 truncate">{fund.name}</span>
                          <span className="font-mono text-[0.62rem] text-gold flex-shrink-0">{fund.apy}</span>
                        </button>
                      ))}
                    </div>
                    <div className="py-3 px-5 border-t border-b1">
                      <button onClick={() => { onScrollTo('s-funds'); setDropdown(p => ({ ...p, open: false })); }} className="font-label text-[0.58rem] text-gold tracking-[0.12em] uppercase bg-transparent border-none cursor-pointer hover:text-gold-bright">+ 9 More Funds →</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-t3 border border-b2 px-5 py-2 no-underline hover:text-t1 hover:border-b3 transition-all max-md:hidden min-h-[40px] flex items-center">Login</Link>
          <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-void bg-gold border-none px-[22px] py-[9px] no-underline hover:bg-gold-bright transition-all max-md:hidden min-h-[40px] flex items-center">Request Access</Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hidden max-md:flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-3 min-w-[44px] min-h-[44px] items-center justify-center"
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
        <div className={`absolute top-[60px] left-0 bottom-0 w-[300px] bg-void border-r border-b1 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="py-6">
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase px-6 mb-3">Navigation</div>
            {navItems.map(item => (
              <button key={item.id} onClick={() => { onScrollTo(item.id); setMobileOpen(false); }}
                className="w-full text-left font-body text-[0.88rem] text-t2 py-4 px-6 bg-transparent border-none cursor-pointer hover:bg-s2 hover:text-t1 transition-colors min-h-[48px]">
                {item.label}
              </button>
            ))}
            <div className="h-px bg-[hsl(var(--b1))] my-4 mx-6" />
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase px-6 mb-3">Funds</div>
            <div className="max-h-[40vh] overflow-y-auto">
              {FUNDS.map((fund, i) => (
                <button key={i} onClick={() => { onScrollTo('s-funds'); setMobileOpen(false); }}
                  className="w-full text-left py-3 px-6 bg-transparent border-none cursor-pointer hover:bg-s2 transition-colors min-h-[44px] flex justify-between items-center">
                  <span className="font-body text-[0.78rem] text-t3 truncate">{fund.name}</span>
                  <span className="font-mono text-[0.58rem] text-gold flex-shrink-0 ml-2">{fund.apy}</span>
                </button>
              ))}
            </div>
            <div className="h-px bg-[hsl(var(--b1))] my-4 mx-6" />
            <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase px-6 mb-3">Account</div>
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block font-body text-[0.88rem] text-t2 py-4 px-6 no-underline hover:bg-s2 hover:text-t1 transition-colors min-h-[48px]">Login</Link>
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block font-body text-[0.88rem] text-gold py-4 px-6 no-underline hover:bg-s2 transition-colors min-h-[48px]">Request Access →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
