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
        className={`flex items-center justify-start gap-6 border-l-[6px] ${
          isActivity
            ? ` border-indigo-100 bg-gray-600 text-gray-100`
            : `text-gray-400 border-gray-700`
        } text-base px-7 py-5 ${
          !isActivity &&
          `hover:bg-gray-600 hover:border-gray-600 hover:text-gray-100`
        }`}
      >
        <Icon
          className={`size-5 ${
            isActivity ? `text-gray-100` : `text-gray-400`
          } hover:text-gray-100`}
        />
        {text}
      </a>
    </li>
  );
}
