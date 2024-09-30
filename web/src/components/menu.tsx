import { ClipboardList, FileText, Folders, ListPlus, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { Menu as AntMenu } from 'antd';
import { Link } from 'react-router-dom';
import MenuItem from './menu-itens';

const { Item, SubMenu } = AntMenu;

export function Menu() {
  const { isAuthenticated, user, isLoadingProfile } = useContext(AuthContext);

  const isADMIN = user && user.role && user.role.includes('ADMIN');
  const isRESPONSIBLE = user && user.role && user.role.includes('RESPONSIBLE');

  if (isLoadingProfile) {
    return (
      <section className="hidden lg:flex flex-col items-center justify-start min-h-screen bg-gray-700 text-gray-100 w-full max-w-56">
        <h2 className="text-5xl font-bold py-10 font-title hidden lg:block px-8">
          Menu
        </h2>
        <AntMenu
          mode="inline"
          style={{ flex: 1 }}
          className="bg-gray-700 w-full"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Item key={i} className="animate-pulse bg-gray-600"></Item>
          ))}
        </AntMenu>
      </section>
    );
  }
  return (
    <>
      <section className="hidden lg:flex flex-col items-center justify-start min-h-screen bg-gray-700 text-gray-100 w-full max-w-56 ">
        <h2 className="text-5xl font-bold py-10 font-title hidden lg:block px-8">
          Menu
        </h2>

        <AntMenu
          mode="inline"
          style={{ flex: 1 }}
          className="bg-gray-700 w-full"
        >
          {isAuthenticated ? (
            <>
              <Item key="1" className="hover:bg-gray-600">
                <MenuItem
                  icon={FileText}
                  routerName="/dashboard"
                  text="Requisições"
                />
              </Item>
              <Item key="2" className="hover:bg-gray-600">
                <MenuItem
                  icon={ListPlus}
                  routerName="/cadastrar-servico"
                  text="Cadastrar"
                />
              </Item>
              {(isADMIN || isRESPONSIBLE) && (
                <SubMenu
                  key="sub1"
                  title={
                    <div className="flex gap-2">
                      <Folders className="text-gray-400 size-5" />
                      <span className="text-gray-400 font-bold text-base">
                        Departamento
                      </span>
                    </div>
                  }
                  className="bg-gray-700"
                >
                  <Item key="3-1" className="hover:bg-gray-600">
                    <MenuItem
                      routerName="/departamento/requisicoes"
                      text="Solicitações"
                    />
                  </Item>
                  <Item key="3-2" className="hover:bg-gray-600">
                    <MenuItem
                      routerName="/departamento/servicos"
                      text="Serviços"
                    />
                  </Item>
                </SubMenu>
              )}
              {isADMIN && (
                <Item key="4" className="hover:bg-gray-600">
                  <MenuItem
                    routerName="/gerenciar"
                    text="Admin"
                    icon={ClipboardList}
                  />
                </Item>
              )}
            </>
          ) : (
            <Item key="5" className="hover:bg-gray-600">
              <Link to="/" className="flex items-center text-gray-400">
                <User className="text-gray-400 size-5" />
                Login
              </Link>
            </Item>
          )}
        </AntMenu>
      </section>
    </>
  );
}
