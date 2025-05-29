
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  billing_day INTEGER NOT NULL DEFAULT 1, -- Day of month (1-28)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  player_count INTEGER NOT NULL DEFAULT 30,
  base_charge DECIMAL(10,2) NOT NULL,
  player_charge DECIMAL(10,2) NOT NULL,
  total_monthly DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  billing_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add-ons table
CREATE TABLE public.subscription_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  addon_type TEXT NOT NULL, -- 'website', 'ranks', 'antiCheat', etc.
  title TEXT NOT NULL,
  setup_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  setup_refund_days INTEGER NOT NULL DEFAULT 2,
  monthly_refund_days INTEGER NOT NULL DEFAULT 7,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  setup_charged_at TIMESTAMPTZ,
  last_monthly_charge TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Billing history table
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  description TEXT,
  charge_type TEXT NOT NULL, -- 'subscription', 'addon_setup', 'addon_monthly'
  charged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  refunded_at TIMESTAMPTZ,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refund requests table
CREATE TABLE public.refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  billing_history_id UUID NOT NULL REFERENCES billing_history(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'denied', 'processed'
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  stripe_refund_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (true);

-- RLS Policies for subscription_addons
CREATE POLICY "Users can view own addons" ON public.subscription_addons
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_id
    )
  );
CREATE POLICY "Service role can manage addons" ON public.subscription_addons
  FOR ALL USING (true);

-- RLS Policies for billing_history
CREATE POLICY "Users can view own billing history" ON public.billing_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage billing history" ON public.billing_history
  FOR ALL USING (true);

-- RLS Policies for refund_requests
CREATE POLICY "Users can view own refund requests" ON public.refund_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create refund requests" ON public.refund_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage refund requests" ON public.refund_requests
  FOR ALL USING (true);
