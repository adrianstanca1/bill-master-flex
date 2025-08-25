import { SUPABASE_URL } from './client';

let projectRef = '';
try {
  projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
} catch {
  projectRef = '';
}

export const supabaseProjectRef = projectRef;
export const supabaseDashboardUrl = projectRef
  ? `https://supabase.com/dashboard/project/${projectRef}`
  : 'https://supabase.com/dashboard';
