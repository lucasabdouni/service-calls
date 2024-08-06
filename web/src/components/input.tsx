import React, { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  error?: boolean;
  icon?: React.ElementType;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className="outline-none flex-1 bg-transparent"
      />
    );
  },
);

InputComponent.displayName = 'InputComponent';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, icon: Icon, ...props }, ref) => {
    return (
      <div
        className={`flex justify-center items-center px-6 py-4 border-2  ${
          error ? 'border-red-500' : 'border-zinc-300'
        } rounded-xl gap-3 text-base`}
      >
        {Icon && <Icon className="text-zinc-400 size-5" />}
        <InputComponent {...props} ref={ref} />
      </div>
    );
  },
);

Input.displayName = 'Input';
