import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/dashboard';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';

import 'antd/locale/pt_BR';
import 'react-datepicker/dist/react-datepicker.css';

import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import Layout from './components/layout';
import Department from './pages/department';
import Details from './pages/details';
import Manage from './pages/manage';
import RegisterService from './pages/register-service';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<SignIn />} />
            <Route path="/cadastro" element={<SignUp />} />
          </Route>

          <Route element={<Layout />}>
            {/* Rotas protegidas para usuarios autenticados */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cadastrar-servico" element={<RegisterService />} />
            </Route>

            {/* Rotas protegidas para responsaveis e admins */}
            <Route
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'RESPONSIBLE']} />
              }
            >
              <Route path="/dashboard/departamento" element={<Department />} />
            </Route>

            {/* Rotas protegidas para admins */}
            <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
              <Route path="/gerenciar" element={<Manage />} />
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route path="/servico/:serviceId" element={<Details />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
