import { TICKER_ITEMS } from '@/data/funds';

const Ticker = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-s1 border-b border-b1 h-[34px] overflow-hidden flex items-center mt-[60px] relative">
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-[hsl(var(--s1))] to-transparent z-[2] pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[hsl(var(--s1))] to-transparent z-[2] pointer-events-none" />
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((item, i) => (
          <div key={i} className="font-mono text-[0.62rem] text-t4 px-8 border-r border-b1 flex items-center gap-2 h-[34px]">
            <span className="text-t3">{item.name}</span>
            <span>·</span>
            <span>{item.fund}</span>
            <span className="text-gold">{item.amount}</span>
            <span className="text-asp-green">✓ CONFIRMED</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
