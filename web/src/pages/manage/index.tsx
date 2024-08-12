import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { BadgeX } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/button';
import { ErrorMessage } from '../../components/error-message';
import { api } from '../../lib/axios';

const filterUserFormSchema = z.object({
  email: z.string().email(),
});

type filterUserFormData = z.infer<typeof filterUserFormSchema>;

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Manage() {
  const [errorSubmitForm, setErrorSubmitForm] = useState('');
  const [userSearch, setUserSearch] = useState<UserProps>();
  const [selectedRole, setSelectedRole] = useState(userSearch?.role);
  const [isSubmitingAlterRole, setIsSubmitingAlterRole] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<filterUserFormData>({
    resolver: zodResolver(filterUserFormSchema),
  });

  async function handleFilterUser(data: filterUserFormData) {
    try {
      setErrorSubmitForm('');
      const response = await api.get(`/user/${data.email}`);

      setUserSearch(response.data.user);

      if (response.data.user) {
        setSelectedRole(response.data.user.role);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.status === 409 &&
          err.response?.data.message === 'User not found.'
        ) {
          setErrorSubmitForm('Usuário não encontrado.');
          setUserSearch(undefined);
        }
      } else {
        setErrorSubmitForm('Ocorreu um erro. Por favor, tente novamente.');
        setUserSearch(undefined);
      }
    }
  }

  async function handleUpdateUserRole() {
    try {
      setIsSubmitingAlterRole(true);
      setErrorSubmitForm('');
      await api.put('/user/update-role', {
        email: userSearch?.email,
        role: selectedRole,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorSubmitForm('Ocorreu um erro. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitingAlterRole(false);
    }
  }

  return (
    <>
      <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-lg sm:text-2xl font-bold text-title">
            Gerenciar permissões de usuário
          </h1>

          <p className="text-zinc-500 text-sm sm:text-base">
            Insira o email do usuario que deseja alterar.
          </p>

          <form
            className="flex flex-col gap-2 mt-8"
            onSubmit={handleSubmit(handleFilterUser)}
          >
            {errorSubmitForm && <ErrorMessage message={errorSubmitForm} />}
            <label htmlFor="email" className="font-semibold text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg w-full sm:w-80 p-2"
              {...register('email')}
            />

            {errors.email && (
              <div className="flex items-center gap-2 mt-1">
                <BadgeX className="text-red-500 size-4" />
                <p className="text-red-500 text-sm">
                  Preenchimento obrigatório
                </p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </form>

          {userSearch && (
            <div className="mt-8">
              <h2 className="font-semibold text-lg sm:text-xl">
                Usuário: {userSearch.name}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <label className="text-zinc-500 text-lg">Alterar cargo:</label>
                <select
                  id="department"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="TI_RESPONSIBLE">Responsável T.I</option>
                  <option value="ELECTRICAL_RESPONSIBLE">
                    Responsável Elétrica
                  </option>
                  <option value="MECANIC_RESPONSIBLE">
                    Responsável Mecânica
                  </option>
                  <option value="SG_RESPONSIBLE">Responsável SG</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="MEMBER">Usuário</option>
                </select>
                <button
                  onClick={handleUpdateUserRole}
                  className="bg-green-500 text-white p-2 rounded-lg text-sm sm:text-base"
                >
                  {isSubmitingAlterRole ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
