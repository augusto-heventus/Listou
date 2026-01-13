-- Check and update permissions for profiles table
-- Grant basic permissions for profile operations

-- Grant select permission to anon for public profile data (if needed)
GRANT SELECT ON public.profiles TO anon;

-- Ensure authenticated users can perform all necessary operations
GRANT ALL PRIVILEGES ON public.profiles TO authenticated;