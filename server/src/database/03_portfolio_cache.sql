CREATE TABLE public.portfolio_daily_values (
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  PRIMARY KEY (portfolio_id, date)
);

CREATE INDEX portfolio_daily_values_portfolio_id_idx ON public.portfolio_daily_values(portfolio_id);
CREATE INDEX portfolio_daily_values_date_idx ON public.portfolio_daily_values(date); 