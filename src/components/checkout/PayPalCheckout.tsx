import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PayPalCheckoutProps {
  fundName: string;
  amount: number;
  horizonMonths: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
  onError: (err: string) => void;
  /** Called before modal opens; return false to abort */
  validate?: () => boolean;
}

type Stage = 'idle' | 'open' | 'processing' | 'success' | 'error';

export default function PayPalCheckout({
  fundName,
  amount,
  horizonMonths,
  onSuccess,
  onCancel,
  onError,
  validate,
}: PayPalCheckoutProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const stageRef = useRef<Stage>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dots, setDots] = useState('');

  // Keep ref in sync with state
  const updateStage = (next: Stage) => {
    stageRef.current = next;
    setStage(next);
  };

  useEffect(() => {
    if (stage !== 'processing') return;
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 400);
    return () => clearInterval(iv);
  }, [stage]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (validate && !validate()) return;
    updateStage('open');
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email || !password) {
      setErrorMsg('Please enter your PayPal email and password.');
      return;
    }
    setErrorMsg('');
    updateStage('processing');

    // Simulate PayPal auth → order creation → capture (mock 2.8s)
    setTimeout(() => {
      if (stageRef.current !== 'processing') return;
      const mockOrderId =
        'MOCK-' + Math.random().toString(36).substr(2, 10).toUpperCase();
      updateStage('success');
      setTimeout(() => {
        updateStage('idle');
        onSuccess(mockOrderId);
      }, 1800);
    }, 2800);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStage('idle');
    onCancel();
  };

  const horizonLabel: Record<string, string> = {
    '3': '3 Months', '6': '6 Months', '12': '12 Months',
    '24': '24 Months', '36': '36 Months', '60': '60 Months',
  };

  // Render the modal via a portal to document.body so it escapes any
  // parent overflow-hidden / re-mount issues in the dashboard layout.
  const modal = stage !== 'idle' ? createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-[420px] mx-4 overflow-hidden"
        style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PayPal header */}
        <div
          className="flex items-center justify-center py-5 px-6"
          style={{ background: '#003087' }}
        >
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '1.6rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: '#fff' }}>Pay</span>
            <span style={{ color: '#009cde' }}>Pal</span>
          </span>
        </div>

        {/* Content */}
        <div className="p-7">
          {/* Order Summary */}
          {stage !== 'success' && (
            <div
              className="mb-5 p-4 rounded"
              style={{ background: '#f5f7fa', border: '1px solid #e8ecef' }}
            >
              <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                ORDER SUMMARY
              </div>
              <div style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600, marginBottom: '2px' }}>
                {fundName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '10px' }}>
                Investment Horizon: {horizonLabel[String(horizonMonths)] ?? `${horizonMonths} Months`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #e8ecef', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Total Payment</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#003087' }}>
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {stage === 'open' && (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111', marginBottom: '16px' }}>
                Log in to PayPal
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Email or mobile number
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or mobile number"
                  autoFocus
                  style={{
                    width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: '4px',
                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#111',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009cde')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e as any)}
                  style={{
                    width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: '4px',
                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#111',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009cde')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              {errorMsg && (
                <div style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '12px' }}>
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={handleLogin}
                style={{
                  width: '100%', background: '#0070ba', color: '#fff', border: 'none', borderRadius: '4px',
                  padding: '14px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px',
                }}
                onMouseOver={(e) => ((e.target as HTMLElement).style.background = '#005ea6')}
                onMouseOut={(e) => ((e.target as HTMLElement).style.background = '#0070ba')}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  width: '100%', background: 'transparent', color: '#0070ba', border: '1.5px solid #0070ba',
                  borderRadius: '4px', padding: '12px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                🔒 Your payment information is encrypted and secure
              </div>
            </>
          )}

          {stage === 'processing' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', border: '3px solid #e5e7eb',
                    borderTopColor: '#0070ba', borderRadius: '50%', margin: '0 auto 16px',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111', marginBottom: '6px' }}>
                  Processing Payment{dots}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Verifying your PayPal account and capturing funds
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                Please do not close this window
              </div>
            </div>
          )}

          {stage === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '60px', height: '60px', background: '#d1fae5', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M6 15l7 7 11-12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
                Payment Confirmed!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                Your investment is being activated…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* PayPal Button */}
      <button
        type="button"
        id="paypal-checkout-btn"
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-sm font-bold text-[0.92rem] transition-all cursor-pointer min-h-[52px] hover:opacity-90 active:scale-[0.98]"
        style={{ background: '#FFC439', color: '#003087', border: 'none', borderRadius: '4px' }}
      >
        <span style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.01em' }}>
          <span style={{ color: '#003087' }}>Pay</span>
          <span style={{ color: '#009cde' }}>Pal</span>
        </span>
        <span style={{ color: '#003087', fontWeight: 700, fontSize: '0.9rem' }}>
          — Pay ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
        </span>
      </button>

      <p className="font-body text-[0.68rem] text-t4 text-center mt-2">
        Secured by PayPal · 256-bit SSL encryption
      </p>

      {modal}
    </>
  );
}
