-- Adams Streett Partners — Investment Schema
-- to be run on supabse

-- Funds reference table (mirrors @/data/funds.ts)
CREATE TABLE IF NOT EXISTS public.funds (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  select_value text UNIQUE NOT NULL,
  apy         text,
  risk        text,
  cat         text,
  created_at  timestamptz DEFAULT now()
);

-- Client investment positions
CREATE TABLE IF NOT EXISTS public.investments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  fund_id           uuid REFERENCES public.funds(id),
  fund_name         text NOT NULL,
  amount            numeric(12, 2) NOT NULL CHECK (amount >= 500),
  horizon_months    int NOT NULL,
  projected_value   numeric(12, 2),
  status            text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','active','completed','cancelled')),
  payment_method    text NOT NULL
                      CHECK (payment_method IN ('paypal','btc','eth','usdc','usdt')),
  payment_reference text UNIQUE,        -- PayPal order ID or crypto tx hash
  created_at        timestamptz DEFAULT now(),
  confirmed_at      timestamptz
);

-- Full transaction ledger
CREATE TABLE IF NOT EXISTS public.transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id    uuid REFERENCES public.investments(id),
  type             text NOT NULL CHECK (type IN ('deposit','credit','withdrawal')),
  amount           numeric(12, 2) NOT NULL,
  currency         text NOT NULL,
  status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','failed')),
  reference        text UNIQUE,
  provider         text,               -- 'paypal' | 'on-chain'
  webhook_payload  jsonb,
  created_at       timestamptz DEFAULT now()
);

-- Aggregated portfolio balance per user (updated by webhooks)
CREATE TABLE IF NOT EXISTS public.portfolio_balances (
  user_id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_committed   numeric(14, 2) DEFAULT 0,
  total_value       numeric(14, 2) DEFAULT 0,
  yield_earned      numeric(14, 2) DEFAULT 0,
  active_positions  int DEFAULT 0,
  updated_at        timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.investments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_balances ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "users_own_investments"
  ON public.investments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_transactions"
  ON public.transactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_balance"
  ON public.portfolio_balances FOR ALL USING (auth.uid() = user_id);
