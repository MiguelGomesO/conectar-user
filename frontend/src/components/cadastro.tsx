import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/create', {
        name: nome,
        email: email,
        password: senha,
      });

      setMensagem('Cadastro realizado com sucesso! ✅');
      setTimeout(() => navigate('/loginPage'), 1500);
    } catch (erro: any) {
      setMensagem('Erro ao cadastrar. Verifique os dados!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleCadastro}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Crie sua conta no <span className="text-emerald-600">Conéctar User</span>
        </h2>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Cadastrar
        </button>

        {mensagem && (
          <p
            className={`text-center text-sm font-medium ${mensagem.toLowerCase().includes('sucesso') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {mensagem}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/loginPage" className="text-blue-600 hover:underline font-medium">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
};

export default Cadastro;
