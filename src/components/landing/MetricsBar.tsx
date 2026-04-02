import { useState, useEffect, useRef } from 'react';

const MetricsBar = () => {
  const [returns, setReturns] = useState(65.8);
  const [partners, setPartners] = useState(1247);
  const [flash, setFlash] = useState(false);
  const flashTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const ri = setInterval(() => {
      setReturns(r => {
        const increment = (Math.random() * 6 + 2) / 1000; // $2M-$8M in billions
        return parseFloat((r + increment).toFixed(1));
      });
      setFlash(true);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(false), 300);
    }, 800);
    const pi = setInterval(() => setPartners(p => Math.max(1240, Math.min(1265, p + (Math.random() > 0.5 ? 1 : -1)))), 20000);
    return () => { clearInterval(ri); clearInterval(pi); if (flashTimeout.current) clearTimeout(flashTimeout.current); };
  }, []);

  const metrics = [
    { label: 'Total Returns Generated', value: `$${returns.toFixed(1)}B`, change: '▲ Live', isReturns: true },
    { label: 'Capital Deployed', value: '$4.8B', change: '▲ +$24M this week' },
    { label: 'Active Partners', value: partners.toLocaleString(), change: '▲ +14 this week' },
    { label: 'Investment Products', value: '21 Funds', change: '▲ 6 continents' },
    { label: 'Minimum Commitment', value: '$500', change: 'BTC · ETH · USDC · USDT', goldValue: true, grayChange: true },
  ];

  return (
    <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 border-b border-b1 bg-base">
      {metrics.map((m, i) => (
        <div key={i} className="py-7 px-6 border-r border-b1 last:border-r-0 relative group">
          <div className="absolute left-0 top-0 bottom-0 w-0 bg-gold transition-all duration-200 group-hover:w-0.5" />
          <div className="font-label text-[0.55rem] text-t4 tracking-[0.2em] uppercase mb-2">{m.label}</div>
          <div className={`font-mono text-[1.3rem] tabular-nums transition-colors duration-300 ${m.goldValue ? 'text-gold' : 'isReturns' in m && m.isReturns ? (flash ? 'text-[#e8c96a]' : 'text-t1') : 'text-t1'}`}>{m.value}</div>
          <div className={`font-mono text-[0.68rem] mt-1 ${m.grayChange ? 'text-t3' : 'text-asp-green'}`}>{m.change}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;
