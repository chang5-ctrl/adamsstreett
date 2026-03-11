import { Link } from 'react-router-dom';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

const Navbar = ({ onScrollTo }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(5,5,5,0.92)] backdrop-blur-[20px] border-b border-b1 flex items-center justify-between px-[52px] z-[100] transition-all duration-300 max-md:px-5">
      <Link to="/" className="flex items-center gap-3.5 no-underline">
        <span className="font-heading text-[1.15rem] font-medium text-gold tracking-[0.05em] border border-gold-dim px-2.5 py-1">ASP</span>
        <div className="flex flex-col gap-px">
          <span className="font-label text-[0.72rem] text-t2 tracking-[0.15em] uppercase">Adams Streett Partners</span>
          <span className="font-label text-[0.5rem] text-t4 tracking-[0.2em] uppercase">Private Investment · Est. 2024</span>
        </div>
      </Link>
      <div className="flex gap-10 items-center max-md:hidden">
        <button onClick={() => onScrollTo('s-funds')} className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none">Funds</button>
        <button onClick={() => onScrollTo('s-staking')} className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none">Staking</button>
        <button onClick={() => onScrollTo('s-tiers')} className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none">Partner Tiers</button>
        <button onClick={() => onScrollTo('s-proof')} className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-t3 hover:text-t2 transition-colors cursor-pointer bg-transparent border-none">Partners</button>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-t3 border border-b2 px-5 py-2 no-underline hover:text-t1 hover:border-b3 transition-all">Login</Link>
        <Link to="/auth" className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-void bg-gold border-none px-[22px] py-[9px] no-underline hover:bg-gold-bright transition-all">Request Access</Link>
      </div>
    </nav>
  );
};

export default Navbar;
