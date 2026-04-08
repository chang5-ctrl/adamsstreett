interface CryptoCheckoutProps {
  selectedCurrency: 'btc' | 'eth' | 'usdc' | 'usdt';
  walletAddress: string;
  amount: number;
  reference: string;
  onCopy?: () => void;
}

const NETWORK_INFO: Record<string, { label: string; warning?: string; color: string }> = {
  btc: { label: 'Bitcoin Network (BTC)', color: '#f7931a' },
  eth: { label: 'Ethereum Network (ERC-20)', color: '#627eea' },
  usdc: { label: 'USDC · ERC-20 on Ethereum', color: '#2775ca' },
  usdt: {
    label: 'USDT · TRC-20 on Tron',
    warning: '⚠ Send USDT on Tron (TRC-20) network ONLY. Do not send on Ethereum. Funds sent on wrong network cannot be recovered.',
    color: '#26a17b',
  },
};

const CURRENCY_ICONS: Record<string, string> = {
  btc: '₿', eth: 'Ξ', usdc: '◎', usdt: 'T',
};

export default function CryptoCheckout({
  selectedCurrency,
  walletAddress,
  amount,
  reference,
  onCopy,
}: CryptoCheckoutProps) {
  const net = NETWORK_INFO[selectedCurrency];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(walletAddress)}&bgcolor=0a0a0a&color=c9a84c&qzone=2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    onCopy?.();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(reference);
  };

  return (
    <div className="bg-s2 border border-b2 p-5 mt-5 space-y-5">
      {/* Network badge */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[1.1rem]" style={{ color: net.color }}>
          {CURRENCY_ICONS[selectedCurrency]}
        </span>
        <span className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-t2">
          {net.label}
        </span>
      </div>

      {/* Network warning */}
      {net.warning && (
        <div className="py-3 px-4 border-l-2 border-l-[hsl(var(--amber))] bg-[rgba(217,119,6,0.07)] font-body text-[0.78rem] text-asp-amber leading-[1.6]">
          {net.warning}
        </div>
      )}

      <div className="grid grid-cols-[160px_1fr] max-sm:grid-cols-1 gap-5 items-start">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={qrUrl}
            alt="Wallet QR Code"
            width={160}
            height={160}
            className="border border-b1"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="font-label text-[0.52rem] text-t4 tracking-[0.1em] uppercase">
            Scan to pay
          </span>
        </div>

        {/* Wallet Address & Details */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-label text-[0.58rem] text-t3 tracking-[0.15em] uppercase mb-1.5">
              Send to address
            </div>
            <div className="font-mono text-[0.72rem] text-t1 break-all leading-[1.7] bg-s3 px-4 py-3 border border-b1 select-all">
              {walletAddress}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCopy}
                className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-gold bg-transparent border border-gold py-1.5 px-4 cursor-pointer hover:bg-gold hover:text-void transition-all min-h-[32px]"
              >
                Copy Address
              </button>
            </div>
          </div>

          <div>
            <div className="font-label text-[0.58rem] text-t3 tracking-[0.15em] uppercase mb-1.5">
              Exact amount to send
            </div>
            <div className="font-mono text-[1.15rem] text-gold tabular-nums">
              ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </div>
            <div className="font-body text-[0.7rem] text-t4 mt-0.5">
              Send the exact amount shown. Any difference may delay activation.
            </div>
          </div>

          {reference && (
            <div>
              <div className="font-label text-[0.58rem] text-t3 tracking-[0.15em] uppercase mb-1.5">
                Transaction memo / reference
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-[0.78rem] text-t2 bg-s3 px-3 py-2 border border-b1 flex-1">
                  {reference}
                </div>
                <button
                  onClick={handleCopyRef}
                  className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-t3 bg-transparent border border-b2 py-2 px-3 cursor-pointer hover:border-gold hover:text-gold transition-all whitespace-nowrap min-h-[32px]"
                >
                  Copy
                </button>
              </div>
              <div className="font-body text-[0.7rem] text-t4 mt-1 leading-[1.6]">
                Include this reference in your transaction memo so our system can match your payment automatically.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="border-t border-b1 pt-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-[hsl(var(--amber))] inline-block animate-pulse" />
        <span className="font-mono text-[0.65rem] text-t3">
          Awaiting on-chain detection · Your portfolio activates automatically once payment is confirmed
        </span>
      </div>
    </div>
  );
}
