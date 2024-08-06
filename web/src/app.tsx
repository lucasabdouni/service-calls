import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/dashboard';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';

import 'antd/locale/pt_BR';
import 'react-datepicker/dist/react-datepicker.css';
import Details from './pages/details';
import RegisterService from './pages/register-service';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastrar-servico" element={<RegisterService />} />
          <Route path="/servico/:serviceId" element={<Details />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
