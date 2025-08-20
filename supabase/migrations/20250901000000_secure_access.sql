-- Enforce authenticated role on all public policies and revoke anonymous function access

-- 1. Ensure all policies require authenticated role
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND (array_position(roles, 'anon') IS NOT NULL OR array_position(roles, 'public') IS NOT NULL)
    LOOP
        EXECUTE format('ALTER POLICY %I ON %I.%I TO authenticated;',
                       pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END$$;

-- 2. Limit execution of public functions to authenticated users
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
