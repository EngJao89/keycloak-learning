"use client";

import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_KEYCLOAK_URL + "/realms/" + process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: "http://localhost:3000/callback", 
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, "", window.location.pathname);
  },
};

export default function OIDCProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      {children}
    </AuthProvider>
  );
}