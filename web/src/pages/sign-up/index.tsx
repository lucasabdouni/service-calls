import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/button';
import { ErrorMessage } from '../../components/error-message';
import { Input } from '../../components/input';
import { InputPassword } from '../../components/inputPassword';
import { api } from '../../lib/axios';

const registerFormSchema = z
  .object({
    email: z.string().email({ message: 'O email informado não é valido.' }),
    name: z.string().min(3, { message: 'O nome informado é invalido.' }),
    matricula: z
      .string()
      .min(2, { message: 'A matricula necessita ser preechida.' }),
    departamento: z.string().min(3, {
      message: 'O departamento necessita ser preechido.',
    }),
    ramal: z
      .string()
      .min(2, { message: 'A matricula necessita ser preechida.' }),
    password: z
      .string()
      .min(6, { message: 'A senha tem no minimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const [errorSubmitForm, setErrorSubmitForm] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const specificErrorMessages: Record<number, Record<string, string>> = {
    409: {
      'E-mail already registered': 'E-mail já cadastrado.',
      'Registration number already registered': 'Matrícula já cadastrada.',
    },
  };

  const generalErrorMessages: Record<number, string> = {
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
  };

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/user', {
        name: data.name,
        email: data.email,
        registration_number: Number(data.matricula),
        department: data.departamento,
        ramal: Number(data.ramal),
        password: data.password,
      });

      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        const statusCode = err.response?.status;
        const errorMessage = err.response?.data?.message;

        if (
          statusCode &&
          errorMessage &&
          specificErrorMessages[statusCode]?.[errorMessage]
        ) {
          setErrorSubmitForm(specificErrorMessages[statusCode][errorMessage]);
        } else if (statusCode && generalErrorMessages[statusCode]) {
          setErrorSubmitForm(generalErrorMessages[statusCode]);
        } else {
          setErrorSubmitForm('Tente novamente mais tarde');
        }
      } else {
        setErrorSubmitForm('Tente novamente mais tarde');
      }
    }
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
          onSubmit={handleSubmit(handleRegister)}
        >
          {errorSubmitForm && <ErrorMessage message={errorSubmitForm} />}
          <Input
            type="text"
            placeholder="Nome"
            {...register('name')}
            error={!!errors.name}
          />

          <div className="flex gap-1">
            <Input
              type="email"
              placeholder="E-mail"
              {...register('email')}
              error={!!errors.email}
            />

            <div className="w-40">
              <Input
                type="text"
                placeholder="Ramal"
                {...register('ramal')}
                error={!!errors.ramal}
              />
            </div>
          </div>

          <div className="flex gap-1">
            <div className="w-52">
              <Input
                type="text"
                placeholder="Matricula"
                {...register('matricula')}
                error={!!errors.matricula}
              />
            </div>

            <Input
              type="text"
              placeholder="Departamento"
              {...register('departamento')}
              error={!!errors.departamento}
            />
          </div>

          <InputPassword
            placeholder="Senha"
            {...register('password')}
            error={!!errors.password}
          />

          <InputPassword
            placeholder="Confirme a senha"
            {...register('confirmPassword')}
            error={!!errors.password}
          />

          <Button type="submit" disabled={isSubmitting}>
            Cadastrar
          </Button>
        </form>

        <div className="w-full bg-zinc-200 h-0.5  my-3" />

        <div className="flex flex-col gap-3">
          <p className="text-base text-zinc-500">Já possui uma conta? .</p>
        </div>

        <Link
          to="/"
          className="bg-blue-600 w-48 p-3 rounded-xl text-zinc-50 text-center mt-3 hover:bg-blue-800"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
