import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FUNDS, WALLETS } from '@/data/funds';

type Page = 'overview' | 'portfolio' | 'invest' | 'staking' | 'returns' | 'referral' | 'withdraw' | 'profile' | 'leaderboard' | 'network' | 'concierge' | 'vault';

const PAGE_TITLES: Record<Page, string> = {
  overview: 'Overview', portfolio: 'Portfolio Analytics', invest: 'New Investment', staking: 'Staking Pools',
  returns: 'Returns Simulator', referral: 'Referral Program', withdraw: 'Withdrawal', profile: 'Partner Profile',
  leaderboard: 'Partner Leaderboard', network: 'Global Network', concierge: 'ASP Intelligence', vault: 'Document Vault',
};

const SIDEBAR_ITEMS: { group: string; items: { id: Page; label: string; icon: string }[] }[] = [
  { group: 'Overview', items: [
    { id: 'overview', label: 'Dashboard', icon: '◫' },
    { id: 'portfolio', label: 'Portfolio', icon: '⟋' },
  ]},
  { group: 'Capital', items: [
    { id: 'invest', label: 'Invest', icon: '+' },
    { id: 'staking', label: 'Staking', icon: '★' },
    { id: 'withdraw', label: 'Withdraw', icon: '⇄' },
  ]},
  { group: 'Intelligence', items: [
    { id: 'returns', label: 'Returns', icon: '▮' },
    { id: 'referral', label: 'Referral', icon: '⊕' },
  ]},
  { group: 'Community', items: [
    { id: 'leaderboard', label: 'Leaderboard', icon: '▯' },
    { id: 'network', label: 'Network', icon: '◉' },
    { id: 'concierge', label: 'ASP Intelligence', icon: '◬' },
  ]},
  { group: 'Account', items: [
    { id: 'vault', label: 'Vault', icon: '▣' },
    { id: 'profile', label: 'Profile', icon: '◎' },
  ]},
];

const SECTOR_CODES: Record<string, string> = {
  'Private Equity': 'PE', 'Venture': 'VC', 'Real Estate': 'RE', 'Forex': 'FO',
  'Commodity': 'CO', 'Income': 'IN', 'Growth': 'GR', 'Frontier': 'FR', 'Ethical': 'ET', 'General': 'GE',
};

const CHAT_SUGGESTIONS = [
  'Which fund is best for me?',
  'How do staking pools work?',
  'Calculate my returns on $500',
  'How do I make a payment?',
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [time, setTime] = useState('');
  const [btcPrice, setBtcPrice] = useState('BTC $—');
  const [ethPrice, setEthPrice] = useState('ETH $—');
  const [selectedPayment, setSelectedPayment] = useState('btc');
  const [fundSelect, setFundSelect] = useState('');
  const [amount, setAmount] = useState('');
  const [presetAmount, setPresetAmount] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [horizon, setHorizon] = useState('12');
  const [investMsg, setInvestMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [investLoading, setInvestLoading] = useState(false);
  const [refId, setRefId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawWallet, setWithdrawWallet] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('btc');
  const [withdrawMsg, setWithdrawMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ text: string; from: 'user' | 'asp' }[]>([
    { text: 'Welcome to your private investment concierge. I can help you understand our 21 funds, optimize your portfolio allocation, explain staking strategies, calculate returns, and answer any questions about the platform. How can I assist you today?', from: 'asp' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [simAmount, setSimAmount] = useState('500');
  const [simFund, setSimFund] = useState('12|28');
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultFilter, setVaultFilter] = useState('all');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [investFilter, setInvestFilter] = useState('all');

  // Referral code generation — start with one auto-generated code, zero uses
  const [referralCodes, setReferralCodes] = useState([
    { code: 'ASP-26-GE-' + Math.random().toString(36).substr(2, 6) + '-4K', sector: 'General', uses: 0, maxUses: 10, expires: 'Dec 31, 2026' },
  ]);
  const [referralInput, setReferralInput] = useState('');
  const [referralValidation, setReferralValidation] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' GMT');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const d = await r.json();
        if (d.bitcoin) setBtcPrice(`BTC $${d.bitcoin.usd.toLocaleString()}`);
        if (d.ethereum) setEthPrice(`ETH $${d.ethereum.usd.toLocaleString()}`);
      } catch {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const calcProjections = useCallback(() => {
    if (!fundSelect || !amount || parseFloat(amount) < 500) return { cons: '—', agg: '—' };
    const parts = fundSelect.split('|');
    const rates = parts[1].split('-');
    const consRate = parseFloat(rates[0]) / 100;
    const aggRate = parseFloat(rates[1]) / 100;
    const years = parseInt(horizon) / 12;
    return {
      cons: '$' + Math.round(parseFloat(amount) * Math.pow(1 + consRate, years)).toLocaleString(),
      agg: '$' + Math.round(parseFloat(amount) * Math.pow(1 + aggRate, years)).toLocaleString(),
    };
  }, [fundSelect, amount, horizon]);

  const simCalc = useCallback(() => {
    const a = parseFloat(simAmount) || 100000;
    const rates = simFund.split('|');
    const cons = parseFloat(rates[0]) / 100;
    const agg = parseFloat(rates[1]) / 100;
    const fmt = (v: number) => '$' + Math.round(v).toLocaleString();
    return {
      y1c: fmt(a * Math.pow(1 + cons, 1)),
      y3c: fmt(a * Math.pow(1 + cons, 3)),
      y1a: fmt(a * Math.pow(1 + agg, 1)),
      y5a: fmt(a * Math.pow(1 + agg, 5)),
    };
  }, [simAmount, simFund]);

  const submitInvestment = () => {
    if (!fundSelect) { setInvestMsg({ text: 'Please select a fund.', type: 'error' }); return; }
    if (!amount || parseFloat(amount) < 500) { setInvestMsg({ text: 'Minimum commitment is $500.', type: 'error' }); return; }
    setInvestLoading(true);
    const ref = 'ASP-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    setRefId(ref);
    setInvestMsg({ text: `Commitment recorded. Reference: ${ref}. Send your exact payment to the wallet address above. Your portfolio activates automatically once payment is detected on-chain.`, type: 'success' });
    setInvestLoading(false);
  };

  const submitWithdrawal = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 10000) { setWithdrawMsg({ text: 'Minimum withdrawal is $10,000.', type: 'error' }); return; }
    if (!withdrawWallet) { setWithdrawMsg({ text: 'Please enter your wallet address.', type: 'error' }); return; }
    const ref = 'WD-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    setWithdrawMsg({ text: `✓ Withdrawal request submitted. Reference: ${ref}. Processing within 3–5 business days.`, type: 'success' });
  };

  const sendMessage = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    const userMsg = { text: msg, from: 'user' as const };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    // Smart contextual responses
    setTimeout(() => {
      let response = '';
      const lower = msg.toLowerCase();

      if (lower.includes('best') && lower.includes('fund') || lower.includes('which fund') || lower.includes('recommend')) {
        response = 'Based on a balanced risk approach, I\'d recommend starting with the **Adams Streett General Fund** at **12–28% APY** — it\'s our flagship diversified strategy with a 6-month horizon. For higher conviction, the **Private Equity Pool** offers **18–40% APY** over 12+ months. What\'s your risk tolerance and investment horizon? *Projections are illustrative.*';
      } else if (lower.includes('staking') || lower.includes('pool') || lower.includes('lock')) {
        response = 'We offer three staking pools:\n\n— **Flex Pool**: 14% APY, 90-day lock, min $500\n— **Growth Pool**: 22% APY, 180-day lock, min $3,000\n— **Apex Pool**: 35% APY, 365-day lock, min $5,000 (Premium+ only)\n\nAll pools compound daily. Navigate to the Staking page to commit. *Rates are target yields, not guaranteed.*';
      } else if (lower.includes('payment') || lower.includes('pay') || lower.includes('wallet') || lower.includes('btc') || lower.includes('eth') || lower.includes('usdc')) {
        response = 'We accept **BTC**, **ETH**, and **USDC** (ERC-20). After submitting a commitment on the Invest page, send your exact amount to the displayed wallet address. Our system detects on-chain payments automatically. Portfolio activates upon confirmation — typically within minutes for ETH/USDC and ~30 minutes for BTC.';
      } else if (lower.includes('return') || lower.includes('calculate') || lower.includes('$500') || lower.includes('500')) {
        response = 'On **$500** in the General Fund:\n\n— **Year 1**: $560–$640\n— **Year 3**: $740–$985\n\nFor higher returns, the African Unicorn Fund projects **$610–$900** in Year 1. Use the Returns Simulator for custom projections. *All projections are illustrative.*';
      } else if (lower.includes('tier') || lower.includes('bronze') || lower.includes('silver') || lower.includes('gold')) {
        response = 'Investment tiers unlock exclusive benefits:\n\n— **Starter**: $500+ — General Fund, DeFi Yield, Fixed Income\n— **Growth**: $3,000+ — All funds except Frontier & Longevity, 5% referral\n— **Premium**: $5,000+ — ALL 21 funds, Apex Pool, priority processing\n— **Elite**: $10,000+ — Platinum status, ASP Black Card, dedicated concierge\n\nYour tier is based on total committed capital across all funds.';
      } else if (lower.includes('referral') || lower.includes('refer') || lower.includes('commission')) {
        response = 'You earn **5% commission** on every commitment made by a partner you refer. Your referral code is on the Referral page — share it via the unique link. Referred partners also receive Silver tier benefits for their first 90 days. Minimum payout is $1,000, processed monthly.';
      } else if (lower.includes('halal') || lower.includes('sharia') || lower.includes('islamic')) {
        response = 'The **Halal Investment Fund** offers **12–30% APY** with full Sharia compliance — no riba, no prohibited sectors, ethical screening by our advisory board. It\'s our most popular fund among GCC and MENA partners. 12+ month horizon, moderate risk. *Projections are illustrative.*';
      } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge')) {
        response = 'Our fee structure:\n\n— **2% annual management fee** (charged monthly)\n— **20% performance carry** above the hurdle rate\n— No entry or exit fees\n— No hidden charges\n\nGold tier partners receive zero fees on the first $50K committed.';
      } else {
        response = 'I can help you with fund selection, portfolio optimization, staking strategies, payment instructions, tier benefits, and return projections. Could you be more specific about what you\'d like to know? You can also try the Returns Simulator for custom calculations.';
      }

      setChatMessages(prev => [...prev, { text: response, from: 'asp' }]);
      setChatLoading(false);
    }, 1200);
  };

  const clearChat = () => {
    setChatMessages([{ text: 'Welcome to your private investment concierge. I can help you understand our 21 funds, optimize your portfolio allocation, explain staking strategies, calculate returns, and answer any questions about the platform. How can I assist you today?', from: 'asp' }]);
  };

  const generateReferralCode = () => {
    const sectorKeys = Object.values(SECTOR_CODES);
    const sector = sectorKeys[Math.floor(Math.random() * sectorKeys.length)];
    const hash = Math.random().toString(36).substr(2, 6);
    const amt = ['4K', '10K', '25K', '50K'][Math.floor(Math.random() * 4)];
    const code = `ASP-26-${sector}-${hash}-${amt}`;
    setReferralCodes(prev => [...prev, { code, sector: Object.keys(SECTOR_CODES).find(k => SECTOR_CODES[k] === sector) || 'General', uses: 0, maxUses: 10, expires: 'Dec 31, 2026' }]);
  };

  const validateReferralInput = (value: string) => {
    setReferralInput(value);
    if (!value) { setReferralValidation(null); return; }
    const pattern = /^ASP-\d{2}-[A-Z]{2}-[a-z0-9]{6}-\d+K$/;
    if (pattern.test(value)) {
      setReferralValidation('✓ Valid code — Referred by: Partner ••7291');
    } else if (value.length > 4 && !value.startsWith('ASP-')) {
      setReferralValidation('✗ Invalid format');
    } else {
      setReferralValidation(null);
    }
  };

  const leaderboardData = [
    { name: 'Partner ••7291', region: 'Dubai, UAE', committed: 1850000, tier: 'Gold' },
    { name: 'Partner ••4438', region: 'Lagos, NG', committed: 1200000, tier: 'Gold' },
    { name: 'Partner ••9912', region: 'Riyadh, SA', committed: 980000, tier: 'Silver' },
    { name: 'Partner ••3341', region: 'London, UK', committed: 850000, tier: 'Silver' },
    { name: 'Partner ••6672', region: 'Singapore', committed: 720000, tier: 'Silver' },
    { name: 'Partner ••8821', region: 'Nairobi, KE', committed: 650000, tier: 'Silver' },
    { name: 'Partner ••2290', region: 'Zurich, CH', committed: 550000, tier: 'Silver' },
    { name: 'Partner ••5519', region: 'Frankfurt, DE', committed: 480000, tier: 'Bronze' },
    { name: 'Partner ••7743', region: 'Abu Dhabi, UAE', committed: 350000, tier: 'Bronze' },
    { name: 'Partner ••1167', region: 'Accra, GH', committed: 280000, tier: 'Bronze' },
  ];

  const vaultDocs = [
    { name: 'Adams Streett General Fund — Prospectus', type: 'Fund Documents', size: '2.4 MB', updated: 'Mar 1, 2026', isNew: true, tier: 'bronze' },
    { name: 'African Unicorn Fund — Prospectus', type: 'Fund Documents', size: '3.1 MB', updated: 'Feb 15, 2026', isNew: false, tier: 'bronze' },
    { name: 'Private Equity Pool — Prospectus', type: 'Fund Documents', size: '2.8 MB', updated: 'Feb 1, 2026', isNew: false, tier: 'bronze' },
    { name: 'Frontier Fund — Prospectus', type: 'Fund Documents', size: '3.4 MB', updated: 'Jan 20, 2026', isNew: false, tier: 'bronze' },
    { name: 'DeFi Yield Strategy — Prospectus', type: 'Fund Documents', size: '1.9 MB', updated: 'Jan 15, 2026', isNew: false, tier: 'bronze' },
    { name: 'Halal Investment Fund — Prospectus', type: 'Fund Documents', size: '2.2 MB', updated: 'Jan 10, 2026', isNew: false, tier: 'bronze' },
    { name: 'Q1 2026 — Subscription Agreement', type: 'Subscription Agreements', size: '1.2 MB', updated: 'Mar 5, 2026', isNew: true, tier: 'bronze' },
    { name: 'Q4 2025 — Subscription Agreement', type: 'Subscription Agreements', size: '1.1 MB', updated: 'Dec 28, 2025', isNew: false, tier: 'bronze' },
    { name: 'March 2026 — NAV Report', type: 'NAV Reports', size: '0.8 MB', updated: 'Mar 8, 2026', isNew: true, tier: 'bronze' },
    { name: 'February 2026 — NAV Report', type: 'NAV Reports', size: '0.7 MB', updated: 'Feb 28, 2026', isNew: false, tier: 'bronze' },
    { name: '2025 K-1 Tax Document', type: 'Tax Documents', size: '1.5 MB', updated: 'Mar 1, 2026', isNew: true, tier: 'silver' },
    { name: '2024 K-1 Tax Document', type: 'Tax Documents', size: '1.3 MB', updated: 'Mar 15, 2025', isNew: false, tier: 'silver' },
    { name: 'Capital Call Notice — Q2 2026', type: 'Capital Call Notices', size: '0.5 MB', updated: 'Mar 10, 2026', isNew: true, tier: 'bronze' },
    { name: 'Raw Performance Data — All Funds', type: 'Raw Data', size: '12.4 MB', updated: 'Mar 1, 2026', isNew: false, tier: 'gold' },
  ];

  const vaultDocTypes = ['all', ...new Set(vaultDocs.map(d => d.type))];
  const filteredDocs = vaultDocs
    .filter(d => vaultFilter === 'all' || d.type === vaultFilter)
    .filter(d => !vaultSearch || d.name.toLowerCase().includes(vaultSearch.toLowerCase()));

  const projections = calcProjections();
  const sim = simCalc();

  const investFilteredFunds = investFilter === 'all' ? FUNDS : FUNDS.filter(f => f.cat === investFilter);

  const KPI = ({ label, value, change, cls = '' }: { label: string; value: string; change?: string; cls?: string }) => (
    <div className="bg-s1 p-5">
      <div className="font-label text-[0.58rem] text-t3 tracking-[0.15em] uppercase">{label}</div>
      <div className="h-px bg-[hsl(var(--b1))] my-2" />
      <div className={`font-mono text-[1.5rem] tabular-nums text-t1 ${cls}`}>{value}</div>
      {change && <div className="font-mono text-[0.68rem] mt-1 text-asp-green">{change}</div>}
    </div>
  );

  const Card = ({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-s1 border border-b1 mb-5">
      <div className="py-4 px-5 border-b border-b1 flex justify-between items-center flex-wrap gap-2">
        <span className="font-label text-[0.68rem] text-t2 tracking-[0.18em] uppercase">{title}</span>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const tierOrder = { bronze: 0, silver: 1, gold: 2 };
  const currentTier = 'bronze';

  // Format chat messages with bold for numbers/percentages
  const formatChatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
    return parts.map((part, i) => {
      if (part === '\n') return <br key={i} />;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="grid grid-cols-[220px_1fr] max-md:grid-cols-1 h-screen bg-void overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="hidden max-md:flex fixed top-0 left-0 right-0 h-14 bg-void border-b border-b1 items-center px-5 gap-3 z-[90]">
        <div className="flex flex-col gap-[4px]">
          <span className="block w-4 h-[1.5px] bg-[hsl(var(--text))]" />
          <span className="block w-4 h-[1.5px] bg-[hsl(var(--text))]" />
          <span className="block w-4 h-[1.5px] bg-[hsl(var(--text))]" />
        </div>
        <span className="font-heading text-[1rem] text-gold">{PAGE_TITLES[page]}</span>
      </button>

      {/* Sidebar */}
      <div className={`${mobileSidebarOpen ? 'fixed inset-0 z-[95] flex' : 'hidden'} md:flex md:relative flex-col bg-void border-r border-b1 overflow-y-auto overflow-x-hidden`}>
        {mobileSidebarOpen && <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] md:hidden" onClick={() => setMobileSidebarOpen(false)} />}
        <div className="relative z-10 w-[220px] bg-void h-full flex flex-col">
          <div className="h-14 border-b border-b1 flex items-center px-5 gap-2.5 flex-shrink-0">
            <span className="font-heading text-[1.1rem] text-gold font-normal">ASP</span>
            <div className="flex flex-col">
              <span className="font-label text-[0.6rem] text-t2 tracking-[0.15em] uppercase">Adams Streett</span>
              <span className="font-label text-[0.5rem] text-t4 tracking-[0.12em] uppercase">Partners</span>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="px-5 py-4 border-b border-b1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-label text-[0.52rem] text-t3 tracking-[0.15em] uppercase">Your Tier: Starter</span>
              <span className="font-label text-[0.48rem] text-t4 tracking-[0.1em] uppercase">Next: Growth</span>
            </div>
            <div className="w-full h-1.5 bg-s3">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: '0%' }} />
            </div>
            <div className="font-mono text-[0.55rem] text-t4 mt-1">$0 committed · Need $3K for Growth tier</div>
          </div>

          {SIDEBAR_ITEMS.map((g, gi) => (
            <div key={gi}>
              <div className="font-label text-[0.52rem] text-t4 tracking-[0.22em] uppercase py-5 px-5 pb-1.5">{g.group}</div>
              {g.items.map(item => (
                <div key={item.id} onClick={() => { setPage(item.id); setMobileSidebarOpen(false); }}
                  className={`font-body text-[0.78rem] py-[9px] px-5 flex items-center gap-2.5 cursor-pointer transition-all border-l-2 select-none min-h-[44px] ${page === item.id ? 'bg-s2 text-gold border-l-[hsl(var(--gold))]' : 'text-t3 border-l-transparent hover:bg-s1 hover:text-t1'}`}>
                  <span className="text-[0.7rem] w-3.5 text-center flex-shrink-0">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          ))}
          <div className="mt-auto border-t border-b1 py-4 px-5">
            <div className="font-label text-[0.55rem] tracking-[0.15em] uppercase py-0.5 px-2 border border-gold text-gold inline-block mb-2">Starter</div>
            <div className="font-mono text-[0.65rem] text-t3 mb-3 truncate">New Partner</div>
            <button onClick={() => navigate('/auth')} className="font-label text-[0.62rem] text-t4 tracking-[0.12em] uppercase cursor-pointer hover:text-asp-red transition-colors bg-transparent border-none p-0">Sign Out</button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col overflow-hidden max-md:mt-14">
        <div className="h-14 border-b border-b1 flex items-center justify-between px-8 max-md:px-4 flex-shrink-0 bg-void">
          <div className="font-heading text-[1.1rem] font-normal text-t1 max-md:hidden">{PAGE_TITLES[page]}</div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-[0.7rem] text-t3"><span className="text-gold">{btcPrice}</span> &nbsp; <span className="text-gold">{ethPrice}</span></div>
            <div className="font-mono text-[0.7rem] text-t4 max-sm:hidden">{time}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-7 px-8 max-md:px-4">
          {/* OVERVIEW */}
          {page === 'overview' && (
            <>
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))] mb-6">
                <KPI label="Portfolio Value" value="$0.00" />
                <KPI label="Yield Earned" value="$0.00" />
                <KPI label="Active Positions" value="0" cls="text-gold" />
                <KPI label="Referral Earnings" value="$0.00" />
              </div>
              <Card title="Portfolio Intelligence Alerts" extra={<span className="font-mono text-[0.65rem] text-t3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[hsl(var(--green))] animate-pulse-dot inline-block" /> Live</span>}>
                <div className="border-l-2 border-l-[hsl(var(--gold))] py-3.5 px-5 border-b border-b1 flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
                  <span className="font-body text-[0.8rem] text-t2 leading-[1.6]">Welcome to Adams Streett Partners. Complete your first commitment to activate your portfolio.</span>
                  <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.1em] uppercase cursor-pointer whitespace-nowrap ml-4 max-md:ml-0 bg-transparent border-none p-0">Invest Now →</button>
                </div>
              </Card>
              <Card title="Active Commitments" extra={<button onClick={() => setPage('invest')} className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[36px]">+ New Position</button>}>
                <div className="text-center py-12">
                  <div className="font-heading text-base italic text-t3 mb-4">No active commitments.<br />Make your first investment to get started.</div>
                  <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.12em] uppercase bg-transparent border border-gold py-2.5 px-6 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[44px]">Make Your First Investment →</button>
                </div>
              </Card>
            </>
          )}

          {/* PORTFOLIO */}
          {page === 'portfolio' && (
            <>
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))] mb-6">
                <KPI label="Total Value" value="$0.00" />
                <KPI label="Total Committed" value="$0.00" />
                <KPI label="Total Growth" value="$0.00" />
                <KPI label="Blended APY" value="—" cls="text-gold" />
              </div>
              <Card title="Portfolio Breakdown">
                <div className="text-center py-12">
                  <div className="font-heading text-base italic text-t3 mb-4">Your portfolio is empty. Commit capital to your first fund to begin building wealth.</div>
                  <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.12em] uppercase bg-transparent border border-gold py-2.5 px-6 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[44px]">Start Investing →</button>
                </div>
              </Card>
            </>
          )}

          {/* INVEST */}
          {page === 'invest' && (
            <>
              {/* Fund filter tabs */}
              <div className="mb-3">
                <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-3">Select Fund</div>
                <div className="flex gap-px bg-[hsl(var(--b1))] mb-4 flex-wrap">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'income', label: 'Income' },
                    { key: 'growth', label: 'Growth' },
                    { key: 'frontier', label: 'Frontier' },
                    { key: 'ethical', label: 'Ethical' },
                  ].map(c => (
                    <button key={c.key} onClick={() => setInvestFilter(c.key)}
                      className={`font-label text-[0.6rem] tracking-[0.12em] uppercase py-2.5 px-5 cursor-pointer transition-all min-h-[40px] ${investFilter === c.key ? 'bg-gold text-void' : 'bg-s1 text-t3 hover:bg-s2'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Fund picker grid */}
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2">
                  {investFilteredFunds.map((f, i) => {
                    const isSelected = fundSelect === f.selectValue;
                    const riskColors: Record<string, string> = {
                      low: 'text-[#86efac] border-[#86efac]/30',
                      mod: 'text-asp-amber border-[hsl(var(--amber))]/30',
                      high: 'text-[#fca5a5] border-[hsl(var(--red))]/30',
                      top: 'text-[#f87171] border-[#f87171]/30',
                    };
                    const catLabels: Record<string, string> = { income: 'Income', growth: 'Growth', frontier: 'Frontier', ethical: 'Ethical' };
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setFundSelect(f.selectValue);
                          setTimeout(() => document.getElementById('invest-amount-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                        }}
                        className={`bg-s1 border p-4 cursor-pointer transition-all ${isSelected ? 'border-gold bg-gold-glow shadow-[0_0_20px_rgba(201,168,76,0.1)]' : 'border-b1 hover:border-b2 opacity-80 hover:opacity-100'}`}
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <span className="font-heading text-[0.88rem] text-t1 leading-tight">{f.name}</span>
                          <span className={`font-label text-[0.5rem] tracking-[0.1em] uppercase border py-0.5 px-1.5 whitespace-nowrap ${riskColors[f.risk] || 'text-t3 border-b1'}`}>{f.riskLabel}</span>
                        </div>
                        <div className="font-mono text-[1.1rem] text-gold mb-2">{f.apy} <span className="text-[0.6rem] text-t3">APY</span></div>
                        <span className="font-label text-[0.5rem] tracking-[0.1em] uppercase text-t4 border border-b1 py-0.5 px-1.5">{catLabels[f.cat] || f.cat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Card title="New Investment Commitment">
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
                  <div>
                    {fundSelect && (
                      <div className="bg-s2 border border-b1 p-3 mb-5">
                        <div className="font-label text-[0.55rem] text-t3 tracking-[0.12em] uppercase mb-1">Selected Fund</div>
                        <div className="font-heading text-[0.95rem] text-gold">{FUNDS.find(f => f.selectValue === fundSelect)?.name || '—'}</div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 mb-5">
                      <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Commitment Amount (USD)</label>
                      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-2 mt-1">
                        {[500, 1000, 3000, 5000, 10000, 25000, 50000].map(v => (
                          <button key={v} onClick={() => { setPresetAmount(v); setAmount(String(v)); setShowCustomInput(false); }}
                            className={`font-mono text-[0.82rem] py-3 px-2 border transition-all min-h-[48px] cursor-pointer ${presetAmount === v ? 'border-gold bg-gold-glow text-gold shadow-[0_0_16px_hsl(var(--gold)/0.15)]' : 'border-b1 bg-s2 text-t2 hover:border-b2 hover:bg-s3'}`}>
                            ${v.toLocaleString()}
                          </button>
                        ))}
                        <button onClick={() => { setPresetAmount(null); setShowCustomInput(true); setTimeout(() => customInputRef.current?.focus(), 50); }}
                          className={`font-mono text-[0.82rem] py-3 px-2 border transition-all min-h-[48px] cursor-pointer ${showCustomInput ? 'border-gold bg-gold-glow text-gold shadow-[0_0_16px_hsl(var(--gold)/0.15)]' : 'border-b1 bg-s2 text-t2 hover:border-b2 hover:bg-s3'}`}>
                          Custom
                        </button>
                      </div>
                      {showCustomInput && (
                        <div className="mt-3">
                          <label className="font-label text-[0.55rem] text-t3 tracking-[0.1em] uppercase mb-1 block">Enter Amount (USD)</label>
                          <input ref={customInputRef} id="invest-amount-input" type="number" inputMode="decimal" value={amount} onChange={e => { setAmount(e.target.value); setPresetAmount(null); }} placeholder="500" min={500} className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-mono text-[1.4rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[48px]" />
                        </div>
                      )}
                      {amount && parseFloat(amount) > 0 && (
                        <div className="mt-3 py-3 px-4 bg-s2 border border-b1">
                          <div className="font-label text-[0.5rem] text-t3 tracking-[0.12em] uppercase mb-1">Committing</div>
                          <div className="font-mono text-[1.6rem] text-gold tabular-nums">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="font-label text-[0.5rem] text-t4 tracking-[0.1em] uppercase mt-1">{horizon} Month Horizon</div>
                        </div>
                      )}
                      {!showCustomInput && <span className="font-label text-[0.6rem] text-t3 tracking-[0.1em]">MINIMUM $500</span>}
                      {showCustomInput && parseFloat(amount) > 0 && parseFloat(amount) < 500 && <span className="font-label text-[0.6rem] text-asp-red tracking-[0.1em]">MINIMUM $500</span>}
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                      <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Investment Horizon</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: '3', label: '3 Months' },
                          { value: '6', label: '6 Months' },
                          { value: '12', label: '12 Months' },
                          { value: '24', label: '24 Months' },
                          { value: '36', label: '36 Months' },
                          { value: '60', label: '60 Months' },
                        ].map(h => (
                          <button
                            key={h.value}
                            type="button"
                            onClick={() => setHorizon(h.value)}
                            className={`px-4 py-2.5 min-h-[44px] font-label text-[0.7rem] tracking-[0.08em] uppercase border transition-all duration-200 ${
                              horizon === h.value
                                ? 'border-gold bg-gold/10 text-gold shadow-[0_0_12px_hsl(var(--gold)/0.2)]'
                                : 'border-b1 bg-s2 text-t3 hover:border-gold/40 hover:text-t2'
                            }`}
                          >
                            {h.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-2 block">Projected Returns</label>
                    <div className="bg-s2 p-5 border border-b1">
                      <div className="mb-4">
                        <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">Conservative Projection</div>
                        <div className="font-mono text-[1.2rem] text-t1">{projections.cons}</div>
                      </div>
                      <div>
                        <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">Aggressive Projection</div>
                        <div className="font-mono text-[1.2rem] text-gold">{projections.agg}</div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-b1 font-body text-[0.7rem] text-t4 leading-[1.6]">Projections are illustrative targets. All investments involve risk.</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 mt-6">
                  <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-3">Payment Method</div>
                  <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))]">
                    {[
                      { key: 'btc', icon: '₿', name: 'Bitcoin', desc: 'BTC · Auto-detected' },
                      { key: 'eth', icon: 'Ξ', name: 'Ethereum', desc: 'ETH · Auto-detected' },
                      { key: 'usdc', icon: '◎', name: 'USDC', desc: 'Stablecoin · ERC-20' },
                      { key: 'wire', icon: '⇄', name: 'Wire Transfer', desc: 'Coming Soon', disabled: true },
                    ].map(p => (
                      <div key={p.key} onClick={() => !('disabled' in p && p.disabled) && setSelectedPayment(p.key)}
                        className={`bg-s1 p-5 cursor-pointer transition-all ${'disabled' in p && p.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-s2'} ${selectedPayment === p.key ? 'border border-gold bg-gold-glow' : ''}`}>
                        <div className={`font-mono text-[1.4rem] mb-3 ${'disabled' in p && p.disabled ? 'text-t3' : 'text-gold'}`}>{p.icon}</div>
                        <div className={`font-heading text-[0.95rem] mb-1.5 ${'disabled' in p && p.disabled ? 'text-t3' : 'text-t1'}`}>{p.name}</div>
                        <p className="font-body text-[0.72rem] text-t3 leading-[1.6]">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-s2 border border-b2 p-5 mt-5">
                  <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-2">Send Payment To</div>
                  <div className="font-mono text-[0.75rem] text-t2 break-all leading-[1.6] mb-1">{WALLETS[selectedPayment as keyof typeof WALLETS] || WALLETS.btc}</div>
                  <div className="font-mono text-[0.6rem] text-t4 mb-3">
                    {selectedPayment === 'btc' ? 'Bitcoin Network' : selectedPayment === 'eth' ? 'Ethereum Network' : selectedPayment === 'usdc' ? 'USDC · ERC-20 on Ethereum' : ''}
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(WALLETS[selectedPayment as keyof typeof WALLETS] || WALLETS.btc)} className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[36px]">Copy Address</button>
                </div>

                {refId && (
                  <div className="mt-4">
                    <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-2">Your Reference ID</div>
                    <div className="bg-s2 border border-b1 py-3 px-4 font-mono text-[0.82rem] text-t2">{refId}</div>
                    <p className="font-body text-[0.78rem] text-t3 leading-[1.7] mt-2">Include this reference ID in your transaction memo. Our system will automatically match your payment.</p>
                  </div>
                )}

                {investMsg && (
                  <div className={`py-3 px-4 border-l-2 font-body text-[0.82rem] leading-[1.6] my-4 ${investMsg.type === 'error' ? 'border-l-[hsl(var(--red))] text-[#fca5a5] bg-[rgba(239,68,68,0.05)]' : 'border-l-[hsl(var(--green))] text-[#86efac] bg-[rgba(34,197,94,0.05)]'}`}>
                    {investMsg.text}
                  </div>
                )}

                <div className="flex gap-3 mt-6 flex-wrap">
                  <button onClick={submitInvestment} disabled={investLoading}
                    className={`font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px] ${investLoading ? 'opacity-60 cursor-wait' : ''}`}>
                    {investLoading ? '⟳ Processing...' : 'Submit Commitment'}
                  </button>
                  <button onClick={() => { setFundSelect(''); setAmount(''); setPresetAmount(null); setShowCustomInput(false); setInvestMsg(null); setRefId(''); }} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-gold bg-transparent border border-gold py-3.5 px-8 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[48px]">Reset</button>
                </div>
              </Card>
            </>
          )}

          {/* STAKING */}
          {page === 'staking' && (
            <>
              <Card title="Staking Pools">
                <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px bg-[hsl(var(--b1))] -m-5">
                  {[
                    { apy: '14%', name: 'Flex Pool', desc: '90 day lock period. Minimum $500.', tier: null },
                    { apy: '22%', name: 'Growth Pool', desc: '180 day lock period. Minimum $3,000.', tier: 'Growth+ Only' },
                    { apy: '35%', name: 'Apex Pool', desc: '365 day lock period. Minimum $5,000.', tier: 'Premium+ Only', badge: '⏳ Waitlist Open' },
                  ].map((p, i) => (
                    <div key={i} className="bg-s1 py-7 px-6 cursor-pointer hover:bg-s2 transition-colors">
                      <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-1">Annual Yield</div>
                      <div className="font-mono text-[2rem] text-gold mb-3">{p.apy}</div>
                      <div className="font-heading text-base text-t1 mb-1.5">{p.name}</div>
                      <p className="font-body text-[0.78rem] text-t3 leading-[1.7]">{p.desc}</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {p.tier && <span className="font-label text-[0.55rem] text-asp-amber border border-[hsl(var(--amber))] py-0.5 px-2 inline-block">{p.tier}</span>}
                        {p.badge && <span className="font-label text-[0.55rem] text-asp-red border border-[hsl(var(--red))] py-0.5 px-2 inline-block">{p.badge}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Active Staking Positions">
                <div className="text-center py-12 font-heading text-base italic text-t3">No active staking positions.</div>
              </Card>
            </>
          )}

          {/* RETURNS */}
          {page === 'returns' && (
            <Card title="Growth Simulator">
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Initial Amount (USD)</label>
                  <input type="number" value={simAmount} onChange={e => setSimAmount(e.target.value)} className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-mono text-[1.4rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Select Fund</label>
                  <select value={simFund} onChange={e => setSimFund(e.target.value)} className="bg-s2 border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full cursor-pointer min-h-[44px]">
                    {FUNDS.map((f, i) => <option key={i} value={`${f.apy.replace(/[^0-9–-]/g, '').split('–').join('|')}`}>{f.name} — {f.apy}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))]">
                <KPI label="Year 1 (Conservative)" value={sim.y1c} cls="text-asp-green" />
                <KPI label="Year 3 (Conservative)" value={sim.y3c} cls="text-asp-green" />
                <KPI label="Year 1 (Aggressive)" value={sim.y1a} cls="text-gold" />
                <KPI label="Year 5 (Aggressive)" value={sim.y5a} cls="text-gold" />
              </div>
            </Card>
          )}

          {/* REFERRAL */}
          {page === 'referral' && (
            <>
              <Card title="Your Referral Codes">
                <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))] mb-6 -mx-5 -mt-5">
                  <KPI label="Total Referrals" value="0" />
                  <KPI label="Earnings" value="$0.00" />
                  <KPI label="Commission Rate" value="5%" change="Per referral commitment" cls="text-gold" />
                  <KPI label="Active Codes" value={String(referralCodes.length)} cls="text-t1" />
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {referralCodes.map((rc, i) => (
                    <div key={i} className="bg-s2 border border-b1 p-4">
                      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                        <span className="font-mono text-[0.82rem] text-t1">{rc.code}</span>
                        <div className="flex gap-2">
                          <button onClick={() => navigator.clipboard.writeText(rc.code)} className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-gold bg-transparent border border-gold py-1 px-3 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[32px]">Copy</button>
                          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${rc.code}`)} className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-t3 bg-transparent border border-b2 py-1 px-3 cursor-pointer hover:border-b3 transition-all min-h-[32px]">Share</button>
                        </div>
                      </div>
                      <div className="font-body text-[0.72rem] text-t3 mb-2">{rc.sector} · {rc.uses} of {rc.maxUses} uses remaining</div>
                      <div className="w-full h-1 bg-s3 mb-1">
                        <div className="h-full bg-gold transition-all" style={{ width: `${(rc.uses / rc.maxUses) * 100}%` }} />
                      </div>
                      <div className="font-mono text-[0.58rem] text-t4">Expires: {rc.expires}</div>
                    </div>
                  ))}
                </div>

                <button onClick={generateReferralCode} className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-2.5 px-6 cursor-pointer hover:bg-gold hover:text-void transition-all mb-6 min-h-[44px]">Generate New Code ▼</button>

                <div className="bg-s2 p-5 border border-b1">
                  <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-2">Validate a Referral Code</div>
                  <input type="text" value={referralInput} onChange={e => validateReferralInput(e.target.value)}
                    placeholder="ASP-26-PE-XXXXXX-XK" className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-mono text-[0.9rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] mb-2 min-h-[44px]" />
                  {referralValidation && (
                    <div className={`font-mono text-[0.72rem] ${referralValidation.startsWith('✓') ? 'text-asp-green' : 'text-asp-red'}`}>{referralValidation}</div>
                  )}
                </div>
              </Card>

              <Card title="How It Works">
                <div className="flex flex-col gap-3 font-body text-[0.82rem] text-t3 leading-[1.8]">
                  <p>When someone uses your code:</p>
                  <div className="flex items-start gap-2"><span className="text-gold">—</span> You get 5% commission on their commitment</div>
                  <div className="flex items-start gap-2"><span className="text-gold">—</span> They get Silver tier benefits for first 90 days</div>
                  <div className="flex items-start gap-2"><span className="text-gold">—</span> Minimum payout $1,000. Earnings processed monthly.</div>
                </div>
              </Card>
            </>
          )}

          {/* WITHDRAW */}
          {page === 'withdraw' && (
            <>
              <Card title="Withdrawal Request">
                <div className="bg-s2 py-4 px-4 border-l-2 border-l-[hsl(var(--amber))] mb-6 font-body text-[0.82rem] text-t2 leading-[1.7]">
                  Withdrawal requests are processed within 3–5 business days. Minimum withdrawal $10,000. Funds returned to original payment wallet.
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Withdrawal Amount (USD)</label>
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="10000" min={10000} className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-mono text-[1.4rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Wallet Address</label>
                  <input type="text" value={withdrawWallet} onChange={e => setWithdrawWallet(e.target.value)} placeholder="Your BTC/ETH/USDC address" className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Currency</label>
                  <select value={withdrawCurrency} onChange={e => setWithdrawCurrency(e.target.value)} className="bg-s2 border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full cursor-pointer min-h-[44px]">
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="usdc">USDC</option>
                  </select>
                </div>
                {withdrawMsg && (
                  <div className={`py-3 px-4 border-l-2 font-body text-[0.82rem] leading-[1.6] my-4 ${withdrawMsg.type === 'error' ? 'border-l-[hsl(var(--red))] text-[#fca5a5] bg-[rgba(239,68,68,0.05)]' : 'border-l-[hsl(var(--green))] text-[#86efac] bg-[rgba(34,197,94,0.05)]'}`}>
                    {withdrawMsg.text}
                  </div>
                )}
                <button onClick={submitWithdrawal} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Submit Withdrawal Request</button>
              </Card>
              <Card title="Withdrawal History">
                <div className="text-center py-12 font-heading text-base italic text-t3">No withdrawal history.</div>
              </Card>
            </>
          )}

          {/* PROFILE */}
          {page === 'profile' && (
            <>
              <div className="border border-gold bg-gold-glow p-8 text-center mb-6">
                <div className="font-label text-[0.62rem] text-t3 tracking-[0.2em] uppercase mb-2">Partner Tier</div>
                <div className="font-heading text-[2rem] text-gold">Starter</div>
                <div className="font-body text-[0.8rem] text-t3 mt-1 mb-3">$3,000 away from Growth tier</div>
                <div className="w-full max-w-[300px] h-2 bg-s3 mx-auto mb-2">
                  <div className="h-full bg-gold" style={{ width: '0%' }} />
                </div>
                <div className="font-mono text-[0.62rem] text-t4">Unlock: Growth Pool (22% APY) · 5% Referral Commission · More Funds</div>
                <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.12em] uppercase bg-transparent border border-gold py-2 px-5 cursor-pointer hover:bg-gold hover:text-void transition-all mt-4 min-h-[40px]">View All Benefits →</button>
              </div>
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
                <Card title="Partner Details">
                  <div className="space-y-3">
                    {[
                      { l: 'Full Name', v: '—' },
                      { l: 'Email', v: '—' },
                      { l: 'Country', v: '—' },
                      { l: 'Member Since', v: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                      { l: 'Risk Profile', v: 'Not assessed' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-b1 last:border-b-0">
                        <span className="font-body text-[0.82rem] text-t1">{r.l}</span>
                        <span className="font-mono text-[0.78rem] text-t2">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Account Security">
                  <div className="flex flex-col gap-2 mb-4">
                    <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">New Password</label>
                    <input type="password" placeholder="Min. 8 characters" className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
                  </div>
                  <button className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-gold bg-transparent border border-gold py-3.5 px-8 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[48px]">Update Password</button>
                </Card>
              </div>
            </>
          )}

          {/* LEADERBOARD */}
          {page === 'leaderboard' && (
            <>
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))] mb-5">
                <KPI label="Your Rank" value="—" cls="text-gold" />
                <KPI label="Total Committed" value="$0.00" />
                <KPI label="Percentile" value="—" />
                <KPI label="Tier" value="Starter" cls="text-gold" />
              </div>
              <Card title="Top Partners · Global Leaderboard" extra={<span className="font-mono text-[0.65rem] text-t3">Anonymized · Updated daily</span>}>
                <div className="overflow-x-auto -m-5">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        {['#', 'Partner', 'Region', 'Committed', 'Est. Returns', 'Tier'].map(h => (
                          <th key={h} className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase py-2.5 px-4 text-right first:text-left bg-s2 border-b border-b2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((p, i) => (
                        <tr key={i} className="hover:bg-s2">
                          <td className={`font-mono text-[0.78rem] py-3 px-4 border-b border-b1 text-left ${i < 3 ? 'text-gold' : 'text-t2'}`}>{i + 1}</td>
                          <td className="font-body text-[0.78rem] text-t1 py-3 px-4 border-b border-b1 text-right">{p.name}</td>
                          <td className="font-mono text-[0.78rem] text-t2 py-3 px-4 border-b border-b1 text-right">{p.region}</td>
                          <td className="font-mono text-[0.78rem] text-gold py-3 px-4 border-b border-b1 text-right">${p.committed.toLocaleString()}</td>
                          <td className="font-mono text-[0.78rem] text-asp-green py-3 px-4 border-b border-b1 text-right">${Math.round(p.committed * 1.15).toLocaleString()}</td>
                          <td className="py-3 px-4 border-b border-b1 text-right">
                            <span className={`font-label text-[0.55rem] tracking-[0.1em] uppercase py-0.5 px-2 border ${p.tier === 'Gold' ? 'text-gold border-gold' : p.tier === 'Silver' ? 'text-[#c0c0c0] border-[#c0c0c0]' : 'text-[#cd7f32] border-[#cd7f32]'}`}>{p.tier}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {/* NETWORK */}
          {page === 'network' && (
            <>
              <Card title="Global Partner Network" extra={<span className="font-mono text-[0.65rem] text-t3">1,247+ partners · 6 continents</span>}>
                <div className="bg-s2 p-6">
                  <svg viewBox="0 0 1000 480" className="w-full opacity-85" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="480" fill="hsl(var(--s2))" />
                    <ellipse cx="200" cy="210" rx="115" ry="85" fill="hsl(var(--b1))" opacity="0.9" />
                    <ellipse cx="225" cy="320" rx="72" ry="65" fill="hsl(var(--b1))" opacity="0.9" />
                    <ellipse cx="462" cy="185" rx="82" ry="58" fill="hsl(var(--b1))" opacity="0.9" />
                    <ellipse cx="518" cy="295" rx="92" ry="92" fill="hsl(var(--b1))" opacity="0.9" />
                    <ellipse cx="685" cy="215" rx="135" ry="82" fill="hsl(var(--b1))" opacity="0.9" />
                    <ellipse cx="825" cy="355" rx="62" ry="42" fill="hsl(var(--b1))" opacity="0.9" />
                    <circle cx="462" cy="172" r="7" fill="hsl(43 55% 54%)" opacity="0.9"><animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" /></circle>
                    <circle cx="490" cy="165" r="5" fill="hsl(43 55% 54%)" opacity="0.7" />
                    <circle cx="662" cy="228" r="8" fill="hsl(43 55% 54%)" opacity="0.9"><animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" /></circle>
                    <circle cx="718" cy="238" r="6" fill="hsl(43 55% 54%)" opacity="0.8" />
                    <circle cx="508" cy="308" r="8" fill="hsl(43 55% 54%)" opacity="0.9"><animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" /></circle>
                    <circle cx="538" cy="338" r="6" fill="hsl(43 55% 54%)" opacity="0.7" />
                    <circle cx="168" cy="198" r="6" fill="hsl(43 55% 54%)" opacity="0.7" />
                    <circle cx="822" cy="352" r="5" fill="hsl(43 55% 54%)" opacity="0.5" />
                    <line x1="462" y1="172" x2="662" y2="228" stroke="hsl(43 55% 54%)" strokeWidth="0.6" opacity="0.15" />
                    <line x1="462" y1="172" x2="508" y2="308" stroke="hsl(43 55% 54%)" strokeWidth="0.6" opacity="0.15" />
                    <line x1="662" y1="228" x2="788" y2="258" stroke="hsl(43 55% 54%)" strokeWidth="0.6" opacity="0.15" />
                  </svg>
                </div>
              </Card>
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-[hsl(var(--b1))]">
                <KPI label="Middle East" value="34%" cls="text-gold" change="UAE · KSA · Qatar" />
                <KPI label="Africa" value="28%" change="NG · KE · GH · ZA" />
                <KPI label="Europe" value="22%" change="UK · DE · CH" />
                <KPI label="Asia Pacific" value="16%" change="SG · IN · AU" />
              </div>
            </>
          )}

          {/* CONCIERGE */}
          {page === 'concierge' && (
            <div className="bg-s1 border border-b1 flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
              <div className="py-4 px-5 border-b border-b1 flex justify-between items-center">
                <span className="font-label text-[0.68rem] text-t2 tracking-[0.18em] uppercase">ASP Intelligence</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.65rem] text-asp-green flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[hsl(var(--green))] animate-pulse-dot inline-block" /> Online</span>
                  <button onClick={clearChat} className="font-label text-[0.52rem] text-t4 tracking-[0.1em] uppercase bg-transparent border border-b2 py-1 px-3 cursor-pointer hover:border-b3 hover:text-t3 transition-all min-h-[28px]">Clear</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-0">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] ${m.from === 'user' ? 'self-end' : 'self-start'}`}>
                    <div className={`p-4 px-5 border-l-2 ${m.from === 'user' ? 'bg-[hsl(var(--b2))] border-l-[hsl(var(--b3))]' : 'bg-s2 border-l-[hsl(var(--gold))]'}`}>
                      {m.from === 'asp' && <div className="font-label text-[0.58rem] text-gold tracking-[0.15em] uppercase mb-2">ASP Intelligence</div>}
                      <div className="font-body text-[0.85rem] text-t2 leading-[1.75]">{formatChatText(m.text)}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="self-start max-w-[80%]">
                    <div className="p-4 px-5 border-l-2 bg-s2 border-l-[hsl(var(--gold))]">
                      <div className="font-label text-[0.58rem] text-gold tracking-[0.15em] uppercase mb-2">ASP Intelligence</div>
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gold animate-pulse-dot inline-block" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gold animate-pulse-dot inline-block" style={{ animationDelay: '300ms' }} />
                        <span className="w-2 h-2 bg-gold animate-pulse-dot inline-block" style={{ animationDelay: '600ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion chips */}
              {chatMessages.length <= 1 && (
                <div className="px-5 pb-3 flex gap-2 flex-wrap">
                  {CHAT_SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      className="font-label text-[0.58rem] text-t3 tracking-[0.08em] bg-transparent border border-b2 py-2 px-4 cursor-pointer hover:border-gold hover:text-gold transition-all min-h-[36px]">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="py-4 px-5 border-t border-b1 flex gap-3 flex-shrink-0">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about funds, returns, strategies..." className="flex-1 bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-2.5 font-body text-[0.85rem] text-t1 outline-none min-h-[44px]" />
                <button onClick={() => sendMessage()} disabled={chatLoading} className={`font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-2.5 px-6 cursor-pointer hover:bg-gold-bright transition-all min-h-[44px] ${chatLoading ? 'opacity-50' : ''}`}>Send</button>
              </div>
            </div>
          )}

          {/* VAULT */}
          {page === 'vault' && (
            <>
              <Card title="Document Vault" extra={<span className="font-mono text-[0.65rem] text-t3">Encrypted · Partner Access Only</span>}>
                <div className="flex gap-3 mb-5 max-md:flex-col">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-t4 text-sm">🔍</span>
                    <input type="text" value={vaultSearch} onChange={e => setVaultSearch(e.target.value)}
                      placeholder="Search documents..." className="bg-s2 border border-b1 py-2.5 pl-9 pr-4 font-body text-[0.82rem] text-t1 outline-none w-full focus:border-gold transition-colors min-h-[44px]" />
                  </div>
                  <select value={vaultFilter} onChange={e => setVaultFilter(e.target.value)}
                    className="bg-s2 border border-b1 py-2.5 px-4 font-label text-[0.62rem] text-t2 tracking-[0.1em] uppercase outline-none cursor-pointer min-h-[44px]">
                    {vaultDocTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
                  </select>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="text-center py-10 font-heading text-base italic text-t3">No documents yet. Documents are generated automatically as your portfolio grows.</div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {filteredDocs.map((doc, i) => {
                      const locked = tierOrder[doc.tier as keyof typeof tierOrder] > tierOrder[currentTier as keyof typeof tierOrder];
                      return (
                        <div key={i} className={`flex items-center justify-between py-3 px-4 border-b border-b1 last:border-b-0 ${locked ? 'opacity-50' : 'hover:bg-s2'} transition-colors`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0">{locked ? '🔒' : '📄'}</span>
                            <div className="min-w-0">
                              <div className="font-body text-[0.82rem] text-t1 truncate flex items-center gap-2">
                                {doc.name}
                                {doc.isNew && <span className="font-label text-[0.48rem] text-gold border border-gold py-0 px-1.5 tracking-[0.1em] uppercase flex-shrink-0">New</span>}
                              </div>
                              <div className="font-mono text-[0.62rem] text-t4 mt-0.5">
                                PDF · {doc.size} · Updated {doc.updated}
                                {locked && <span className="text-asp-amber ml-2">· {doc.tier === 'silver' ? 'Silver' : 'Gold'}+ Only</span>}
                              </div>
                            </div>
                          </div>
                          {!locked && (
                            <div className="flex gap-2 flex-shrink-0 ml-3">
                              <button className="font-label text-[0.52rem] tracking-[0.1em] uppercase text-gold bg-transparent border border-gold py-1 px-3 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[32px]">Download</button>
                              <button className="font-label text-[0.52rem] tracking-[0.1em] uppercase text-t3 bg-transparent border border-b2 py-1 px-3 cursor-pointer hover:border-b3 transition-all min-h-[32px] max-sm:hidden">Preview</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
              <Card title="Generate Partner Certificate">
                <p className="font-body text-[0.85rem] text-t3 leading-[1.75] mb-5">Generate your official Adams Streett Partners membership certificate displaying your tier, partner ID, and membership date.</p>
                <button className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Generate Certificate</button>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
