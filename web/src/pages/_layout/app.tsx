import { Outlet } from 'react-router-dom';
import { Header } from '../../components/header';
import { Menu } from '../../components/menu';

export default function AppLayout() {
  return (
    <div className="w-full flex">
      <Menu />
      <main className="w-full flex flex-col items-center justify-start">
        <Header />

        <Outlet />
      </main>
    </div>
  );
}
