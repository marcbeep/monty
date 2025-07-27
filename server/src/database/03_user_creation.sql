CREATE OR REPLACE FUNCTION create_starter_portfolios(user_id UUID) RETURNS VOID AS $$
DECLARE
  conservative_id UUID;
  moderate_id UUID;
  aggressive_id UUID;
BEGIN
  INSERT INTO public.portfolios (user_id, name, description)
  VALUES (user_id, 'Conservative Portfolio', 'Capital preservation with steady income')
  RETURNING id INTO conservative_id;
  
  INSERT INTO public.portfolio_holdings (portfolio_id, symbol, allocation_percentage) VALUES
    (conservative_id, 'BND', 60.00),
    (conservative_id, 'SCHD', 20.00),
    (conservative_id, 'VT', 10.00),
    (conservative_id, 'VGSH', 10.00);
  
  INSERT INTO public.portfolios (user_id, name, description)
  VALUES (user_id, 'Moderate Portfolio', 'Balanced growth and income approach')
  RETURNING id INTO moderate_id;
  
  INSERT INTO public.portfolio_holdings (portfolio_id, symbol, allocation_percentage) VALUES
    (moderate_id, 'VTI', 35.00),
    (moderate_id, 'VXUS', 20.00),
    (moderate_id, 'BND', 30.00),
    (moderate_id, 'VNQ', 10.00),
    (moderate_id, 'TIP', 5.00);
  
  INSERT INTO public.portfolios (user_id, name, description)
  VALUES (user_id, 'Aggressive Portfolio', 'Growth-focused with higher risk tolerance')
  RETURNING id INTO aggressive_id;
  
  INSERT INTO public.portfolio_holdings (portfolio_id, symbol, allocation_percentage) VALUES
    (aggressive_id, 'QQQ', 30.00),
    (aggressive_id, 'VTI', 30.00),
    (aggressive_id, 'IEMG', 15.00),
    (aggressive_id, 'VXUS', 15.00),
    (aggressive_id, 'ARKK', 10.00);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''));
  
  PERFORM create_starter_portfolios(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION create_portfolios_for_existing_users() RETURNS VOID AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT p.id 
    FROM public.profiles p 
    LEFT JOIN public.portfolios po ON p.id = po.user_id 
    WHERE po.user_id IS NULL
  LOOP
    PERFORM create_starter_portfolios(user_record.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 