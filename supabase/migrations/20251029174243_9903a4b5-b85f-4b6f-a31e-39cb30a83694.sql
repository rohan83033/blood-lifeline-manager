-- Create enum types for donor status and blood groups
CREATE TYPE donor_status AS ENUM (
  'Eligible',
  'In Screening Queue',
  'Not Eligible',
  'Permanently Defer',
  'Ready for Collection',
  'Donation Failed',
  'Donation Success'
);

CREATE TYPE blood_group_type AS ENUM (
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
);

CREATE TYPE gender_type AS ENUM ('M', 'F', 'O');

-- Create donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
  gender gender_type NOT NULL,
  blood_group blood_group_type NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  address TEXT,
  status donor_status DEFAULT 'Eligible',
  last_donation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create screening records table
CREATE TABLE public.screening_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE NOT NULL,
  blood_pressure TEXT,
  hemoglobin DECIMAL,
  weight DECIMAL,
  temperature DECIMAL,
  pulse INTEGER,
  screening_result TEXT,
  notes TEXT,
  screened_by TEXT,
  screened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE NOT NULL,
  donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blood_group blood_group_type NOT NULL,
  quantity_ml INTEGER NOT NULL DEFAULT 450,
  status TEXT DEFAULT 'Success',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood inventory table
CREATE TABLE public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_group blood_group_type UNIQUE NOT NULL,
  units_available INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood requests table
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name TEXT NOT NULL,
  blood_group blood_group_type NOT NULL,
  units_requested INTEGER NOT NULL,
  urgency TEXT DEFAULT 'Normal',
  contact TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donors
CREATE POLICY "Users can view all donors" ON public.donors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own donor record" ON public.donors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update all donors" ON public.donors FOR UPDATE TO authenticated USING (true);

-- RLS Policies for screening_records
CREATE POLICY "Users can view all screening records" ON public.screening_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert screening records" ON public.screening_records FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for donations
CREATE POLICY "Users can view all donations" ON public.donations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for blood_inventory
CREATE POLICY "Anyone can view blood inventory" ON public.blood_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update inventory" ON public.blood_inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can insert inventory" ON public.blood_inventory FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for blood_requests
CREATE POLICY "Anyone can view blood requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blood requests" ON public.blood_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update blood requests" ON public.blood_requests FOR UPDATE TO authenticated USING (true);

-- Initialize blood inventory with all blood groups
INSERT INTO public.blood_inventory (blood_group, units_available) VALUES
  ('A+', 45),
  ('A-', 12),
  ('B+', 38),
  ('B-', 8),
  ('AB+', 15),
  ('AB-', 5),
  ('O+', 52),
  ('O-', 10);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for donors table
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update inventory after donation
CREATE OR REPLACE FUNCTION update_inventory_after_donation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Success' THEN
    UPDATE public.blood_inventory
    SET units_available = units_available + 1,
        last_updated = NOW()
    WHERE blood_group = NEW.blood_group;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory
CREATE TRIGGER donation_updates_inventory
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_after_donation();