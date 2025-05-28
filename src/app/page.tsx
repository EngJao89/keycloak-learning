"use client";

import { useKeycloak } from "@react-keycloak/ssr";

export default function AuthButton() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <p>Carregando...</p>;

  if (keycloak?.authenticated) {
    return (
      <div>
        <p>Olá, {keycloak.tokenParsed?.preferred_username}!</p>
        <button onClick={() => keycloak.logout()}>Sair</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => keycloak?.login()}>Entrar com Keycloak</button>
    </div>
  );
}
