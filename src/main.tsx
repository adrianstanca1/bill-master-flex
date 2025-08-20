import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyUserTheme } from './lib/theme';
import { checkSupabaseConnection } from './integrations/supabase/client';
import { syncOfflineData } from './integrations/powersync/client';

async function bootstrap() {
  applyUserTheme();

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Failed to find the root element to mount React app');
  }

  await checkSupabaseConnection();
  await syncOfflineData();

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();

