CREATE OR REPLACE TRIGGER handle_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');