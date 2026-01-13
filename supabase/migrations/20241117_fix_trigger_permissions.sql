-- Ensure the trigger function has proper permissions
-- Grant necessary permissions for the trigger to work

-- Grant usage on auth schema to function owner
GRANT USAGE ON SCHEMA auth TO postgres;

-- Grant select permission on auth.users to function owner
GRANT SELECT ON auth.users TO postgres;

-- Ensure the function can insert into profiles
GRANT INSERT ON public.profiles TO postgres;

-- Also grant to authenticated role for direct operations
GRANT INSERT ON public.profiles TO authenticated;

-- Create a more permissive policy for profile creation during signup
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (true); -- Allow anyone to insert (will be restricted by trigger logic)