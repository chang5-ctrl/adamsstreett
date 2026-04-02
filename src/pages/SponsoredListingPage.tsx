import { useState } from 'react';

const SponsoredListingPage = () => {
  const [form, setForm] = useState({ company: '', fundType: '', targetApy: '', aum: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.company || !form.email) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-[600px]">
      <div className="mb-8">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Featured Listings</div>
        <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">List Your Fund on ASP</h2>
        <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Fund managers and startups can apply to feature their investment products on the Adams Streett Partners platform.</p>
      </div>
      {submitted ? (
        <div className="bg-s1 border border-gold p-8 text-center">
          <div className="font-heading text-[1.2rem] text-gold mb-3">Application Submitted</div>
          <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Our team will review your application and respond within 3–5 business days.</p>
        </div>
      ) : (
        <div className="bg-s1 border border-b1 p-6">
          {[
            { key: 'company', label: 'Company Name', placeholder: 'Your Company' },
            { key: 'fundType', label: 'Fund Type', placeholder: 'e.g. Private Equity, Venture, Real Estate' },
            { key: 'targetApy', label: 'Target APY', placeholder: 'e.g. 15-30%' },
            { key: 'aum', label: 'AUM', placeholder: 'e.g. $50M' },
            { key: 'email', label: 'Contact Email', placeholder: 'contact@company.com' },
          ].map(f => (
            <div key={f.key} className="mb-5">
              <label className="font-label text-[0.62rem] text-t3 tracking-[0.15em] uppercase mb-2 block">{f.label}</label>
              <input type="text" value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="bg-transparent border-none border-b border-b-[hsl(var(--b2))] py-3 font-body text-[0.9rem] text-t1 outline-none w-full focus:border-b-[hsl(var(--gold))] min-h-[44px]" />
            </div>
          ))}
          <button onClick={handleSubmit} className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-void bg-gold border-none py-3.5 px-8 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Submit Application</button>
        </div>
      )}
    </div>
  );
};

export default SponsoredListingPage;
