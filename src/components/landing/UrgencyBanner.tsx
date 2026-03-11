import { Link } from 'react-router-dom';

const UrgencyBanner = () => (
  <div className="bg-s2 border-b border-b1 py-2.5 px-6 flex items-center justify-center gap-3 text-center flex-wrap">
    <span className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-asp-amber">⚠️ Only 3 spots remain for Q2 2026 onboarding</span>
    <span className="font-body text-[0.68rem] text-t3 max-md:hidden">Last chance before next allocation closes.</span>
    <Link to="/auth" className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-gold no-underline hover:text-gold-bright transition-colors">Secure Yours →</Link>
  </div>
);

export default UrgencyBanner;
