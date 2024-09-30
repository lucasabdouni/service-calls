import { LogOut, Menu } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MenuMobile from './menu-mobile';
import { Skeleton } from './skeleton';

export function Header() {
  const { signOut, user, isLoadingProfile } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const name = user && user.role && user.name.split(' ')[0];

  return (
    <>
      <header className="w-full flex justify-center items-center bg-white border-[1px] border-zinc-300 px-4 py-7">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div>
            <div className="flex justify-center items-center gap-8">
              <button className="p-2 lg:hidden">
                <Menu className="" onClick={toggleDrawer} />
              </button>

              {isLoadingProfile ? (
                <Skeleton className="w-64 h-12" />
              ) : (
                <h1 className="font-title font-semibold text-xl sm:text-3xl">
                  Olá, {name}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-14">
            <button>
              <LogOut
                className="hover:text-zinc-500 size-5 sm:size-6"
                onClick={signOut}
              />
            </button>
          </div>
        </div>
      </header>

      <MenuMobile open={drawerOpen} onToggle={toggleDrawer} />
    </>
  );
}
