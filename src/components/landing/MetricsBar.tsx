import { useState, useEffect } from 'react';

const MetricsBar = () => {
  const [returns, setReturns] = useState(84729441);
  const [partners, setPartners] = useState(1247);

  useEffect(() => {
    const ri = setInterval(() => setReturns(r => r + Math.floor(Math.random() * 720 + 480)), 3000);
    const pi = setInterval(() => setPartners(p => Math.max(1240, Math.min(1262, p + (Math.random() > 0.5 ? 1 : -1)))), 22000);
    return () => { clearInterval(ri); clearInterval(pi); };
  }, []);

  const metrics = [
    { label: 'Live Returns', value: `$${returns.toLocaleString()}`, change: '▲ +$847 every 3s' },
    { label: 'Capital Deployed', value: '$1.24B', change: '▲ +$2.4M this week' },
    { label: 'Active Partners', value: partners.toLocaleString(), change: '▲ +14 this week' },
    { label: 'Investment Products', value: '21 Funds', change: '▲ 6 continents' },
    { label: 'Minimum Commitment', value: '$100,000', change: 'BTC · ETH · USDC', goldValue: true, grayChange: true },
  ];

  return (
    <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 border-b border-b1 bg-base">
      {metrics.map((m, i) => (
        <div key={i} className="py-7 px-6 border-r border-b1 last:border-r-0 relative group">
          <div className="absolute left-0 top-0 bottom-0 w-0 bg-gold transition-all duration-200 group-hover:w-0.5" />
          <div className="font-label text-[0.55rem] text-t4 tracking-[0.2em] uppercase mb-2">{m.label}</div>
          <div className={`font-mono text-[1.3rem] tabular-nums ${m.goldValue ? 'text-gold' : 'text-t1'}`}>{m.value}</div>
          <div className={`font-mono text-[0.68rem] mt-1 ${m.grayChange ? 'text-t3' : 'text-asp-green'}`}>{m.change}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;
