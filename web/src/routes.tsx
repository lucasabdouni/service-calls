import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './pages/_layout/app';
import Dashboard from './pages/dashboard';
import RequestDepartment from './pages/department/requests';
import ServicesDepartment from './pages/department/services';
import Details from './pages/details';
import Manage from './pages/manage';
import RegisterService from './pages/register-service';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <PublicRoute />,
        children: [
          { path: '', element: <SignIn /> },
          { path: 'cadastro', element: <SignUp /> },
        ],
      },

      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <ProtectedRoute />,
            children: [
              { path: 'dashboard', element: <Dashboard /> },
              { path: 'cadastrar-servico', element: <RegisterService /> },
              {
                element: (
                  <ProtectedRoute requiredRoles={['ADMIN', 'RESPONSIBLE']} />
                ),
                children: [
                  {
                    path: 'departamento/requisicoes',
                    element: <RequestDepartment />,
                  },
                  {
                    path: 'departamento/servicos',
                    element: <ServicesDepartment />,
                  },
                ],
              },
              {
                element: <ProtectedRoute requiredRoles={['ADMIN']} />,
                children: [{ path: 'gerenciar', element: <Manage /> }],
              },
            ],
          },
          {
            path: 'servico/:jobId',
            element: <Details />,
          },
        ],
      },

      {
        path: '*',
        // element: <NotFound />,
      },
    ],
  },
]);
