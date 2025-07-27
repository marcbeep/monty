CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.portfolio_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  allocation_percentage DECIMAL(5,2) NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(portfolio_id, symbol)
);

CREATE TRIGGER on_portfolios_updated
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX portfolios_user_id_idx ON public.portfolios(user_id);
CREATE INDEX portfolio_holdings_portfolio_id_idx ON public.portfolio_holdings(portfolio_id); 