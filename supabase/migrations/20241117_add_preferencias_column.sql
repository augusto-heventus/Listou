-- Add preferencias column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferencias JSONB DEFAULT '{"moeda": "BRL", "notificacoes": true, "backup_automatico": true}'::jsonb;

-- Grant permissions for the new column
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;