"use client" 

import { useAuth } from 'react-oidc-context';
import LoginPage from './loginpage/page';

export default function AuthButton() {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-zinc-300 text-2xl">
        Carregando...
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-900 text-red-300 text-2xl">
        Ops... Houve um erro: {auth.error.message}
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-zinc-100 text-3xl">
        <p className="mb-4">Olá, <span className="font-semibold text-amber-400">{auth.user?.profile.name}</span>!</p>
        <button 
          onClick={() => auth.signoutRedirect()}
          className="px-6 py-3 bg-red-600 text-white rounded-md text-lg hover:bg-red-700 transition-colors duration-200"
        >
          Sair
        </button>
      </div>
    );
  }

  return <LoginPage onLogin={() => auth.signinRedirect()} />;
}
