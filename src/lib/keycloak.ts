export const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_KEYCLOAK_URL + "/realms/" + process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
};