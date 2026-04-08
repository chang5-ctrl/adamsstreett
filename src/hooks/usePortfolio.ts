/**
 * usePortfolio — mock portfolio state management
 * In production: replace with Supabase real-time subscriptions
 */
import { useState, useCallback } from 'react';

export interface Investment {
  id: string;
  fundName: string;
  fundValue: string;
  amount: number;
  horizonMonths: number;
  paymentMethod: 'paypal' | 'btc' | 'eth' | 'usdc' | 'usdt';
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  reference: string;
  createdAt: Date;
  confirmedAt?: Date;
  projectedValue: number;
}

export interface Transaction {
  id: string;
  investmentId: string;
  type: 'deposit' | 'credit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  reference: string;
  provider: string;
  createdAt: Date;
}

export interface PortfolioBalance {
  totalCommitted: number;
  totalValue: number;
  yieldEarned: number;
  activePositions: number;
}

const generateRef = (prefix: string) =>
  `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

export function usePortfolio() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<PortfolioBalance>({
    totalCommitted: 0,
    totalValue: 0,
    yieldEarned: 0,
    activePositions: 0,
  });

  const addInvestment = useCallback(
    (params: {
      fundName: string;
      amount: number;
      horizonMonths: number;
      paymentMethod: Investment['paymentMethod'];
      projectedValue: number;
    }): Investment => {
      const ref = generateRef('ASP');
      const inv: Investment = {
        id: `inv-${Date.now()}`,
        fundName: params.fundName,
        fundValue: params.fundName,
        amount: params.amount,
        horizonMonths: params.horizonMonths,
        paymentMethod: params.paymentMethod,
        status: 'pending',
        reference: ref,
        createdAt: new Date(),
        projectedValue: params.projectedValue,
      };
      setInvestments((prev) => [inv, ...prev]);

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        investmentId: inv.id,
        type: 'deposit',
        amount: params.amount,
        currency: params.paymentMethod === 'paypal' ? 'USD' : params.paymentMethod.toUpperCase(),
        status: 'pending',
        reference: ref,
        provider: params.paymentMethod === 'paypal' ? 'paypal' : 'on-chain',
        createdAt: new Date(),
      };
      setTransactions((prev) => [tx, ...prev]);

      return inv;
    },
    []
  );

  const confirmInvestment = useCallback(
    (investmentId: string) => {
      setInvestments((prev) =>
        prev.map((inv) =>
          inv.id === investmentId
            ? { ...inv, status: 'active', confirmedAt: new Date() }
            : inv
        )
      );
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.investmentId === investmentId ? { ...tx, status: 'confirmed' } : tx
        )
      );

      // Update portfolio balance
      setInvestments((current) => {
        const activeInvs = current.filter(
          (i) => i.id === investmentId || i.status === 'active'
        );
        const confirmed = current.find((i) => i.id === investmentId);
        if (!confirmed) return current;

        setBalance((prev) => ({
          totalCommitted: prev.totalCommitted + confirmed.amount,
          totalValue: prev.totalValue + confirmed.amount,
          yieldEarned: prev.yieldEarned,
          activePositions: prev.activePositions + 1,
        }));

        return current;
      });
    },
    []
  );

  return {
    balance,
    investments,
    transactions,
    addInvestment,
    confirmInvestment,
  };
}
