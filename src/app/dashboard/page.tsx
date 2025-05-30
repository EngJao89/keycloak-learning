"use client";

import { useAuth } from 'react-oidc-context'; 
import React from 'react';

export default function Dashboard() {
  const auth = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-zinc-100 p-4">
      <h1 className="text-4xl font-extrabold mb-8">
        Bem-vindo ao Dashboard!
      </h1>
      <p className="text-lg mb-6">
        Você está logado e pode acessar o conteúdo protegido.
      </p>

      {auth.isAuthenticated && auth.user?.profile.name && (
        <p className="text-2xl mb-10">
          Olá, 
            <span className="font-semibold text-amber-400">
              {auth.user.profile.name}
            </span>
          !
        </p>
      )}

      <button
        onClick={() => auth.signoutRedirect()}
        className="px-8 py-3 bg-red-600 text-white rounded-lg text-lg font-medium
          hover:bg-red-700 transition-colors duration-200 shadow-md
          focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
      >
        Sair da Conta
      </button>
    </div>
  );
}