import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import CadastroPage from './pages/cadastroPage';
import Perfil from './components/perfil';
import HomeRedirect from './components/homeRedirect';
import ListaUsuarios from './components/listaUsuarios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomeRedirect/>}/>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/cadastroPage" element={<CadastroPage />} />
        <Route path="/perfilPage" element={<Perfil />} />
        <Route path="/usuarios" element={<ListaUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
