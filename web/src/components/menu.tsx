import { ClipboardList, FileText, Folders, ListPlus, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MenuItens from './menu-itens';

export function Menu() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const isADMIN = isAuthenticated && user.role.includes('ADMIN');
  const isRESPONSIBLE = isAuthenticated && user.role.includes('RESPONSIBLE');

  return (
    <section className="flex flex-col items-center justify-start min-h-screen bg-gray-700 text-gray-100 w-auto">
      <h2 className="text-5xl font-bold py-10 font-title hidden lg:block px-8">
        Menu
      </h2>

      <ul className="w-full">
        {isAuthenticated ? (
          <>
            <MenuItens
              icon={FileText}
              text="Requisições"
              routerName="/dashboard"
            />
            <MenuItens
              icon={ListPlus}
              text="Cadastrar"
              routerName="/cadastrar-servico"
            />
            {isADMIN || isRESPONSIBLE ? (
              <MenuItens
                icon={Folders}
                text="Departamento"
                routerName="/dashboard/departamento"
              />
            ) : (
              ''
            )}
            {isADMIN && (
              <MenuItens
                icon={ClipboardList}
                text="Admin"
                routerName="/gerenciar"
              />
            )}
          </>
        ) : (
          <MenuItens icon={User} text="Login" routerName="/" />
        )}
      </ul>
    </section>
  );
}
