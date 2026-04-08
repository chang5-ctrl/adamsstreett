import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FUNDS, WALLETS, RETURN_MULTIPLIERS, SPONSORED_FUNDS } from '@/data/funds';
import MembershipPage from './MembershipPage';
import AcademyPage from './AcademyPage';
import ASPNewsPage from './ASPNewsPage';
import SponsoredListingPage from './SponsoredListingPage';
import { usePortfolio } from '@/hooks/usePortfolio';
import CryptoCheckout from '@/components/checkout/CryptoCheckout';

type Page = 'overview' | 'portfolio' | 'invest' | 'staking' | 'returns' | 'referral' | 'withdraw' | 'profile' | 'leaderboard' | 'network' | 'concierge' | 'vault' | 'membership' | 'academy' | 'affiliate' | 'sponsored';

const PAGE_TITLES: Record<Page, string> = {
  overview: 'Overview', portfolio: 'Portfolio Analytics', invest: 'New Investment', staking: 'Staking Pools',
  returns: 'Returns Simulator', referral: 'Referral Program', withdraw: 'Withdrawal', profile: 'Partner Profile',
  leaderboard: 'Partner Leaderboard', network: 'Global Network', concierge: 'ASP Intelligence', vault: 'Document Vault',
  membership: 'Membership', academy: 'ASP Academy', affiliate: 'ASP News', sponsored: 'List Your Fund',
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
  { group: 'Premium', items: [
    { id: 'membership', label: 'Membership', icon: '♦' },
    { id: 'academy', label: 'Academy', icon: '▥' },
    { id: 'affiliate', label: 'ASP News', icon: '⊞' },
    { id: 'sponsored', label: 'List Fund', icon: '▦' },
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
  const { balance, investments, addInvestment, confirmInvestment } = usePortfolio();
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
  const [investMsg, setInvestMsg] = useState<{ text: string; type: 'success' | 'error' | 'pending' } | null>(null);
  const [investLoading, setInvestLoading] = useState(false);
  const [refId, setRefId] = useState('');
  // PayPal modal state — lifted here so it survives child re-renders
  const [ppModal, setPpModal] = useState<'closed' | 'login' | 'processing' | 'success'>('closed');
  const [ppEmail, setPpEmail] = useState('');
  const [ppPassword, setPpPassword] = useState('');
  const [ppError, setPpError] = useState('');
  const [ppDots, setPpDots] = useState('');
  const ppStageRef = useRef<string>('closed');
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
  const [simHorizon, setSimHorizon] = useState('12');
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultFilter, setVaultFilter] = useState('all');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [investFilter, setInvestFilter] = useState('all');

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
    const mult = RETURN_MULTIPLIERS[horizon];
    if (!mult) return { cons: '—', agg: '—' };
    const a = parseFloat(amount);
    return {
      cons: '$' + Math.round(a * mult.cons).toLocaleString(),
      agg: '$' + Math.round(a * mult.agg).toLocaleString(),
    };
  }, [fundSelect, amount, horizon]);

  const simCalc = useCallback(() => {
    const a = parseFloat(simAmount) || 500;
    const mult = RETURN_MULTIPLIERS[simHorizon];
    if (!mult) return { cons: '—', agg: '—' };
    return {
      cons: '$' + Math.round(a * mult.cons).toLocaleString(),
      agg: '$' + Math.round(a * mult.agg).toLocaleString(),
    };
  }, [simAmount, simHorizon]);

  const handleReset = () => {
    setFundSelect(''); setAmount(''); setPresetAmount(null); setShowCustomInput(false); setInvestMsg(null); setRefId('');
  };

  const submitInvestment = () => {
    if (!fundSelect) { setInvestMsg({ text: 'Please select a fund.', type: 'error' }); return; }
    if (!amount || parseFloat(amount) < 500) { setInvestMsg({ text: 'Minimum commitment is $500.', type: 'error' }); return; }
    setInvestLoading(true);
    const fundName = FUNDS.find(f => f.selectValue === fundSelect)?.name || fundSelect;
    const inv = addInvestment({
      fundName,
      amount: parseFloat(amount),
      horizonMonths: parseInt(horizon),
      paymentMethod: selectedPayment as 'btc' | 'eth' | 'usdc' | 'usdt',
      projectedValue: Math.round(parseFloat(amount) * (RETURN_MULTIPLIERS[horizon]?.agg || 1)),
    });
    setRefId(inv.reference);
    setInvestMsg({
      text: `Commitment recorded. Reference: ${inv.reference}. Send your exact payment to the wallet address below. Your portfolio activates automatically once payment is detected on-chain.`,
      type: 'pending',
    });
    setInvestLoading(false);
  };

  const handlePayPalSuccess = (orderId: string) => {
    const fundName = FUNDS.find(f => f.selectValue === fundSelect)?.name || fundSelect;
    const inv = addInvestment({
      fundName,
      amount: parseFloat(amount),
      horizonMonths: parseInt(horizon),
      paymentMethod: 'paypal',
      projectedValue: Math.round(parseFloat(amount) * (RETURN_MULTIPLIERS[horizon]?.agg || 1)),
    });
    confirmInvestment(inv.id);
    setRefId(inv.reference);
    setInvestMsg({
      text: `✓ PayPal payment confirmed. Reference: ${inv.reference}. Your investment in ${fundName} is now active and earning returns. PayPal Order: ${orderId}`,
      type: 'success',
    });
  };

  const validatePayPal = () => {
    if (!fundSelect) { setInvestMsg({ text: 'Please select a fund above before proceeding.', type: 'error' }); return false; }
    if (!amount || parseFloat(amount) < 500) { setInvestMsg({ text: 'Minimum commitment is $500. Please enter a valid amount above.', type: 'error' }); return false; }
    return true;
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
    setChatMessages(prev => [...prev, { text: msg, from: 'user' }]);
    setChatInput('');
    setChatLoading(true);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = '';
      if (lower.includes('best') && lower.includes('fund') || lower.includes('which fund') || lower.includes('recommend')) {
        response = 'Based on a balanced risk approach, I\'d recommend starting with the **Adams Streett General Fund** — our flagship diversified strategy. For a 12-month horizon your $500 grows to **$2,100** (4.2x). For higher conviction, the **Private Equity Pool** offers growth exposure. What\'s your risk tolerance? *Projections are illustrative.*';
      } else if (lower.includes('staking') || lower.includes('pool')) {
        response = 'We offer three staking pools:\n\n— **Flex Pool**: 14% APY, 90-day lock, min $500\n— **Growth Pool**: 22% APY, 180-day lock, min $3,000\n— **Apex Pool**: 35% APY, 365-day lock, min $5,000 (Premium+ only)\n\nAll pools compound daily. *Rates are target yields.*';
      } else if (lower.includes('payment') || lower.includes('pay') || lower.includes('wallet') || lower.includes('usdt')) {
        response = 'We accept **BTC**, **ETH**, **USDC** (ERC-20), and **USDT** (TRC-20). After submitting a commitment on the Invest page, send your exact amount to the displayed wallet address. Our system detects on-chain payments automatically.';
      } else if (lower.includes('return') || lower.includes('calculate') || lower.includes('$500') || lower.includes('500')) {
        response = 'On **$500** committed:\n\n— **3 months**: $950 (1.9x)\n— **6 months**: $1,400 (2.8x)\n— **12 months**: $2,100 (4.2x)\n— **36 months**: $4,900 (9.8x)\n— **60 months**: $9,000 (18x)\n\nUse the Returns Simulator for custom projections. *All projections are illustrative.*';
      } else if (lower.includes('tier') || lower.includes('bronze') || lower.includes('silver') || lower.includes('gold')) {
        response = 'Investment tiers unlock exclusive benefits:\n\n— **Starter**: $500+ — General Fund, DeFi Yield, Fixed Income\n— **Growth**: $3,000+ — All funds except Frontier & Longevity, 5% referral\n— **Premium**: $5,000+ — ALL 21 funds, Apex Pool, priority processing\n— **Elite**: $10,000+ — Platinum status, ASP Black Card, dedicated concierge';
      } else if (lower.includes('referral') || lower.includes('refer') || lower.includes('commission')) {
        response = 'You earn **5% commission** on every commitment made by a partner you refer. Your referral code is on the Referral page. Minimum payout is $1,000, processed monthly.';
      } else {
        response = 'I can help you with fund selection, portfolio optimization, staking strategies, payment instructions, tier benefits, and return projections. Could you be more specific?';
      }
      setChatMessages(prev => [...prev, { text: response, from: 'asp' }]);
      setChatLoading(false);
    }, 1200);
  };

  const clearChat = () => {
    setChatMessages([{ text: 'Welcome to your private investment concierge. How can I assist you today?', from: 'asp' }]);
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

  const generateBlackCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 860;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 860, 540);

    // Gold border
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 820, 500);

    // Inner border
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 800, 480);

    // ASP logo
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 36px serif';
    ctx.fillText('ASP', 55, 80);

    ctx.fillStyle = 'rgba(201,168,76,0.6)';
    ctx.font = '10px sans-serif';
    ctx.fillText('ADAMS STREETT PARTNERS', 55, 98);

    // Partner name
    ctx.fillStyle = '#ffffff';
    ctx.font = '300 32px serif';
    ctx.fillText('New Partner', 55, 280);

    // Details
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('MEMBER SINCE', 55, 370);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase(), 55, 392);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('TIER', 250, 370);
    ctx.fillStyle = '#c9a84c';
    ctx.font = '16px monospace';
    ctx.fillText('GOLD', 250, 392);

    // Card number
    const cardNum = 'ASP-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px monospace';
    ctx.fillText(cardNum, 55, 470);

    // Chip
    ctx.fillStyle = '#c9a84c';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(55, 140, 65, 45);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(87, 140); ctx.lineTo(87, 185); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(55, 162); ctx.lineTo(120, 162); ctx.stroke();
    ctx.globalAlpha = 1;

    // Download
    const link = document.createElement('a');
    link.download = 'ASP-Black-Card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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

  const VAULT_FILTER_TABS = ['all', 'Fund Documents', 'Subscription Agreements', 'NAV Reports', 'Tax Documents', 'Capital Call Notices', 'Raw Data'];

  // Empty vault - real documents only generated from user activity
  const vaultDocs: any[] = [];

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

  const paymentNetworkNote = () => {
    switch (selectedPayment) {
      case 'btc': return 'Bitcoin Network';
      case 'eth': return 'Ethereum Network';
      case 'usdc': return 'USDC · ERC-20 on Ethereum';
      case 'usdt': return 'Send USDT on Tron (TRC-20) network only. Do not send on Ethereum network.';
      default: return '';
    }
  };

  // PayPal modal processing dots animation
  useEffect(() => {
    if (ppModal !== 'processing') return;
    const iv = setInterval(() => setPpDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(iv);
  }, [ppModal]);

  const ppLogin = () => {
    if (!ppEmail || !ppPassword) { setPpError('Please enter your PayPal email and password.'); return; }
    setPpError('');
    setPpModal('processing');
    ppStageRef.current = 'processing';
    setTimeout(() => {
      if (ppStageRef.current !== 'processing') return;
      const mockOrderId = 'MOCK-' + Math.random().toString(36).substr(2, 10).toUpperCase();
      setPpModal('success');
      ppStageRef.current = 'success';
      setTimeout(() => {
        setPpModal('closed');
        ppStageRef.current = 'closed';
        handlePayPalSuccess(mockOrderId);
      }, 1800);
    }, 2800);
  };

  const ppCancel = () => { setPpModal('closed'); ppStageRef.current = 'closed'; };

  const ppHorizonLabel: Record<string, string> = {
    '3': '3 Months', '6': '6 Months', '12': '12 Months',
    '24': '24 Months', '36': '36 Months', '60': '60 Months',
  };

  // PayPal modal — rendered via portal on document.body so it's completely
  // outside the dashboard DOM tree and immune to re-mount issues
  const paypalModal = ppModal !== 'closed' ? createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-[420px] mx-4 overflow-hidden"
        style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center py-5 px-6" style={{ background: '#003087' }}>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#fff' }}>Pay</span><span style={{ color: '#009cde' }}>Pal</span>
          </span>
        </div>
        <div className="p-7">
          {ppModal !== 'success' && (
            <div className="mb-5 p-4 rounded" style={{ background: '#f5f7fa', border: '1px solid #e8ecef' }}>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>ORDER SUMMARY</div>
              <div style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600, marginBottom: '2px' }}>{FUNDS.find(f => f.selectValue === fundSelect)?.name || '—'}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '10px' }}>Investment Horizon: {ppHorizonLabel[horizon] ?? `${horizon} Months`}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #e8ecef', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Total Payment</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#003087' }}>${(parseFloat(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
          {ppModal === 'login' && (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Log in to PayPal</div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#374151', display: 'block', marginBottom: '4px' }}>Email or mobile number</label>
                <input type="email" value={ppEmail} onChange={e => setPpEmail(e.target.value)} placeholder="Email or mobile number" autoFocus
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const, color: '#111' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
                <input type="password" value={ppPassword} onChange={e => setPpPassword(e.target.value)} placeholder="Password" onKeyDown={e => e.key === 'Enter' && ppLogin()}
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const, color: '#111' }} />
              </div>
              {ppError && <div style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '12px' }}>{ppError}</div>}
              <button type="button" onClick={ppLogin} style={{ width: '100%', background: '#0070ba', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}>Log In</button>
              <button type="button" onClick={ppCancel} style={{ width: '100%', background: 'transparent', color: '#0070ba', border: '1.5px solid #0070ba', borderRadius: '4px', padding: '12px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>🔒 Your payment information is encrypted and secure</div>
            </>
          )}
          {ppModal === 'processing' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTopColor: '#0070ba', borderRadius: '50%', margin: '0 auto 16px', animation: 'ppSpin 0.8s linear infinite' }} />
              <style>{`@keyframes ppSpin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Processing Payment{ppDots}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Verifying your PayPal account and capturing funds</div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '16px' }}>Please do not close this window</div>
            </div>
          )}
          {ppModal === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '60px', height: '60px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M6 15l7 7 11-12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>Payment Confirmed!</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>Your investment is being activated…</div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
    {paypalModal}
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
                <KPI label="Portfolio Value" value={`$${balance.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} change={balance.totalCommitted > 0 ? `$${balance.totalCommitted.toLocaleString()} committed` : undefined} />
                <KPI label="Yield Earned" value={`$${balance.yieldEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                <KPI label="Active Positions" value={String(balance.activePositions)} cls="text-gold" />
                <KPI label="Referral Earnings" value="$0.00" />
              </div>
              <Card title="Portfolio Intelligence Alerts" extra={<span className="font-mono text-[0.65rem] text-t3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[hsl(var(--green))] animate-pulse-dot inline-block" /> Live</span>}>
                <div className="border-l-2 border-l-[hsl(var(--gold))] py-3.5 px-5 border-b border-b1 flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
                  <span className="font-body text-[0.8rem] text-t2 leading-[1.6]">Welcome to Adams Streett Partners. Complete your first commitment to activate your portfolio.</span>
                  <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.1em] uppercase cursor-pointer whitespace-nowrap ml-4 max-md:ml-0 bg-transparent border-none p-0">Invest Now →</button>
                </div>
              </Card>
              <Card title="Active Commitments" extra={<button onClick={() => setPage('invest')} className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[36px]">+ New Position</button>}>
                {investments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="font-heading text-base italic text-t3 mb-4">No active commitments.<br />Make your first investment to get started.</div>
                    <button onClick={() => setPage('invest')} className="font-label text-[0.62rem] text-gold tracking-[0.12em] uppercase bg-transparent border border-gold py-2.5 px-6 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[44px]">Make Your First Investment →</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {investments.map((inv) => (
                      <div key={inv.id} className="border border-b1 p-4 bg-s2 hover:bg-s3 transition-colors">
                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                          <span className="font-heading text-[0.92rem] text-t1">{inv.fundName}</span>
                          <span className={`font-label text-[0.5rem] tracking-[0.1em] uppercase border py-0.5 px-2 ${inv.status === 'active' ? 'text-asp-green border-[hsl(var(--green))]' : 'text-asp-amber border-[hsl(var(--amber))]'}`}>
                            {inv.status === 'active' ? '● Active' : '◌ Pending'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-3 mb-2">
                          <div><div className="font-label text-[0.48rem] text-t4 tracking-[0.1em] uppercase mb-0.5">Committed</div><div className="font-mono text-[0.9rem] text-gold">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div></div>
                          <div><div className="font-label text-[0.48rem] text-t4 tracking-[0.1em] uppercase mb-0.5">Horizon</div><div className="font-mono text-[0.82rem] text-t2">{inv.horizonMonths}mo</div></div>
                          <div><div className="font-label text-[0.48rem] text-t4 tracking-[0.1em] uppercase mb-0.5">Projected</div><div className="font-mono text-[0.82rem] text-t2">${inv.projectedValue.toLocaleString()}</div></div>
                          <div><div className="font-label text-[0.48rem] text-t4 tracking-[0.1em] uppercase mb-0.5">Via</div><div className="font-label text-[0.6rem] text-t3 uppercase tracking-[0.06em]">{inv.paymentMethod}</div></div>
                        </div>
                        <div className="font-mono text-[0.62rem] text-t4">Ref: {inv.reference} · {inv.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      </div>
                    ))}
                  </div>
                )}
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

                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2">
                  {investFilteredFunds.map((f, i) => {
                    const isSelected = fundSelect === f.selectValue;
                    const isSponsored = SPONSORED_FUNDS.includes(f.name);
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
                        className={`bg-s1 border p-4 cursor-pointer transition-all relative ${isSelected ? 'border-gold bg-gold-glow shadow-[0_0_20px_rgba(201,168,76,0.1)]' : 'border-b1 hover:border-b2 opacity-80 hover:opacity-100'}`}
                      >
                        {isSponsored && <div className="absolute top-2 right-2 font-label text-[0.45rem] text-gold tracking-[0.1em] uppercase border border-gold py-0.5 px-1.5">Featured</div>}
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <span className="font-heading text-[0.88rem] text-t1 leading-tight">{f.name}</span>
                          <span className={`font-label text-[0.5rem] tracking-[0.1em] uppercase border py-0.5 px-1.5 whitespace-nowrap ${riskColors[f.risk] || 'text-t3 border-b1'}`}>{f.riskLabel}</span>
                        </div>
                        <div className="font-mono text-[1.1rem] text-gold mb-2">{f.apy} <span className="text-[0.6rem] text-t3">APY</span></div>
                        <div className="flex justify-between items-center">
                          <span className="font-label text-[0.5rem] tracking-[0.1em] uppercase text-t4 border border-b1 py-0.5 px-1.5">{catLabels[f.cat] || f.cat}</span>
                          {isSponsored && <span className="font-mono text-[0.45rem] text-t4">Sponsored</span>}
                        </div>
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
                        <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">Conservative Projection (85%)</div>
                        <div className="font-mono text-[1.2rem] text-t1">{projections.cons}</div>
                      </div>
                      <div>
                        <div className="font-label text-[0.58rem] text-t3 tracking-[0.12em] uppercase mb-1">Aggressive Projection (100%)</div>
                        <div className="font-mono text-[1.2rem] text-gold">{projections.agg}</div>
                      </div>
                      {amount && parseFloat(amount) >= 500 && RETURN_MULTIPLIERS[horizon] && (
                        <div className="mt-3 pt-3 border-t border-b1 font-mono text-[0.72rem] text-t3">
                          Multiplier: {RETURN_MULTIPLIERS[horizon].agg}x over {horizon} months
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-b1 font-body text-[0.7rem] text-t4 leading-[1.6]">Projections are illustrative targets. All investments involve risk.</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 mt-6">
                  <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-3">Payment Method</div>
                  <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 gap-px bg-[hsl(var(--b1))]">
                    {[
                      { key: 'paypal', icon: '🅿', name: 'PayPal', desc: 'Pay securely with PayPal. Instant confirmation.', badge: 'Instant · Recommended' },
                      { key: 'btc', icon: '₿', name: 'Bitcoin', desc: 'BTC · Auto-detected on-chain', badge: 'Bitcoin Network' },
                      { key: 'eth', icon: 'Ξ', name: 'Ethereum', desc: 'ETH · Auto-detected on-chain', badge: 'Ethereum Network' },
                      { key: 'usdc', icon: '◎', name: 'USDC', desc: 'Stablecoin · ERC-20 on Ethereum', badge: 'ERC-20 Network' },
                      { key: 'usdt', icon: 'T', name: 'USDT', desc: 'Tether on Tron. Near-zero fees.', badge: 'TRC-20 Network' },
                    ].map(p => (
                      <div key={p.key} onClick={() => { setSelectedPayment(p.key); setInvestMsg(null); setRefId(''); }}
                        className={`bg-s1 p-4 cursor-pointer transition-all hover:bg-s2 relative ${selectedPayment === p.key ? 'border border-gold bg-gold-glow' : ''}`}>
                        {p.key === 'paypal' && <span className="absolute top-2 right-2 font-label text-[0.42rem] text-gold tracking-[0.08em] uppercase border border-gold py-0.5 px-1">★ Fast</span>}
                        <div className="font-mono text-[1.3rem] mb-2 text-gold">{p.icon}</div>
                        <div className="font-heading text-[0.88rem] text-t1 mb-1">{p.name}</div>
                        <p className="font-body text-[0.68rem] text-t3 leading-[1.5] mb-2">{p.desc}</p>
                        <span className={`font-label text-[0.46rem] tracking-[0.1em] uppercase border py-0.5 px-1.5 ${p.key === 'paypal' ? 'text-gold border-gold' : 'text-t4 border-b1'}`}>{p.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── PayPal checkout ── */}
                {selectedPayment === 'paypal' ? (
                  <div className="mt-5">
                    {investMsg?.type === 'success' ? (
                      <div className="py-4 px-5 border-l-2 border-l-[hsl(var(--green))] text-[#86efac] bg-[rgba(34,197,94,0.05)] font-body text-[0.82rem] leading-[1.7]">
                        {investMsg.text}
                      </div>
                    ) : (
                      <>
                        {investMsg?.type === 'error' && (
                          <div className="py-3 px-4 border-l-2 border-l-[hsl(var(--red))] text-[#fca5a5] bg-[rgba(239,68,68,0.05)] font-body text-[0.82rem] leading-[1.6] mb-4">
                            {investMsg.text}
                          </div>
                        )}
                        <div className="bg-s2 border border-b1 p-5">
                          <div className="font-label text-[0.58rem] text-t3 tracking-[0.15em] uppercase mb-3">Secure Checkout via PayPal</div>
                          <div className="flex items-center gap-3 mb-4 py-2.5 px-4 border border-b1 bg-s3">
                            <span className="font-label text-[0.5rem] text-t4 tracking-[0.1em] uppercase">Fund</span>
                            <span className="font-heading text-[0.88rem] text-gold">{FUNDS.find(f => f.selectValue === fundSelect)?.name || '— Select a fund above'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); if (!validatePayPal()) return; setPpModal('login'); setPpEmail(''); setPpPassword(''); setPpError(''); }}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 font-bold text-[0.92rem] transition-all cursor-pointer min-h-[52px] hover:opacity-90 active:scale-[0.98]"
                            style={{ background: '#FFC439', color: '#003087', border: 'none', borderRadius: '4px' }}
                          >
                            <span style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.01em' }}>
                              <span style={{ color: '#003087' }}>Pay</span>
                              <span style={{ color: '#009cde' }}>Pal</span>
                            </span>
                            <span style={{ color: '#003087', fontWeight: 700, fontSize: '0.9rem' }}>
                              — Pay ${(parseFloat(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                            </span>
                          </button>
                          <p className="font-body text-[0.68rem] text-t4 text-center mt-2">Secured by PayPal · 256-bit SSL encryption</p>
                        </div>
                      </>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={handleReset} className="font-label text-[0.7rem] tracking-[0.15em] uppercase text-t3 bg-transparent border border-b2 py-3 px-7 cursor-pointer hover:border-gold hover:text-gold transition-all min-h-[44px]">Reset</button>
                    </div>
                  </div>
                ) : (
                  /* ── Crypto checkout ── */
                  <div className="mt-5">
                    {refId ? (
                      <CryptoCheckout
                        selectedCurrency={selectedPayment as 'btc' | 'eth' | 'usdc' | 'usdt'}
                        walletAddress={WALLETS[selectedPayment as keyof typeof WALLETS] || WALLETS.btc}
                        amount={parseFloat(amount) || 0}
                        reference={refId}
                      />
                    ) : (
                      <div className="bg-s2 border border-b2 p-5">
                        <div className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase mb-2">Send Payment To</div>
                        <div className="font-mono text-[0.75rem] text-t2 break-all leading-[1.6] mb-1">{WALLETS[selectedPayment as keyof typeof WALLETS] || WALLETS.btc}</div>
                        <div className={`font-mono text-[0.6rem] mb-3 ${selectedPayment === 'usdt' ? 'text-asp-amber' : 'text-t4'}`}>{paymentNetworkNote()}</div>
                        <button onClick={() => navigator.clipboard.writeText(WALLETS[selectedPayment as keyof typeof WALLETS] || WALLETS.btc)} className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[36px]">Copy Address</button>
                      </div>
                    )}
                    {investMsg && (
                      <div className={`py-3 px-4 border-l-2 font-body text-[0.82rem] leading-[1.6] my-4 ${
                        investMsg.type === 'error' ? 'border-l-[hsl(var(--red))] text-[#fca5a5] bg-[rgba(239,68,68,0.05)]'
                        : investMsg.type === 'pending' ? 'border-l-[#c9a84c] text-[#c9a84c] bg-[rgba(201,168,76,0.05)]'
                        : 'border-l-[hsl(var(--green))] text-[#86efac] bg-[rgba(34,197,94,0.05)]'
                      }`}>
                        {investMsg.text}
                        {investMsg.type === 'pending' && <div className="font-mono text-[0.68rem] text-t4 mt-2">Awaiting payment — not yet confirmed</div>}
                      </div>
                    )}
                    <div className="flex gap-3 mt-6 flex-wrap">
                      {!refId && (
                        <button onClick={submitInvestment} disabled={investLoading}
                          className={`font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px] ${investLoading ? 'opacity-60 cursor-wait' : ''}`}>
                          {investLoading ? '⟳ Processing...' : 'Submit Commitment'}
                        </button>
                      )}
                      <button onClick={handleReset} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-gold bg-transparent border border-gold py-3.5 px-8 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[48px]">Reset</button>
                    </div>
                  </div>
                )}
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
                        {'badge' in p && p.badge && <span className="font-label text-[0.55rem] text-asp-red border border-[hsl(var(--red))] py-0.5 px-2 inline-block">{p.badge}</span>}
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
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Time Horizon</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: '3', label: '3M' }, { value: '6', label: '6M' }, { value: '12', label: '1Y' },
                      { value: '24', label: '2Y' }, { value: '36', label: '3Y' }, { value: '60', label: '5Y' },
                    ].map(h => (
                      <button key={h.value} onClick={() => setSimHorizon(h.value)}
                        className={`px-4 py-2.5 min-h-[44px] font-label text-[0.7rem] tracking-[0.08em] uppercase border transition-all ${
                          simHorizon === h.value ? 'border-gold bg-gold/10 text-gold' : 'border-b1 bg-s2 text-t3 hover:border-gold/40'
                        }`}>{h.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-px bg-[hsl(var(--b1))]">
                <KPI label={`Conservative (${RETURN_MULTIPLIERS[simHorizon]?.cons.toFixed(2)}x)`} value={sim.cons} cls="text-asp-green" />
                <KPI label={`Aggressive (${RETURN_MULTIPLIERS[simHorizon]?.agg}x)`} value={sim.agg} cls="text-gold" />
              </div>
              <div className="mt-4 font-body text-[0.72rem] text-t4 leading-[1.7]">
                Multiplier: {RETURN_MULTIPLIERS[simHorizon]?.agg}x over {simHorizon} months. Projections are illustrative. All investments involve risk.
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
                  <p>Share your referral link to start earning 5% commission.</p>
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
                  <input type="text" value={withdrawWallet} onChange={e => setWithdrawWallet(e.target.value)} placeholder="Your BTC/ETH/USDC/USDT address" className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase">Select Currency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'btc', symbol: '₿', name: 'Bitcoin', network: 'BTC Network' },
                      { id: 'eth', symbol: 'Ξ', name: 'Ethereum', network: 'ETH Network' },
                      { id: 'usdc', symbol: '◎', name: 'USDC', network: 'ERC-20' },
                      { id: 'usdt', symbol: 'T', name: 'USDT', network: 'TRC-20' },
                    ].map(c => (
                      <div key={c.id} onClick={() => setWithdrawCurrency(c.id)}
                        className={`bg-s1 border p-4 cursor-pointer transition-all text-center ${withdrawCurrency === c.id ? 'border-gold bg-gold-glow shadow-[0_0_16px_hsl(var(--gold)/0.12)]' : 'border-b1 hover:border-b2'}`}>
                        <div className="font-heading text-[1.4rem] text-gold mb-1">{c.symbol}</div>
                        <div className="font-heading text-[0.85rem] text-t1">{c.name}</div>
                        <div className="font-mono text-[0.55rem] text-t4 mt-0.5">{c.network}</div>
                      </div>
                    ))}
                  </div>
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
              {/* ASP Black Card */}
              <Card title="ASP Black Card">
                <div className="text-center py-8">
                  <div className="font-heading text-[1.1rem] text-t1 mb-3">Generate Your Black Card</div>
                  <p className="font-body text-[0.82rem] text-t3 leading-[1.7] mb-5 max-w-[400px] mx-auto">
                    Available for Gold tier and ASP Elite members. Generate a downloadable premium membership card.
                  </p>
                  <button onClick={generateBlackCard} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Generate Black Card ↓</button>
                </div>
              </Card>
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
                        {['#', 'Partner', 'Region', 'Committed', 'Tier'].map(h => (
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
                </div>
                <div className="flex gap-px bg-[hsl(var(--b1))] mb-5 flex-wrap">
                  {VAULT_FILTER_TABS.map(t => (
                    <button key={t} onClick={() => setVaultFilter(t)}
                      className={`font-label text-[0.58rem] tracking-[0.1em] uppercase py-2.5 px-4 cursor-pointer transition-all min-h-[40px] ${vaultFilter === t ? 'bg-gold text-void' : 'bg-s1 text-t3 hover:bg-s2'}`}>
                      {t === 'all' ? 'All' : t}
                    </button>
                  ))}
                </div>
                <div className="text-center py-12">
                  <div className="font-heading text-[1.1rem] italic text-t3 mb-4">Your document vault is empty.</div>
                  <p className="font-body text-[0.82rem] text-t3 leading-[1.8] max-w-[480px] mx-auto">
                    Documents are generated automatically as your portfolio grows. Confirmed commitments generate investment certificates. Completed staking positions generate yield statements.
                  </p>
                </div>
              </Card>
              <Card title="Generate Partner Certificate">
                <p className="font-body text-[0.85rem] text-t3 leading-[1.75] mb-5">Generate your official Adams Streett Partners membership certificate.</p>
                <button className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Generate Certificate</button>
              </Card>
            </>
          )}

          {/* NEW PAGES */}
          {page === 'membership' && <MembershipPage />}
          {page === 'academy' && <AcademyPage />}
          {page === 'affiliate' && <ASPNewsPage />}
          {page === 'sponsored' && <SponsoredListingPage />}
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardPage;
