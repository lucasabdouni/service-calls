import { LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Header() {
  const { user, signOut } = useContext(AuthContext);

  const name = user.name && user.name.split(' ')[0];

  return (
    <header className="w-full flex justify-center items-center bg-white border-[1px] border-zinc-300 px-4 py-7">
      <div className="w-full max-w-7xl flex justify-between items-center">
        <h1 className="font-title font-semibold text-xl sm:text-3xl">
          Olá, {name}
        </h1>

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
  );
}
