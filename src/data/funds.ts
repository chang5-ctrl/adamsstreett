export interface Fund {
  name: string;
  badge: string;
  risk: 'low' | 'mod' | 'high' | 'top';
  riskLabel: string;
  apy: string;
  cat: 'income' | 'growth' | 'frontier' | 'ethical';
  returns1y: string;
  returns3y: string;
  horizon: string;
  footer: string;
  selectLabel: string;
  selectValue: string;
}

export const FUNDS: Fund[] = [
  { name: 'Adams Streett General Fund', badge: 'Flagship', risk: 'mod', riskLabel: 'Moderate', apy: '12–28%', cat: 'income', returns1y: '$560–$640', returns3y: '$740–$985', horizon: '6+ months', footer: 'Diversified · Multi-Strategy · Daily Compounding', selectLabel: 'Adams Streett General Fund — 12–28% APY', selectValue: 'General Fund|12-28|conservative' },
  { name: 'Private Equity Pool', badge: 'Direct Stakes', risk: 'high', riskLabel: 'High', apy: '18–40%', cat: 'growth', returns1y: '$590–$700', returns3y: '$825–$1,372', horizon: '12+ months', footer: 'Private Companies · Deal Flow · Board Access', selectLabel: 'Private Equity Pool — 18–40% APY', selectValue: 'Private Equity Pool|18-40|growth' },
  { name: 'Venture Co-Investment', badge: 'Early Stage', risk: 'top', riskLabel: 'Highest', apy: '22–55%', cat: 'frontier', returns1y: '$610–$775', returns3y: '$910–$1,865', horizon: '24+ months', footer: 'Pre-Seed · Seed · Series A Co-investment', selectLabel: 'Venture Co-Investment — 22–55% APY', selectValue: 'Venture Co-Investment|22-55|aggressive' },
  { name: 'DeFi Yield Strategy', badge: 'On-Chain', risk: 'mod', riskLabel: 'Moderate', apy: '8–22%', cat: 'income', returns1y: '$540–$610', returns3y: '$630–$915', horizon: '3+ months', footer: 'Lending · Yield Farming · Stablecoin Strategies', selectLabel: 'DeFi Yield Strategy — 8–22% APY', selectValue: 'DeFi Yield Strategy|8-22|balanced' },
  { name: 'Fixed Income Bond', badge: 'Low Volatility', risk: 'low', riskLabel: 'Low', apy: '9–14%', cat: 'income', returns1y: '$545–$570', returns3y: '$648–$740', horizon: '6+ months', footer: 'Bonds · Treasury · Fixed Coupon Instruments', selectLabel: 'Fixed Income Bond — 9–14% APY', selectValue: 'Fixed Income Bond|9-14|conservative' },
  { name: 'Real Estate Fund', badge: 'Tangible', risk: 'mod', riskLabel: 'Moderate', apy: '14–32%', cat: 'income', returns1y: '$570–$660', returns3y: '$740–$1,149', horizon: '12+ months', footer: 'Commercial · Residential · REITs · Tokenized', selectLabel: 'Real Estate Fund — 14–32% APY', selectValue: 'Real Estate Fund|14-32|balanced' },
  { name: 'Forex Alpha', badge: 'Currency', risk: 'high', riskLabel: 'High', apy: '18–45%', cat: 'growth', returns1y: '$590–$725', returns3y: '$825–$1,524', horizon: '6+ months', footer: 'G10 Pairs · EM Carry · Algo Execution', selectLabel: 'Forex Alpha — 18–45% APY', selectValue: 'Forex Alpha|18-45|growth' },
  { name: 'Music & Royalties Fund', badge: 'Royalties', risk: 'mod', riskLabel: 'Moderate', apy: '12–30%', cat: 'income', returns1y: '$560–$650', returns3y: '$700–$1,098', horizon: '12+ months', footer: 'Music Catalogue · Publishing Rights · Streaming', selectLabel: 'Music & Royalties Fund — 12–30% APY', selectValue: 'Royalties Fund|12-30|balanced' },
  { name: 'Sports Capital Fund', badge: 'Sports', risk: 'high', riskLabel: 'High', apy: '16–42%', cat: 'growth', returns1y: '$580–$710', returns3y: '$785–$1,432', horizon: '18+ months', footer: 'Athlete Ventures · Team Equity · Sports Tech', selectLabel: 'Sports Capital Fund — 16–42% APY', selectValue: 'Sports Capital|16-42|growth' },
  { name: 'Halal Investment Fund', badge: 'Sharia', risk: 'mod', riskLabel: 'Moderate', apy: '12–30%', cat: 'ethical', returns1y: '$560–$650', returns3y: '$700–$1,098', horizon: '12+ months', footer: 'Sharia-Compliant · No Interest · Ethical Screening', selectLabel: 'Halal Investment Fund — 12–30% APY', selectValue: 'Halal Fund|12-30|conservative' },
  { name: 'ESG Impact Fund', badge: 'Sustainable', risk: 'mod', riskLabel: 'Moderate', apy: '12–30%', cat: 'ethical', returns1y: '$560–$650', returns3y: '$700–$1,098', horizon: '12+ months', footer: 'Clean Energy · Social Impact · Governance', selectLabel: 'ESG Impact Fund — 12–30% APY', selectValue: 'ESG Impact Fund|12-30|balanced' },
  { name: 'African Unicorn Fund', badge: "Africa's Future", risk: 'top', riskLabel: 'Highest', apy: '22–80%', cat: 'frontier', returns1y: '$610–$900', returns3y: '$1,395–$9,435', horizon: '36+ months', footer: 'Pre-Unicorn · African Fintech · AgriTech', selectLabel: 'African Unicorn Fund — 22–80% APY', selectValue: 'African Unicorn Fund|22-80|aggressive' },
  { name: 'Adams Streett Frontier Fund', badge: 'Next Frontier', risk: 'top', riskLabel: 'Highest', apy: '20–100%+', cat: 'frontier', returns1y: '$600–$1,000', returns3y: '$1,245–$16,000', horizon: '60+ months', footer: 'Space · Quantum Computing · Biotech · Deep Tech', selectLabel: 'Frontier Fund — 20–100%+ APY', selectValue: 'Adams Streett Frontier Fund|20-100|aggressive' },
  { name: 'Longevity Fund', badge: 'Future of Life', risk: 'top', riskLabel: 'Highest', apy: '22–90%', cat: 'frontier', returns1y: '$610–$950', returns3y: '$1,395–$7,380', horizon: '60+ months', footer: 'Gene Therapy · Anti-Aging · Longevity Science', selectLabel: 'Longevity Fund — 22–90% APY', selectValue: 'Longevity Fund|22-90|aggressive' },
  { name: 'Web3 Infrastructure Fund', badge: 'Digital Layer', risk: 'top', riskLabel: 'Highest', apy: '20–60%', cat: 'frontier', returns1y: '$600–$800', returns3y: '$865–$2,048', horizon: '24+ months', footer: 'Layer 1/2 Infrastructure · Node Operators · DePIN', selectLabel: 'Web3 Infrastructure Fund — 20–60% APY', selectValue: 'Web3 Infrastructure Fund|20-60|growth' },
  { name: 'Carbon Credit Fund', badge: 'Green Finance', risk: 'mod', riskLabel: 'Moderate', apy: '14–38%', cat: 'ethical', returns1y: '$570–$690', returns3y: '$740–$1,315', horizon: '12+ months', footer: 'Voluntary Carbon Market · Reforestation Credits', selectLabel: 'Carbon Credit Fund — 14–38% APY', selectValue: 'Carbon Credit Fund|14-38|balanced' },
  { name: 'Emerging Markets Fund', badge: 'EM Alpha', risk: 'high', riskLabel: 'High', apy: '18–50%', cat: 'growth', returns1y: '$590–$750', returns3y: '$825–$1,688', horizon: '18+ months', footer: 'GCC · Southeast Asia · West Africa · LatAm', selectLabel: 'Emerging Markets Fund — 18–50% APY', selectValue: 'Emerging Markets Fund|18-50|growth' },
  { name: 'Commodity Pool', badge: 'Hard Assets', risk: 'high', riskLabel: 'High', apy: '16–38%', cat: 'income', returns1y: '$580–$690', returns3y: '$785–$1,315', horizon: '6+ months', footer: 'Gold · Oil · Agricultural Commodities', selectLabel: 'Commodity Pool — 16–38% APY', selectValue: 'Commodity Pool|16-38|growth' },
  { name: 'IPO Access Fund', badge: 'Pre-IPO', risk: 'top', riskLabel: 'Highest', apy: '25–70%', cat: 'growth', returns1y: '$625–$850', returns3y: '$977–$2,465', horizon: '12–36 months', footer: 'Pre-IPO · SPAC · Direct Listing Access', selectLabel: 'IPO Access Fund — 25–70% APY', selectValue: 'IPO Access Fund|25-70|aggressive' },
  { name: 'Luxury Assets Fund', badge: 'Tangible', risk: 'mod', riskLabel: 'Moderate', apy: '10–28%', cat: 'growth', returns1y: '$550–$640', returns3y: '$666–$985', horizon: '24+ months', footer: 'Fine Art · Watches · Rare Wine · Classic Cars', selectLabel: 'Luxury Assets Fund — 10–28% APY', selectValue: 'Luxury Assets Fund|10-28|conservative' },
  { name: 'Alpha Fund', badge: 'Hedge Strategy', risk: 'top', riskLabel: 'Highest', apy: '20–50%', cat: 'growth', returns1y: '$600–$750', returns3y: '$865–$1,688', horizon: '12+ months', footer: 'Long/Short · Market Neutral · Options Overlay', selectLabel: 'Alpha Fund (Hedge) — 20–50% APY', selectValue: 'Alpha Fund|20-50|aggressive' },
];

export const TICKER_ITEMS = [
  { name: 'K. AL-RASHIDI', fund: 'Frontier Fund', amount: '$7,500' },
  { name: 'T. OKONKWO', fund: 'Royalties Fund', amount: '$3,000' },
  { name: 'M. BLACKWOOD', fund: 'Luxury Assets', amount: '$10,000' },
  { name: 'S. AL-ZAHRANI', fund: 'Forex Alpha', amount: '$5,000' },
  { name: 'D. ASANTE', fund: 'African Unicorn', amount: '$10,000' },
  { name: 'R. MENSAH', fund: 'Sports Capital', amount: '$5,000' },
  { name: 'A. AL-SAUD', fund: 'Halal Fund', amount: '$3,000' },
  { name: 'B. SCHMIDT', fund: 'Private Equity', amount: '$10,000' },
  { name: 'C. NWOSU', fund: 'Web3 Infrastructure', amount: '$5,000' },
  { name: 'F. DIMITRIOU', fund: 'Longevity Fund', amount: '$7,500' },
];

export const WALLETS = {
  btc: 'bc1qg4pc08qyz0ghvkasqx9d59vv9hn8v8twkzndpw',
  eth: '0xF9Aa56c697AEd09cEb2326edAcD2Cab71a935Ce4',
  usdc: '0xF9Aa56c697AEd09cEb2326edAcD2Cab71a935Ce4',
  usdt: 'TLBypvwTgU5Wp7wvoEqBZvwtZRr1iKdeT4',
};

export const RETURN_MULTIPLIERS: Record<string, { cons: number; agg: number }> = {
  '3': { cons: 1.9 * 0.85, agg: 1.9 },
  '6': { cons: 2.8 * 0.85, agg: 2.8 },
  '12': { cons: 4.2 * 0.85, agg: 4.2 },
  '24': { cons: 6.5 * 0.85, agg: 6.5 },
  '36': { cons: 9.8 * 0.85, agg: 9.8 },
  '60': { cons: 18 * 0.85, agg: 18 },
};

export const SPONSORED_FUNDS = ['Adams Streett General Fund', 'African Unicorn Fund', 'Alpha Fund'];

export const ACADEMY_COURSES = [
  { id: 'pe-intro', title: 'Introduction to Private Equity', price: 49, duration: '4 hours', desc: 'Learn the fundamentals of private equity investing, deal structures, and due diligence.' },
  { id: 'crypto-fund', title: 'Crypto Investment Fundamentals', price: 49, duration: '3.5 hours', desc: 'Understand blockchain, DeFi, tokenomics, and crypto portfolio strategies.' },
  { id: 'wealth', title: 'Wealth Building Strategies', price: 99, duration: '6 hours', desc: 'Master asset allocation, compounding, tax efficiency, and long-term wealth creation.' },
  { id: 'alt-assets', title: 'Understanding Alternative Assets', price: 79, duration: '5 hours', desc: 'Explore real estate, commodities, art, and other non-traditional investments.' },
  { id: 'master', title: 'ASP Master Class — Full Portfolio Strategy', price: 199, duration: '10 hours', desc: 'Comprehensive portfolio construction from a team of institutional fund managers.' },
];

export const AFFILIATE_PARTNERS = [
  { name: 'Trading Platform A', commission: '40%', desc: 'Leading crypto trading platform with advanced tools and 500+ pairs.' },
  { name: 'Exchange B', commission: '35%', desc: 'Global digital asset exchange with deep liquidity and institutional grade security.' },
  { name: 'Tools Platform C', commission: '25%', desc: 'Professional portfolio analytics, tax reporting, and research tools.' },
];
