import { useState, useEffect } from 'react';

const BottomBar = () => {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => Math.max(1240, Math.min(1265, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[38px] bg-[rgba(5,5,5,0.95)] border-t border-b1 flex items-center justify-center gap-2.5 z-[100]">
      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--green))] animate-livepulse" />
      <span className="font-mono text-[0.68rem] text-t3">
        <span className="text-asp-green">{count.toLocaleString()}</span> partners active right now
      </span>
    </div>
  );
};

export default BottomBar;
