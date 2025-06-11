-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Stores user profile information.';
COMMENT ON COLUMN public.profiles.id IS 'References the user ID from auth.users.';
COMMENT ON COLUMN public.profiles.full_name IS 'The full name of the user.';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL for the user''s avatar image.';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp of the last profile update.';

-- Enable Row Level Security for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table

-- 1. Allow users to SELECT their own profile
CREATE POLICY "Allow individual user select access"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);
COMMENT ON POLICY "Allow individual user select access" ON public.profiles IS 'Users can select their own profile information.';

-- 2. Allow users to UPDATE their own profile
CREATE POLICY "Allow individual user update access"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
COMMENT ON POLICY "Allow individual user update access" ON public.profiles IS 'Users can update their own profile information.';

-- 3. Allow users to INSERT their own profile
CREATE POLICY "Allow individual user insert access"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
COMMENT ON POLICY "Allow individual user insert access" ON public.profiles IS 'Users can insert their own profile information.';


-- Trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile entry when a new user signs up.';

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'When a new user is created, trigger handle_new_user to create a corresponding profile entry.';
