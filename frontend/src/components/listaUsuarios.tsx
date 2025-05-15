import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [editarModal, setEditarModal] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [papel, setPapel] = useState('');
    const [avatar, setAvatar] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [busca, setBusca] = useState('');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
    const [filtroPapel, setFiltroPapel] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 10;
    const indexInicial = (paginaAtual - 1) * itensPorPagina;
    const indexFinal = paginaAtual * itensPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indexInicial, indexFinal);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarPerfilEUsuarios = async () => {
            const perfil = await api.get('/users/perfil');
            setUsuarioLogado(perfil.data);

            const response = await api.get('/users');
            setUsuarios(response.data);
            setUsuariosFiltrados(response.data);
        };

        carregarPerfilEUsuarios();
    }, []);

    const handleBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
        const termo = e.target.value.toLowerCase();
        setBusca(termo);
        setPaginaAtual(1);
        aplicarFiltros(termo, filtroPapel);
    };

    const aplicarFiltros = (termo: string, papel: string) => {
        const filtrados = usuarios.filter(user => {
            const condicaoTexto =
                user.name.toLowerCase().includes(termo) ||
                user.email.toLowerCase().includes(termo);
            const condicaoPapel = papel === '' || user.role === papel;
            return condicaoTexto && condicaoPapel;
        });

        setUsuariosFiltrados(filtrados);
    };

    const carregarUsuarios = async () => {
        const response = await api.get('/users');
        setUsuarios(response.data);
        setUsuariosFiltrados(response.data);
    };

    const exportarCSV = () => {
        const linhas = ["Nome,Email,Papel"];
        usuariosFiltrados.forEach(user => {
            linhas.push(`${user.name},${user.email},${user.role}`);
        });
        const csvContent = linhas.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "usuarios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text('Lista de Usuários', 14, 15);
        autoTable(doc, {
            startY: 25,
            head: [['Nome', 'Email', 'Papel']],
            body: usuariosFiltrados.map((user) => [user.name, user.email, user.role]),
        });
        doc.save('usuarios.pdf');
    };

    const abrirModal = (usuario: any) => {
        setUsuarioSelecionado(usuario);
        setNome(usuario.name);
        setEmail(usuario.email);
        setPapel(usuario.role);
        setAvatar(usuario.avatar || '');
        setPreview(null);
        setFile(null);
        setEditarModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const salvarAlteracoes = async () => {
        const formData = new FormData();
        formData.append('name', nome);
        formData.append('email', email);
        formData.append('role', papel);
        if (file) formData.append('file', file);
        await api.patch(`/users/${usuarioSelecionado.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setEditarModal(false);
        setFile(null);
        setPreview(null);
        carregarUsuarios();
    };

    const excluirUsuario = (id: number) => {
        toast.info(({ closeToast }) => (
            <div>
                <p>Tem certeza que deseja excluir este usuário?</p>
                <button onClick={async () => {
                    try {
                        await api.delete(`/users/${id}`);
                        toast.success('Usuário excluído com sucesso!');
                        carregarUsuarios();
                    } catch {
                        toast.error('Erro ao excluir usuário.');
                    }
                    closeToast();
                }}>Confirmar</button>
                <button onClick={closeToast}>Cancelar</button>
            </div>
        ), { autoClose: false, closeOnClick: false, draggable: false });
    };

    const voltarPerfil = () => navigate("/perfilPage");

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-32 bg-gray-100 text-black w-full">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">📋</span> Lista de Usuários
            </h2>

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 gap-4 mb-6 w-full">
                <select
                    value={filtroPapel}
                    onChange={e => {
                        const papelSelecionado = e.target.value;
                        setFiltroPapel(papelSelecionado);
                        aplicarFiltros(busca, papelSelecionado);
                    }}
                    className="md:w-full lg:w-[300px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                    <option value="">Todos os papéis</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar por nome ou email"
                    value={busca}
                    onChange={handleBusca}
                    className="w-full lg:w-[160px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />



                <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
                    <button
                        onClick={exportarCSV}
                        className="w-full lg:w-auto bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition font-medium"
                    >
                        Exportar CSV
                    </button>

                    <button
                        onClick={exportarPDF}
                        className="w-full lg:w-auto bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition font-medium"
                    >
                        Exportar PDF
                    </button>

                    <button
                        onClick={voltarPerfil}
                        className="w-full lg:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition font-medium"
                    >
                        Voltar para o perfil
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-200 text-gray-700 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-3 border-b border-gray-300 text-left">Nome</th>
                            <th className="px-4 py-3 border-b border-gray-300 text-left">Email</th>
                            <th className="px-4 py-3 border-b border-gray-300 text-left">Papel</th>
                            <th className="px-4 py-3 border-b border-gray-300 text-left w-[13%] whitespace-nowrap">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                        {usuariosPaginados.map((user, index) => (
                            <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}>
                                <td className="px-4 py-2 border-t border-gray-200">{user.name}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{user.email}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{user.role}</td>
                                <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                                    {usuarioLogado?.role === 'ADMIN' ? <>
                                        <button onClick={() => abrirModal(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Editar</button>
                                        <button onClick={() => excluirUsuario(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Excluir</button>
                                    </> : (
                                        usuarioLogado?.id === user.id ? (
                                            <>
                                                <button onClick={() => abrirModal(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Editar</button>
                                                <button onClick={() => excluirUsuario(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Excluir</button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">Sem autorização para alterar este usuário</span>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1} className={`px-4 py-2 rounded font-medium transition ${paginaAtual === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Anterior</button>
                <span className="text-black">Página <span className="font-bold">{paginaAtual}</span> de <span className="font-bold">{totalPaginas}</span></span>
                <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className={`px-4 py-2 rounded font-medium transition ${paginaAtual === totalPaginas ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Próxima</button>
            </div>

            {editarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-xl relative">
                        <button onClick={() => setEditarModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl" title="Fechar">&times;</button>
                        <h3 className="text-xl font-bold mb-4 text-center">Editar Usuário</h3>
                        <div className="flex justify-center mb-4">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-gray-300" />
                            ) : avatar ? (
                                <img src={avatar} alt="Avatar atual" className="w-24 h-24 rounded-full object-cover border border-gray-300" />
                            ) : <img src="/iconVazio.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover border border-gray-300" />}
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium">
                                Selecionar Imagem
                                <input type="file" onChange={handleFileChange} className="hidden" />
                            </label>
                            {file && (<p className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</p>)}
                        </div>
                        <div className="flex flex-col gap-3">
                            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <select value={papel} onChange={e => setPapel(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setEditarModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition">Cancelar</button>
                                <button onClick={salvarAlteracoes} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaUsuarios;