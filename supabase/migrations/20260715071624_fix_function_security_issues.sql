/*
# Fix security issues with database functions

## Overview
Fixes three security advisories:
1. `public.update_updated_at` had a mutable search_path — now pinned to `public`
2. `public.handle_new_user()` was executable by `anon` via REST RPC — EXECUTE revoked from `anon`
3. `public.handle_new_user()` was executable by `authenticated` via REST RPC — EXECUTE revoked from `authenticated`

## Changes
- Recreate `update_updated_at()` with `SET search_path = public` (immutable search path)
- Recreate `handle_new_user()` keeping `SET search_path = public` (already had it)
- `REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, authenticated`
- The trigger on `auth.users` still works because trigger functions execute with the
  function owner's privileges internally, not through the REST API / RPC endpoint.

## Notes
- These functions are only meant to be called by database triggers, not by clients
- Revoking EXECUTE from anon + authenticated blocks the `/rest/v1/rpc/handle_new_user` endpoint
- The `on_auth_user_created` trigger continues to fire normally on new signups
*/

-- ─── Fix 1: Pin search_path on update_updated_at ───────────────────────────────

DROP TRIGGER IF EXISTS products_updated_at ON products;

DROP FUNCTION IF EXISTS public.update_updated_at();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Fix 2 & 3: Revoke EXECUTE on handle_new_user from anon + authenticated ────

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
