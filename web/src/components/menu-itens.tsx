import React from 'react';
import { useLocation } from 'react-router-dom';

interface MenuItensProps {
  text: string;
  icon: React.ElementType;
  routerName: string;
}

export default function MenuItens({
  icon: Icon,
  routerName,
  text,
}: MenuItensProps) {
  const location = useLocation();

  const isActivity = location.pathname === routerName;

  return (
    <li>
      <a
        href={routerName}
        className={`flex items-center justify-center lg:justify-start gap-6 lg:border-l-[6px] border-l-[4px] px-7 py-5 ${
          isActivity
            ? ` border-indigo-100 bg-gray-600 text-gray-100`
            : `text-gray-400 border-gray-700`
        } text-base w-full ${
          !isActivity &&
          `hover:bg-gray-600 hover:border-gray-600 hover:text-gray-100`
        }`}
      >
        <Icon
          className={`size-4 sm:size-5 shrink-0 ${
            isActivity ? `text-gray-100` : `text-gray-400`
          } hover:text-gray-100`}
        />

        <p className="hidden lg:block lg:pr-4">{text}</p>
      </a>
    </li>
  );
}
