import { ComponentProps, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const buttonStyles = tv({
  base: 'flex justify-center items-center gap-2 w-48 p-3 rounded-xl text-zinc-50 mt-3 disabled:bg-opacity-50',
  variants: {
    variant: {
      primary: 'bg-blue-600 hover:bg-blue-800 disabled:bg-blue-500',
      secondary: 'bg-amber-400 hover:bg-amber-500 disabled:bg-yellow-500',
      danger: 'bg-red-600 hover:bg-red-800 disabled:bg-red-500',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={buttonStyles({ variant })}>
      {children}
    </button>
  );
}
