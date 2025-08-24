import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyUserTheme } from './lib/theme';
import { Auth0ProviderWithConfig } from './integrations/auth0/provider';

applyUserTheme();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element to mount React app');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Auth0ProviderWithConfig>
      <App />
    </Auth0ProviderWithConfig>
  </StrictMode>
);
