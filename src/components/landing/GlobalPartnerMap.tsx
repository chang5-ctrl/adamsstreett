import { useState, useEffect } from 'react';

const locations = [
  { name: 'London', x: 462, y: 145, partners: 186 },
  { name: 'Dubai', x: 575, y: 205, partners: 312 },
  { name: 'NYC', x: 240, y: 175, partners: 98 },
  { name: 'Singapore', x: 720, y: 270, partners: 142 },
  { name: 'Lagos', x: 445, y: 275, partners: 248 },
  { name: 'Sydney', x: 810, y: 370, partners: 64 },
  { name: 'Nairobi', x: 540, y: 290, partners: 89 },
  { name: 'Riyadh', x: 560, y: 215, partners: 108 },
];

const recentJoins = [
  'T. OKONKWO just joined from Lagos',
  'A. AL-SAUD committed $5K from Riyadh',
  'B. SCHMIDT joined from Zurich',
  'K. AL-RASHIDI committed $10K from Dubai',
  'C. NWOSU joined from Nairobi',
  'R. MENSAH committed $3K from Accra',
];

const GlobalPartnerMap = () => {
  const [currentJoin, setCurrentJoin] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoin(c => (c + 1) % recentJoins.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-[52px] max-lg:px-7 border-b border-b1">
      <div className="mb-12 text-center">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-3.5">🌍 Live Partner Network</div>
        <h2 className="font-heading text-[clamp(1.8rem,2.8vw,2.8rem)] font-light tracking-[-0.015em] leading-[1.15] mb-5 text-t1">1,247 Active · 6 Continents</h2>
        <div className="w-12 h-px bg-gold mx-auto mb-4" />
      </div>
      <div className="bg-s1 border border-b1 p-6 relative overflow-hidden">
        <svg viewBox="0 0 1000 440" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Simplified world map shapes */}
          <ellipse cx="200" cy="190" rx="115" ry="75" fill="hsl(var(--b1))" opacity="0.6" />
          <ellipse cx="225" cy="310" rx="72" ry="55" fill="hsl(var(--b1))" opacity="0.6" />
          <ellipse cx="462" cy="165" rx="82" ry="55" fill="hsl(var(--b1))" opacity="0.6" />
          <ellipse cx="518" cy="275" rx="92" ry="82" fill="hsl(var(--b1))" opacity="0.6" />
          <ellipse cx="685" cy="195" rx="135" ry="72" fill="hsl(var(--b1))" opacity="0.6" />
          <ellipse cx="825" cy="345" rx="62" ry="42" fill="hsl(var(--b1))" opacity="0.6" />

          {/* Connection lines */}
          {locations.map((loc, i) =>
            locations.slice(i + 1).map((loc2, j) => (
              <line key={`${i}-${j}`} x1={loc.x} y1={loc.y} x2={loc2.x} y2={loc2.y}
                stroke="hsl(43 55% 54%)" strokeWidth="0.4" opacity="0.08" />
            ))
          )}

          {/* Location dots */}
          {locations.map((loc, i) => (
            <g key={i}>
              {/* Pulse ring */}
              <circle cx={loc.x} cy={loc.y} r="4" fill="none" stroke="hsl(43 55% 54%)" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="4;18;4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              {/* Core dot */}
              <circle cx={loc.x} cy={loc.y} r="5" fill="hsl(43 55% 54%)" opacity="0.9">
                <animate attributeName="r" values="5;7;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              {/* Label */}
              <text x={loc.x} y={loc.y - 14} textAnchor="middle" fill="hsl(36 30% 91%)" fontSize="9" fontFamily="Barlow Condensed, sans-serif" letterSpacing="1.5" opacity="0.7">
                {loc.name.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        {/* Recent join notification */}
        <div className="mt-4 py-3 border-t border-b1 flex items-center justify-center gap-2 overflow-hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--green))] animate-livepulse flex-shrink-0" />
          <span className="font-mono text-[0.68rem] text-t3 animate-fadeUp" key={currentJoin}>{recentJoins[currentJoin]}</span>
        </div>
      </div>
    </section>
  );
};

export default GlobalPartnerMap;
