import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-zinc-900 text-zinc-100 p-4">
      <h1 className="text-5xl font-extrabold mb-8 text-center leading-tight">
        Bem-vindo ao <span className="text-amber-500">Keycloak Learning</span>
      </h1>
      <p className="text-lg mb-12 text-center max-w-md">
        Acesse sua conta para explorar recursos exclusivos e aprimorar seus conhecimentos sobre autenticação.
      </p>
      <button
        onClick={onLogin}
        className="px-12 py-4 border-amber-600 border-2 rounded-full text-amber-600 text-xl font-semibold
          hover:bg-amber-600 hover:text-white transition-all duration-300 ease-in-out shadow-xl
          focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
      >
        Entrar na Plataforma
      </button>
    </div>
  );
}