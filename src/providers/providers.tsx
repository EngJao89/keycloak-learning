"use client";

import { SSRKeycloakProvider, cookiesPersistor } from "@react-keycloak/ssr";
import { keycloak } from "@/lib/keycloak";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloak}
      persistor={cookiesPersistor()}
    >
      {children}
    </SSRKeycloakProvider>
  );
}