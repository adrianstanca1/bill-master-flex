-- This migration adds indexes to improve query performance on frequently searched columns.

-- Add an index on company_id in company_invites to accelerate lookups by company
CREATE INDEX IF NOT EXISTS company_invites_company_id_idx
    ON public.company_invites (company_id);

-- Add an index on invited_email in company_invites to accelerate searches by invited email
CREATE INDEX IF NOT EXISTS company_invites_invited_email_idx
    ON public.company_invites (invited_email);

-- Add an index on user_id in user_consents to accelerate lookups of consents by user
CREATE INDEX IF NOT EXISTS user_consents_user_id_idx
    ON public.user_consents (user_id);

-- Add an index on policy in user_consents to accelerate lookups by policy type
CREATE INDEX IF NOT EXISTS user_consents_policy_idx
    ON public.user_consents (policy);