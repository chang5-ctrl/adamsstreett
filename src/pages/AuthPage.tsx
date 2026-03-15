import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [alert, setAlert] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    // Simulate login
    setTimeout(() => {
      setAlert({ msg: 'Access granted. Loading your dashboard...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1200);
    }, 800);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    setTimeout(() => {
      setAlert({ msg: 'Partnership request submitted. Redirecting to your dashboard...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 800);
  };

  const handleForgotPassword = () => {
    if (!loginEmail) { setAlert({ msg: 'Enter your email address first.', type: 'error' }); return; }
    setAlert({ msg: 'Password reset email sent. Check your inbox.', type: 'success' });
  };

  const inputClass = "bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full transition-colors focus:border-b-[hsl(var(--gold))] placeholder:text-t4";

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left panel */}
        <div className="hidden md:flex bg-base border-r border-b1 flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,168,76,0.04)_0%,transparent_70%)] pointer-events-none" />
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[1.1rem] font-normal text-gold tracking-[0.08em]">Adams Streett Partners</span>
            <span className="font-label text-[0.55rem] text-t3 tracking-[0.3em] uppercase">Private Investment · Est. 1972</span>
          </div>
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="font-label text-[0.65rem] text-gold tracking-[0.25em] uppercase mb-6">Partner Access Portal</div>
            <div className="font-heading text-[clamp(2.2rem,3.5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-t1">Where Elite</div>
            <div className="font-heading text-[clamp(2.2rem,3.5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-t1">Capital Meets</div>
            <div className="font-heading text-[clamp(2.2rem,3.5vw,3.5rem)] font-light italic leading-[1.1] tracking-[-0.02em] text-gold mb-8">Opportunity</div>
            <p className="font-body text-[0.9rem] text-t3 leading-[1.8] max-w-[380px] mb-12">Institutional-grade investment access for accredited investors, entertainers, athletes, and corporate brands. Minimum commitment $100,000.</p>
            <div className="flex flex-col border border-b1">
              {[
                { label: 'Active Partners', value: '1,247', cls: '' },
                { label: 'Capital Deployed', value: '$1.24B', cls: 'text-gold' },
                { label: 'Average Partner ROI', value: '27.3%', cls: 'text-asp-green' },
                { label: 'Investment Products', value: '21 Funds', cls: '' },
              ].map((s, i) => (
                <div key={i} className="py-4 px-5 border-b border-b1 last:border-b-0 flex justify-between items-center">
                  <span className="font-label text-[0.6rem] text-t3 tracking-[0.15em] uppercase">{s.label}</span>
                  <span className={`font-mono text-[0.9rem] tabular-nums ${s.cls || 'text-t1'}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="font-mono text-[0.65rem] text-t4">adamsstreettspartners@gmail.com</div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center items-center p-12 max-sm:p-8 max-sm:min-h-screen max-sm:overflow-y-auto bg-void">
          <div className="w-full max-w-[420px]">
            <div className="flex mb-10 border-b border-b1">
              <button onClick={() => { setTab('login'); setAlert(null); }} className={`font-label text-[0.75rem] tracking-[0.15em] uppercase py-3 px-6 cursor-pointer border-b-2 mb-[-1px] transition-all bg-transparent border-t-0 border-l-0 border-r-0 ${tab === 'login' ? 'text-gold border-b-[hsl(var(--gold))]' : 'text-t3 border-b-transparent hover:text-t2'}`}>Partner Login</button>
              <button onClick={() => { setTab('signup'); setAlert(null); }} className={`font-label text-[0.75rem] tracking-[0.15em] uppercase py-3 px-6 cursor-pointer border-b-2 mb-[-1px] transition-all bg-transparent border-t-0 border-l-0 border-r-0 ${tab === 'signup' ? 'text-gold border-b-[hsl(var(--gold))]' : 'text-t3 border-b-transparent hover:text-t2'}`}>Request Access</button>
            </div>

            {alert && (
              <div className={`py-3 px-4 border-l-2 text-[0.82rem] leading-[1.6] mb-4 ${alert.type === 'error' ? 'border-l-[hsl(var(--red))] text-[#fca5a5] bg-[rgba(239,68,68,0.05)]' : 'border-l-[hsl(var(--green))] text-[#86efac] bg-[rgba(34,197,94,0.05)]'}`}>
                {alert.msg}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Email Address</label>
                  <input type="email" className={inputClass} placeholder="partner@example.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Password</label>
                  <input type="password" className={inputClass} placeholder="••••••••••••" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className={`font-label text-[0.75rem] tracking-[0.2em] uppercase text-void bg-gold border-none py-4 cursor-pointer hover:bg-gold-bright transition-all w-full mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? 'Processing...' : 'Access Dashboard'}
                </button>
                <p className="font-body text-[0.78rem] text-t3 leading-[1.7] text-center">
                  New partner? <button type="button" onClick={() => setTab('signup')} className="text-gold bg-transparent border-none cursor-pointer p-0 font-body text-[0.78rem]">Request access →</button>
                </p>
                <p className="font-body text-[0.78rem] text-t3 leading-[1.7] text-center">
                  <button type="button" onClick={handleForgotPassword} className="text-gold bg-transparent border-none cursor-pointer p-0 font-body text-[0.78rem]">Forgot password?</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">First Name</label>
                    <input type="text" className={inputClass} placeholder="First" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Last Name</label>
                    <input type="text" className={inputClass} placeholder="Last" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Email Address</label>
                  <input type="email" className={inputClass} placeholder="partner@example.com" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Phone Number</label>
                  <input type="tel" className={inputClass} placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Country</label>
                  <input type="text" className={inputClass} placeholder="Nigeria, UAE, UK..." value={country} onChange={e => setCountry(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Password</label>
                  <input type="password" className={inputClass} placeholder="Min. 8 characters" required minLength={8} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[0.65rem] text-t3 tracking-[0.15em] uppercase">Referral Code (Optional)</label>
                  <input type="text" className={inputClass} placeholder="ASP-XXXXXXXX" value={referralCode} onChange={e => setReferralCode(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className={`font-label text-[0.75rem] tracking-[0.2em] uppercase text-void bg-gold border-none py-4 cursor-pointer hover:bg-gold-bright transition-all w-full mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? 'Processing...' : 'Request Partnership'}
                </button>
                <p className="font-body text-[0.72rem] text-t4 leading-[1.7] text-center mt-1">By creating an account you confirm you are an accredited investor and agree to our terms. Projected returns are illustrative. All investments involve risk.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
