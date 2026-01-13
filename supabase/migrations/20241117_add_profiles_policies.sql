-- Add missing RLS policies for profiles table
-- Allow users to insert their own profile during signup
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Grant necessary permissions
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;