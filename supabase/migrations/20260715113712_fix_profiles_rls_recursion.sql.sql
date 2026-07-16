-- Recursive RLS policies on profiles cause queries to error out.
-- Replace the self-referencing subquery with a SECURITY DEFINER function.

CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = _uid AND p.role = 'admin'
  );
$$;

-- Drop the recursive policies
DROP POLICY IF EXISTS select_own_or_all_profiles ON profiles;
DROP POLICY IF EXISTS update_own_or_all_profiles ON profiles;

-- Recreate using the non-recursive function
CREATE POLICY select_own_or_all_profiles ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY update_own_or_all_profiles ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));
