// src/integrations/Auth0ProviderWrapper.tsx
import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

export const Auth0ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!domain || !clientId) {
    console.error("Auth0 env vars missing");
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback",
        audience,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="memory"
    >
      {children}
    </Auth0Provider>
  );
};