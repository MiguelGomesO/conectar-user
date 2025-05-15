import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/perfilPage');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resposta = await api.post('/auth/login', {
        email,
        password: senha,
      });

      localStorage.setItem('token', resposta.data.accessToken);
      setMensagem('Login realizado com sucesso!');
      setTimeout(() => navigate('/perfilPage'), 1500);
    } catch (error: any) {
      setMensagem('Email ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/fundo.jpg')] bg-cover bg-center bg-no-repeat px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Bem-vindo de volta ao <span className="text-emerald-600">Conéctar User</span>
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Entrar
        </button>
        {mensagem && (
          <p
            className={`text-center text-sm font-medium mt-2 ${mensagem.toLowerCase().includes('sucesso') ? 'text-blue-600' : 'text-red-600'}`}
          >
            {mensagem}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Não tem cadastro?{' '}
          <a href="/cadastroPage" className="text-blue-600 hover:underline font-medium">Cadastre-se aqui</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
