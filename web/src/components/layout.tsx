import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Header } from './header';
import { Menu } from './menu';

export default function Layout() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="w-full flex">
      <Menu />
      <main className="w-full flex flex-col items-center justify-start">
        {isAuthenticated && <Header />}

        <Outlet />
      </main>
    </div>
  );
}
