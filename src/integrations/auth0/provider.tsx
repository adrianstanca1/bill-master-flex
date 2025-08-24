import { Auth0Provider } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const env =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env
    : (process.env as Record<string, string | undefined>);

const AUTH0_DOMAIN =
  (env.VITE_AUTH0_DOMAIN as string | undefined) ||
  (env.AUTH0_DOMAIN as string | undefined);
const AUTH0_CLIENT_ID =
  (env.VITE_AUTH0_CLIENT_ID as string | undefined) ||
  (env.AUTH0_CLIENT_ID as string | undefined);

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error('Missing Auth0 environment variables');
}

export function Auth0ProviderWithNavigate({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || window.location.pathname, { replace: true });
  };

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
