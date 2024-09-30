import { Menu as AntMenu, Drawer } from 'antd';
import {
  ClipboardList,
  FileText,
  Folders,
  ListPlus,
  User,
  X,
} from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuItem from './menu-itens';

const { Item, SubMenu } = AntMenu;

interface MenuMobileProps {
  open: boolean;
  onToggle: () => void;
}

export default function MenuMobile({
  open = false,
  onToggle,
}: MenuMobileProps) {
  const { isAuthenticated, user } = useContext(AuthContext);

  const isADMIN = user && user.role && user.role.includes('ADMIN');
  const isRESPONSIBLE = user && user.role && user.role.includes('RESPONSIBLE');

  return (
    <Drawer
      title={<span className="text-2xl">Menu</span>}
      placement="left"
      onClose={onToggle}
      open={open}
      style={{ backgroundColor: '#374151', color: '#9CA3AF' }}
      closeIcon={<X style={{ color: '#9CA3AF' }} />}
      className="lg:hidden"
    >
      <AntMenu
        mode="inline"
        style={{ width: '100%', border: 'none' }}
        className="bg-gray-700"
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
    </Drawer>
  );
}
