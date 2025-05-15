import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const token = localStorage.getItem('token');

  return token ? <Navigate to="/perfilPage" /> : <Navigate to="/loginPage" />;
};

export default HomeRedirect;