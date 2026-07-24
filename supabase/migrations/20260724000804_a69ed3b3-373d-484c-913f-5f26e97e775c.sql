
-- Restrict pricing/settings read to authenticated users only
DROP POLICY IF EXISTS "Anyone reads settings" ON public.admin_settings;
CREATE POLICY "Authenticated reads settings"
  ON public.admin_settings FOR SELECT
  TO authenticated
  USING (true);

-- Lock down SECURITY DEFINER functions from direct client execution.
-- has_role is still callable from RLS policies (policies run as table owner
-- and re-check EXECUTE against the invoking role — grant only authenticated).
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Add self-scope guard so a signed-in user can only probe their own roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow RLS/system contexts (no auth.uid()) and self-checks only
  IF auth.uid() IS NOT NULL AND auth.uid() <> _user_id THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- handle_new_user is a trigger — never call it directly
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
