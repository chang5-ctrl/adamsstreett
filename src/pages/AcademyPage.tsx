import { useState } from 'react';
import { ACADEMY_COURSES, WALLETS } from '@/data/funds';

const PAYMENT_OPTIONS = [
  { id: 'btc', symbol: '₿', name: 'Bitcoin', label: 'BTC', network: 'Bitcoin Network', wallet: WALLETS.btc },
  { id: 'eth', symbol: 'Ξ', name: 'Ethereum', label: 'ETH', network: 'Ethereum Network', wallet: WALLETS.eth },
  { id: 'usdc', symbol: '◎', name: 'USDC', label: 'ERC-20', network: 'ERC-20 on Ethereum', wallet: WALLETS.usdc },
  { id: 'usdt', symbol: 'T', name: 'USDT', label: 'TRC-20', network: 'Tron (TRC-20) Network', wallet: WALLETS.usdt },
];

const AcademyPage = () => {
  const [enrollModal, setEnrollModal] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('btc');
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [copied, setCopied] = useState(false);
  const course = ACADEMY_COURSES.find(c => c.id === enrollModal);
  const payment = PAYMENT_OPTIONS.find(p => p.id === selectedPayment)!;

  const handleEnroll = () => {
    const ref = 'ASP-EDU-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    setRefId(ref);
    setSubmitted(true);
  };

  const resetModal = () => {
    setEnrollModal(null);
    setSubmitted(false);
    setSelectedPayment('btc');
    setCopied(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(payment.wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock crypto price for display
  const cryptoAmount = (price: number) => {
    const rates: Record<string, number> = { btc: 67000, eth: 3500, usdc: 1, usdt: 1 };
    const rate = rates[selectedPayment] || 1;
    return (price / rate).toFixed(selectedPayment === 'btc' ? 5 : selectedPayment === 'eth' ? 4 : 2);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Education</div>
        <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">ASP Academy</h2>
        <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Institutional-grade investment education from fund managers and industry experts.</p>
      </div>
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        {ACADEMY_COURSES.map(c => (
          <div key={c.id} className="bg-s1 border border-b1 p-6 flex flex-col">
            <div className="font-heading text-[1rem] text-t1 mb-2">{c.title}</div>
            <p className="font-body text-[0.82rem] text-t3 leading-[1.7] mb-4 flex-1">{c.desc}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[1.2rem] text-gold">${c.price}</span>
              <span className="font-mono text-[0.68rem] text-t4">{c.duration}</span>
            </div>
            <button onClick={() => { setEnrollModal(c.id); setSubmitted(false); }} className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-void bg-gold border-none py-3 cursor-pointer hover:bg-gold-bright transition-all min-h-[44px]">Enroll Now →</button>
          </div>
        ))}
      </div>

      {enrollModal && course && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={resetModal} />
          <div className="relative bg-void border border-b2 w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center py-4 px-6 border-b border-b1">
              <span className="font-label text-[0.72rem] text-gold tracking-[0.2em] uppercase">Enroll</span>
              <button onClick={resetModal} className="font-mono text-t3 text-lg bg-transparent border-none cursor-pointer hover:text-t1">✕</button>
            </div>
            <div className="p-6">
              {!submitted ? (
                <>
                  <div className="font-heading text-[1.1rem] text-t1 mb-1">{course.title}</div>
                  <div className="font-mono text-[1.6rem] text-gold mb-5">${course.price}</div>

                  <div className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-3">Select Payment Method</div>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {PAYMENT_OPTIONS.map(p => (
                      <div key={p.id} onClick={() => setSelectedPayment(p.id)}
                        className={`bg-s1 border p-4 cursor-pointer transition-all text-center ${selectedPayment === p.id ? 'border-gold bg-gold-glow shadow-[0_0_16px_hsl(var(--gold)/0.12)]' : 'border-b1 hover:border-b2'}`}>
                        <div className="font-heading text-[1.4rem] text-gold mb-1">{p.symbol}</div>
                        <div className="font-heading text-[0.85rem] text-t1">{p.name}</div>
                        <div className="font-mono text-[0.55rem] text-t4 mt-0.5">{p.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-s2 border border-b1 p-4 mb-4">
                    <div className="font-label text-[0.55rem] text-t3 tracking-[0.1em] uppercase mb-1">Send Exactly</div>
                    <div className="font-mono text-[1.1rem] text-gold mb-1">{cryptoAmount(course.price)} {payment.label}</div>
                    <div className="font-body text-[0.75rem] text-t3">(${course.price}.00)</div>
                  </div>

                  <div className="bg-s2 border border-b1 p-4 mb-4">
                    <div className="font-label text-[0.55rem] text-t3 tracking-[0.1em] uppercase mb-1">{payment.network} Wallet</div>
                    <div className="font-mono text-[0.68rem] text-t1 break-all mb-2">{payment.wallet}</div>
                    <button onClick={copyAddress} className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[32px]">
                      {copied ? '✓ Copied' : 'Copy Address'}
                    </button>
                    {selectedPayment === 'usdt' && (
                      <div className="font-body text-[0.7rem] text-asp-amber mt-2">Send USDT on Tron (TRC-20) network only. Do not send on Ethereum network.</div>
                    )}
                  </div>

                  <button onClick={handleEnroll} className="w-full font-label text-[0.62rem] tracking-[0.12em] uppercase text-void bg-gold border-none py-3.5 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Confirm Enrollment — ${course.price}</button>
                </>
              ) : (
                <div>
                  <div className="py-4 px-5 border-l-2 border-l-gold bg-[rgba(201,168,76,0.05)] mb-4">
                    <div className="font-body text-[0.85rem] text-gold leading-[1.7]">
                      Enrollment recorded. Reference: {refId}. Send your payment to the address above. Access is granted automatically once payment is detected on-chain.
                    </div>
                    <div className="font-mono text-[0.65rem] text-t4 mt-2">Awaiting payment — not yet confirmed</div>
                  </div>
                  <div className="bg-s2 border border-b1 p-4 mb-4">
                    <div className="font-label text-[0.55rem] text-t3 tracking-[0.1em] uppercase mb-1">Reference</div>
                    <div className="font-mono text-[0.9rem] text-gold">{refId}</div>
                    <div className="font-body text-[0.7rem] text-t4 mt-1">Include this reference in your transaction memo</div>
                  </div>
                  <button onClick={resetModal} className="w-full font-label text-[0.62rem] tracking-[0.12em] uppercase text-t3 bg-transparent border border-b2 py-3 cursor-pointer hover:border-gold hover:text-gold transition-all min-h-[44px]">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyPage;
