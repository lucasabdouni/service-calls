import { FileText, Folders, ListPlus } from 'lucide-react';
import MenuItens from './menu-itens';

export function Menu() {
  return (
    <section className="flex flex-col items-center justify-start min-h-screen bg-gray-700 text-gray-100 w-auto">
      <h2 className="text-5xl font-bold py-10 font-title hidden lg:block">
        Menu
      </h2>

      <ul className="w-full">
        <MenuItens icon={FileText} text="Requisições" routerName="/dashboard" />
        <MenuItens
          icon={ListPlus}
          text="Cadastrar"
          routerName="/cadastrar-servico"
        />
        <MenuItens
          icon={Folders}
          text="Departamento"
          routerName="/dashboard/departamento"
        />
        <MenuItens icon={Folders} text="Gerenciar" routerName="/gerenciar" />
      </ul>
    </section>
  );
}
