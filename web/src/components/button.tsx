import { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-blue-600 w-48 p-3 rounded-xl text-zinc-50 mt-3 hover:bg-blue-800 disabled:bg-blue-300"
    >
      {children}
    </button>
  );
}
