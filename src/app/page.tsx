"use client";

import { useAuth } from 'react-oidc-context';


export default function AuthButton() {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {auth.user?.profile.name}!
        <button onClick={() => auth.signoutRedirect()}>Log out</button>
      </div>
    );
  }

  return <button onClick={() => auth.signinRedirect()}>Log in</button>;
}
