import { ReactNode } from 'react';
import { Header } from './header';
import { Menu } from './menu';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex">
      <Menu />
      <main className="w-full flex flex-col items-center justify-start">
        <Header />

        {children}
      </main>
    </div>
  );
}
