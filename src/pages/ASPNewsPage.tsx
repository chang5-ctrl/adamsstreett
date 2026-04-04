import { useState, useEffect, useCallback } from 'react';

interface Signal {
  severity: 'CRITICAL' | 'ELEVATED' | 'WATCH' | 'NOMINAL';
  description: string;
  source: string;
  timestamp: string;
}

interface RiskMeter {
  label: string;
  score: number;
  status: string;
  color: string;
  lastUpdated: string;
}

const severityOrder = { CRITICAL: 0, ELEVATED: 1, WATCH: 2, NOMINAL: 3 };
const severityColors: Record<string, string> = {
  CRITICAL: 'bg-[hsl(var(--red))] text-white',
  ELEVATED: 'bg-[hsl(var(--amber))] text-void',
  WATCH: 'bg-gold text-void',
  NOMINAL: 'bg-[hsl(var(--green))] text-void',
};

const meterColor = (score: number) =>
  score < 34 ? 'bg-[hsl(var(--green))]' : score < 67 ? 'bg-[hsl(var(--amber))]' : 'bg-[hsl(var(--red))]';
const meterStatus = (score: number) =>
  score < 34 ? 'NOMINAL' : score < 67 ? 'ELEVATED' : 'CRITICAL';

const ASPNewsPage = () => {
  const [meters, setMeters] = useState<RiskMeter[]>([
    { label: 'Geopolitical Risk', score: 0, status: '—', color: '', lastUpdated: '' },
    { label: 'Economic Stress', score: 0, status: '—', color: '', lastUpdated: '' },
    { label: 'Crypto Volatility', score: 0, status: '—', color: '', lastUpdated: '' },
    { label: 'Health Alert Level', score: 0, status: '—', color: '', lastUpdated: '' },
  ]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const newSignals: Signal[] = [];
    const newErrors: Record<string, boolean> = {};
    const updatedMeters = [...meters];
    const ts = now();

    // GDELT
    try {
      const r = await fetch('https://api.gdeltproject.org/api/v2/summary/summary?d=web&t=summary&o=json');
      const d = await r.json();
      const tone = Math.abs(d?.summary?.tone_avg || -5);
      const geoScore = Math.min(100, Math.round(tone * 10));
      updatedMeters[0] = { label: 'Geopolitical Risk', score: geoScore, status: meterStatus(geoScore), color: meterColor(geoScore), lastUpdated: ts };
      if (d?.summary?.top_themes) {
        d.summary.top_themes.slice(0, 3).forEach((t: any) => {
          newSignals.push({ severity: geoScore > 66 ? 'CRITICAL' : geoScore > 33 ? 'ELEVATED' : 'WATCH', description: t.theme || 'Geopolitical event detected', source: 'GDELT', timestamp: ts });
        });
      }
    } catch { newErrors['GDELT'] = true; }

    // CoinGecko
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
      const d = await r.json();
      const btcChange = Math.abs(d?.bitcoin?.usd_24h_change || 0);
      const cryptoScore = btcChange < 3 ? Math.round(btcChange * 11) : btcChange < 7 ? Math.round(33 + (btcChange - 3) * 8.5) : Math.min(100, Math.round(67 + (btcChange - 7) * 3.3));
      updatedMeters[2] = { label: 'Crypto Volatility', score: cryptoScore, status: meterStatus(cryptoScore), color: meterColor(cryptoScore), lastUpdated: ts };
      newSignals.push({
        severity: cryptoScore > 66 ? 'CRITICAL' : cryptoScore > 33 ? 'ELEVATED' : 'NOMINAL',
        description: `BTC $${d.bitcoin?.usd?.toLocaleString()} (${d.bitcoin?.usd_24h_change?.toFixed(2)}%) · ETH $${d.ethereum?.usd?.toLocaleString()} (${d.ethereum?.usd_24h_change?.toFixed(2)}%)`,
        source: 'COINGECKO', timestamp: ts
      });
    } catch { newErrors['COINGECKO'] = true; }

    // WHO RSS
    try {
      const r = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/rss-feeds/news-english.xml&count=5');
      const d = await r.json();
      const urgentKeywords = ['outbreak', 'emergency', 'pandemic', 'epidemic', 'crisis', 'alert'];
      let urgentCount = 0;
      (d?.items || []).forEach((item: any) => {
        const title = (item.title || '').toLowerCase();
        const isUrgent = urgentKeywords.some(k => title.includes(k));
        if (isUrgent) urgentCount++;
        newSignals.push({
          severity: isUrgent ? 'ELEVATED' : 'NOMINAL',
          description: item.title || 'WHO Health Update',
          source: 'WHO', timestamp: item.pubDate?.split(' ')[0] || ts
        });
      });
      const healthScore = urgentCount === 0 ? 15 : urgentCount <= 2 ? 50 : 80;
      updatedMeters[3] = { label: 'Health Alert Level', score: healthScore, status: meterStatus(healthScore), color: meterColor(healthScore), lastUpdated: ts };
    } catch { newErrors['WHO'] = true; }

    // ReliefWeb
    try {
      const r = await fetch('https://api.reliefweb.int/v1/reports?appname=adamsstreett&limit=5&sort[]=date:desc&fields[]=title&fields[]=date&fields[]=status');
      const d = await r.json();
      (d?.data || []).forEach((item: any) => {
        newSignals.push({
          severity: 'WATCH',
          description: item.fields?.title || 'ReliefWeb Report',
          source: 'RELIEFWEB', timestamp: item.fields?.date?.created?.split('T')[0] || ts
        });
      });
    } catch { newErrors['RELIEFWEB'] = true; }

    // FRED VIX - try without API key first (public endpoint)
    try {
      const fredKey = (import.meta as any).env?.VITE_FRED_API_KEY;
      if (fredKey) {
        const r = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=VIXCLS&api_key=${fredKey}&file_type=json&limit=1&sort_order=desc`);
        const d = await r.json();
        const vix = parseFloat(d?.observations?.[0]?.value || '20');
        const econScore = vix < 15 ? Math.round(vix * 2.2) : vix < 25 ? Math.round(33 + (vix - 15) * 3.4) : Math.min(100, Math.round(67 + (vix - 25) * 1.65));
        updatedMeters[1] = { label: 'Economic Stress', score: econScore, status: meterStatus(econScore), color: meterColor(econScore), lastUpdated: ts };
        newSignals.push({
          severity: econScore > 66 ? 'CRITICAL' : econScore > 33 ? 'ELEVATED' : 'NOMINAL',
          description: `VIX Volatility Index: ${vix.toFixed(1)}`,
          source: 'FRED', timestamp: ts
        });
      } else {
        updatedMeters[1] = { label: 'Economic Stress', score: 45, status: 'ELEVATED', color: 'bg-[hsl(var(--amber))]', lastUpdated: ts };
        newSignals.push({ severity: 'WATCH', description: 'VIX data pending — API key required', source: 'FRED', timestamp: ts });
      }
    } catch { newErrors['FRED'] = true; }

    newSignals.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    setMeters(updatedMeters);
    setSignals(newSignals.slice(0, 20));
    setErrors(newErrors);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return (
    <div>
      <div className="mb-8">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Intelligence</div>
        <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">ASP News</h2>
        <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Live risk intelligence from global data sources.</p>
      </div>

      {/* RISK METERS */}
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-8">
        {meters.map((m, i) => (
          <div key={i} className="bg-s1 border border-b1 p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-label text-[0.65rem] text-t2 tracking-[0.18em] uppercase">{m.label}</span>
              {m.status !== '—' && (
                <span className={`font-label text-[0.5rem] tracking-[0.12em] uppercase py-0.5 px-2 ${
                  m.status === 'NOMINAL' ? 'text-[hsl(var(--green))] border border-[hsl(var(--green))]' :
                  m.status === 'ELEVATED' ? 'text-asp-amber border border-[hsl(var(--amber))]' :
                  'text-[hsl(var(--red))] border border-[hsl(var(--red))]'
                }`}>{m.status}</span>
              )}
            </div>
            <div className="w-full h-2.5 bg-s3 mb-2 overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${m.color || 'bg-s3'}`} style={{ width: loading ? '0%' : `${m.score}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[1.1rem] text-t1 tabular-nums">{loading ? '—' : m.score}</span>
              <span className="font-mono text-[0.55rem] text-t4">{m.lastUpdated || '—'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SIGNAL FEED */}
      <div className="bg-s1 border border-b1 mb-8">
        <div className="py-4 px-5 border-b border-b1 flex justify-between items-center">
          <span className="font-label text-[0.68rem] text-t2 tracking-[0.18em] uppercase">Signal Feed</span>
          <span className="font-mono text-[0.6rem] text-t3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[hsl(var(--green))] animate-pulse inline-block rounded-full" /> Live
          </span>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse flex gap-3 items-center py-3">
                  <div className="w-16 h-5 bg-s3 rounded" />
                  <div className="flex-1 h-4 bg-s3 rounded" />
                  <div className="w-20 h-4 bg-s3 rounded" />
                </div>
              ))}
            </div>
          ) : signals.length === 0 ? (
            <div className="text-center py-12 font-heading text-base italic text-t3">No signals available.</div>
          ) : (
            signals.map((s, i) => (
              <div key={i} className="flex items-start gap-3 py-3 px-5 border-b border-b1 last:border-b-0 hover:bg-s2 transition-colors">
                <span className={`font-label text-[0.48rem] tracking-[0.1em] uppercase py-0.5 px-2 flex-shrink-0 mt-0.5 ${severityColors[s.severity]}`}>{s.severity}</span>
                <span className="font-body text-[0.82rem] text-t2 leading-[1.6] flex-1 min-w-0">{s.description}</span>
                <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                  <span className="font-mono text-[0.55rem] text-t4">{s.source}</span>
                  <span className="font-mono text-[0.5rem] text-t4">{s.timestamp}</span>
                </div>
              </div>
            ))
          )}
          {Object.keys(errors).map(src => (
            <div key={src} className="flex items-center gap-3 py-3 px-5 border-b border-b1">
              <span className="font-label text-[0.48rem] tracking-[0.1em] uppercase py-0.5 px-2 bg-s3 text-t4">OFFLINE</span>
              <span className="font-body text-[0.82rem] text-t4">{src} — Source unavailable</span>
            </div>
          ))}
        </div>
      </div>

      {/* ASP RISK ENGINE */}
      <div className="bg-void border border-b1 p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          <span className="font-label text-[0.72rem] text-gold tracking-[0.22em] uppercase">ASP Risk Engine</span>
        </div>
        <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Risk analysis offline — API integration pending.</p>
        {/* ASP Risk Engine — Claude API Integration Point */}
        {/* async function runRiskAnalysis(signals) { */}
        {/*   const response = await fetch('/api/risk-analysis', { */}
        {/*     method: 'POST', */}
        {/*     body: JSON.stringify({ signals }) */}
        {/*   }); */}
        {/*   const data = await response.json(); */}
        {/*   document.getElementById('riskOutput').innerText = data.analysis; */}
        {/* } */}
      </div>
    </div>
  );
};

export default ASPNewsPage;
