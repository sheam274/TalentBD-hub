ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cv_records;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.cv_records REPLICA IDENTITY FULL;