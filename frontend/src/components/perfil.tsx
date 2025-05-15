import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/loginPage');
        return;
      }

      try {
        const response = await api.get('/users/perfil');
        setUsuario(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setPreview(response.data.avatar);
      } catch {
        localStorage.removeItem('token');
        navigate('/loginPage');
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginPage');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (senha) {
      formData.append('password', senha);
    }
    if (file) {
      formData.append('file', file);
    }

    const response = await api.patch('/users/updateUser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setUsuario((prev: typeof usuario) => ({
      ...prev,
      name,
      email,
      avatar: response.data.avatar || prev.avatar,
    }));

    setMostrarModal(false);
    setPreview(null);
    setSenha(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAbrirModal = () => {
    setMostrarModal(true);
    setTimeout(() => setModalVisivel(true), 10); // esperar renderizar
  };

  const handleFecharModal = () => {
    setModalVisivel(false);
    setTimeout(() => setMostrarModal(false), 300); // esperar a transição terminar
  };

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {!usuario ? (
        <p className="text-center text-gray-700">Carregando perfil...</p>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-2">
            <img
              src={usuario.avatar || '/iconVazio.png'}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
            />
            <h2 className="text-xl font-semibold text-gray-800">{usuario.name}</h2>
            <p className="text-sm text-gray-500">{usuario.email}</p>
            <p className="text-xs text-gray-400">Criado em: {formatarData(usuario.createdAt)}</p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => handleAbrirModal()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-full"
            >
              Editar Perfil
            </button>

            <button
              onClick={() => navigate('/usuarios')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-1 rounded-full"
            >
              Ver Lista de Usuários
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-full"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      )}

      {mostrarModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalVisivel ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'}`}>
          <div className={`bg-white p-6 rounded-lg w-full max-w-lg shadow-md relative transform transition-all duration-300 ${modalVisivel ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <button
              onClick={() => handleFecharModal()}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h3 className="text-center text-lg font-semibold mb-4">Editar Perfil</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex justify-center mb-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                  ) : avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar atual"
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                  ) : <img
                    src="/iconVazio.png"
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  />
                  }
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium">
                  Selecionar Imagem
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <p className="text-sm text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </p>
                )}
              </div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nome"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="password"
                value={senha ?? ''}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
