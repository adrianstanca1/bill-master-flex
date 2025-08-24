import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(url, key);

try {
  const { error } = await supabase.auth.signUp({
    email: `test+${Date.now()}@example.com`,
    password: 'Password123!'
  });
  if (error) {
    const msg = error.message === 'fetch failed' && error.status === 0
      ? 'Network unreachable. Please check your connection.'
      : error.message;
    console.error('signUp error:', msg);
  } else {
    console.log('signUp success');
  }
} catch (err) {
  const message = err instanceof Error && (err).cause?.code === 'ENETUNREACH'
    ? 'Network unreachable. Please check your connection.'
    : (err instanceof Error ? err.message : String(err));
  console.error('signUp exception:', message);
}
