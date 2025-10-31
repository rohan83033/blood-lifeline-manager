-- Fix search_path for functions with CASCADE
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_inventory_after_donation() CASCADE;

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate inventory update function with proper search_path
CREATE OR REPLACE FUNCTION update_inventory_after_donation()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Success' THEN
    UPDATE public.blood_inventory
    SET units_available = units_available + 1,
        last_updated = NOW()
    WHERE blood_group = NEW.blood_group;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER donation_updates_inventory
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_after_donation();