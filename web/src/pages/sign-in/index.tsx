import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { InputPassword } from '../../components/inputPassword';
import { notify } from '../../components/notification';
import { AuthContext } from '../../context/AuthContext';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'O email informado não é valido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha tem no minimo 6 caracteres.' }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function SignIn() {
  const { signIn, isAuthenticated } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, []);

  async function handleLogin(data: LoginFormData) {
    await signIn(data).then((error) => {
      if (error) {
        notify({
          type: 'error',
          message: 'Erro ao tentar fazer login.',
          description: error,
        });
      }
    });
  }

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <div className="w-full flex flex-col max-w-[585px] bg-white p-4 sm:p-20">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-title">
            Bem-vindo ao nosso sistema
          </h1>
          <p className="text-lg text-zinc-500">
            Efetue o login para prosseguir.
          </p>
        </div>
        <form
          className="flex flex-col gap-2 mt-8"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Input
            type="email"
            placeholder="E-mail"
            {...register('email')}
            error={!!errors.email}
            icon={Mail}
          />

          <InputPassword
            placeholder="Senha"
            {...register('password')}
            error={!!errors.password}
            icon={Lock}
          />

          <Button type="submit" disabled={isSubmitting}>
            Entrar
          </Button>
        </form>

        <a href="#" className="italic underline mt-5">
          Perdeu a Senha ?
        </a>

        <div className="w-full bg-zinc-200 h-0.5  my-3" />

        <div className="flex flex-col gap-3">
          <p className="text-base text-zinc-500">
            Ainda não possui uma conta? .
          </p>
        </div>

        <Link
          to="cadastro"
          className="bg-blue-600 w-48 p-3 rounded-xl text-zinc-50 text-center mt-3 hover:bg-blue-800"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}
