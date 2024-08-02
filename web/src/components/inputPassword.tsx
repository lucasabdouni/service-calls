import { Eye, EyeOff } from 'lucide-react';
import React, { ComponentProps, useState } from 'react';

interface InputProps extends ComponentProps<'input'> {
  error?: boolean;
  icon?: React.ElementType;
}

const InputComponent = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input {...props} ref={ref} className="outline-none flex-1" />;
});

InputComponent.displayName = 'InputComponent';

export const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, icon: Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState('password');

    function handleShowPassword() {
      if (showPassword === 'password') {
        setShowPassword('text');
      } else {
        setShowPassword('password');
      }
    }

    return (
      <div
        className={`flex justify-center items-center px-6 py-4 border-2 ${
          error ? 'border-red-500' : 'border-zinc-300'
        } rounded-xl gap-3 text-base`}
      >
        {Icon && <Icon className="text-zinc-400 size-5" />}
        <InputComponent type={showPassword} {...props} ref={ref} />

        <button
          type="button"
          onClick={handleShowPassword}
          className="text-zinc-400 cursor-pointer bg-none"
        >
          {showPassword === 'password' ? <Eye /> : <EyeOff />}
        </button>
      </div>
    );
  },
);

InputPassword.displayName = 'InputPassword';
