import { FileText, ListPlus } from 'lucide-react';
import MenuItens from './menu-itens';

export function Menu() {
  return (
    <section className="flex flex-col items-center justify-start w-64 h-screen bg-gray-700 text-gray-100">
      <h2 className="text-5xl font-bold py-10 font-title">Menu</h2>

      <ul className="w-full">
        <MenuItens icon={FileText} text="Requisições" routerName="/dashboard" />
        <MenuItens
          icon={ListPlus}
          text="Cadastrar"
          routerName="/cadastrar-servico"
        />
      </ul>
    </section>
  );
}
