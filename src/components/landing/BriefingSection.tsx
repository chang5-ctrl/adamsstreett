import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BriefingSection = () => {
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-04-01T15:00:00Z').getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff < 0) return;
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="py-24 px-[52px] max-lg:px-7 border-b border-b1">
      <div className="grid grid-cols-[1fr_auto] max-lg:grid-cols-1 gap-20 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[7px] h-[7px] rounded-full bg-[hsl(var(--red))] animate-livepulse" />
            <span className="font-label text-[0.62rem] text-asp-red tracking-[0.18em] uppercase">Live · Monthly Session</span>
          </div>
          <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">Monthly Investor Briefing</div>
          <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">Stay Ahead of<br />Every Market</h2>
          <div className="w-12 h-px bg-gold mb-4" />
          <p className="text-[0.9rem] text-t3 leading-[1.9] max-w-[540px] mb-8">Exclusive monthly sessions for active partners. Fund performance review, new product announcements, market outlook and partner Q&A. Limited seats per session.</p>
          <Link to="/auth" className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-[15px] px-11 cursor-pointer hover:bg-gold-bright transition-all no-underline inline-block">Reserve Your Seat</Link>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            {[
              { val: pad(countdown.d), label: 'Days' },
              { val: pad(countdown.h), label: 'Hours' },
              { val: pad(countdown.m), label: 'Mins' },
              { val: pad(countdown.s), label: 'Secs' },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <span className="font-mono text-[1.8rem] text-[hsl(var(--b3))] pb-5">:</span>}
                <div className="text-center">
                  <span className="font-mono text-[2.4rem] text-t1 block tabular-nums leading-none min-w-[56px] bg-s2 border border-b1 py-3 px-2">{u.val}</span>
                  <span className="font-label text-[0.55rem] text-t4 tracking-[0.15em] uppercase mt-1.5 block">{u.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="font-mono text-[0.7rem] text-t3 text-center">247 partners registered · Q2 2026 Session<br />Next: April 1, 2026 · 15:00 GMT</div>
        </div>
      </div>
    </section>
  );
};

export default BriefingSection;
