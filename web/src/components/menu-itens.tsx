import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItensProps {
  text: string;
  icon?: React.ElementType;
  routerName: string;
}

export default function MenuItem({
  icon: Icon,
  routerName,
  text,
}: MenuItensProps) {
  return (
    <Link to={routerName} className="flex items-start  gap-2 text-gray-100">
      {Icon && <Icon className=" text-gray-400 size-5" />}
      <p className="text-gray-400 font-bold text-base">{text}</p>
    </Link>
  );
}
