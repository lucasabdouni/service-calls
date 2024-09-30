import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BadgeX } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUserRole, UpdateUserRoleBody } from '../../api/update-user-role';
import { Button } from '../../components/button';
import { notify } from '../../components/notification';
import Spin from '../../components/spin';
import { api } from '../../lib/axios';
import { UserProps } from '../../types/user';
import { ManageResponsibilitiesModal } from './manage-responsibilities-modal';

const filterUserFormSchema = z.object({
  email: z.string().email(),
});

type filterUserFormData = z.infer<typeof filterUserFormSchema>;

export default function ManageUserCard() {
  const [userSearch, setUserSearch] = useState<UserProps>();
  const [selectedRole, setSelectedRole] = useState(userSearch?.role);
  const [isSubmitingAlterRole, setIsSubmitingAlterRole] = useState(false);
  const [
    isChangeManageResponsibilitiesModalOpen,
    setIsChangeManageResponsibilitiesModalOpen,
  ] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<filterUserFormData>({
    resolver: zodResolver(filterUserFormSchema),
  });

  function changeManageResponsibilitiesModal() {
    setIsChangeManageResponsibilitiesModalOpen(
      !isChangeManageResponsibilitiesModalOpen,
    );
  }

  const { mutateAsync: updateUserRoleFn } = useMutation({
    mutationFn: updateUserRole,
  });

  async function handleFilterUser(data: filterUserFormData) {
    try {
      const response = await api.get(`/user/${data.email}`);

      setUserSearch(response.data);

      if (response.data) {
        setSelectedRole(response.data.role);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.status === 409 &&
          err.response?.data.message === 'User not found.'
        ) {
          notify({
            type: 'error',
            message: 'Usuário não encontrado.',
            description: 'Verifique o email do usuário e tente novamente.',
          });
        }
      } else {
        notify({
          type: 'error',
          message: 'Erro na solicitação.',
          description:
            'Houve um problema durante a solicitação. Tente novamente mais tarde.',
        });
      }
    }
  }

  async function handleUpdateUserRole() {
    try {
      if (selectedRole === 'RESPONSIBLE') {
        changeManageResponsibilitiesModal();

        return;
      }

      setIsSubmitingAlterRole(true);

      await updateUserRoleFn({
        email: userSearch?.email,
        role: selectedRole,
      } as UpdateUserRoleBody);

      setUserSearch((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          role: selectedRole as string,
        };
      });

      setIsSubmitingAlterRole(false);
      notify({
        type: 'success',
        message: 'Alterações realizadas com sucesso.',
        description: 'As mudanças foram aplicadas com sucesso.',
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        notify({
          type: 'error',
          message: 'Erro na solicitação.',
          description:
            'Houve um problema durante a solicitação. Tente novamente mais tarde.',
        });
      }
    }
  }

  return (
    <>
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
              <p className="text-red-500 text-sm">Preenchimento obrigatório</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? (
              <>
                <Spin />
                Buscando...
              </>
            ) : (
              'Buscar'
            )}
          </Button>
        </form>

        {userSearch && (
          <div className="mt-8">
            <div className="flex flex-col">
              <h3 className="flex font-semibold text-lg sm:text-xl">
                Usuário: {userSearch.name}
              </h3>
              <span>Permissão atual: {userSearch.role}</span>
              <button
                className="bg-zinc-200 text-sm text-zinc-900 p-2 rounded hover:bg-zinc-400"
                onClick={changeManageResponsibilitiesModal}
                disabled={userSearch.role === 'MEMBER'}
              >
                Gerenciar Departamentos de Responsabilidade
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <label className="text-zinc-500 text-lg">
                Alterar permissão:
              </label>
              <select
                id="department"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="border rounded-lg p-2"
              >
                <option
                  value="RESPONSIBLE"
                  disabled={userSearch.role === 'RESPONSIBLE'}
                >
                  Responsável
                </option>
                <option value="ADMIN" disabled={userSearch.role === 'ADMIN'}>
                  Administrador
                </option>
                <option value="MEMBER" disabled={userSearch.role === 'MEMBER'}>
                  Usuário
                </option>
              </select>
              <button
                onClick={handleUpdateUserRole}
                className="bg-green-500 text-white p-2 rounded-lg text-sm sm:text-base"
              >
                {isSubmitingAlterRole ? (
                  <>
                    <Spin />
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

      {isChangeManageResponsibilitiesModalOpen && userSearch && (
        <ManageResponsibilitiesModal
          changeManageResponsibilitiesModal={changeManageResponsibilitiesModal}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
        />
      )}
    </>
  );
}
