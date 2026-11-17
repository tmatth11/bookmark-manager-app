CREATE OR REPLACE TRIGGER handle_bookmark_updated_at
  BEFORE UPDATE ON public.bookmark
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');