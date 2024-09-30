import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getDepartments } from '../../api/get-departments';
import { updateDepartment } from '../../api/update-department';
import { Button } from '../../components/button';
import { notify } from '../../components/notification';
import { DepartmentProps } from '../../types/department';

interface EditLinkModalProps {
  changeDepartmentModal: () => void;
  isOpen: boolean;
}

const createDepartmentFormSchema = z.object({
  name: z
    .string({ message: 'Name is obrigatory' })
    .min(3, { message: 'Name requires at least 3 characters' }),
  sigla: z
    .string({ message: 'Sigla is obrigatory' })
    .min(2, { message: 'Sigla requires at least 2 characters' })
    .toUpperCase(),
});

type DepartmentFormData = z.infer<typeof createDepartmentFormSchema>;

export function EditDepartmentModal({
  changeDepartmentModal,
  isOpen = false,
}: EditLinkModalProps) {
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentProps | null>(null);

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    // staleTime: 1000 * 60,
    enabled: isOpen,
  });

  function handleSelectDepartmentChange(
    e: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const department =
      departments && departments.find((item) => item.id === e.target.value);

    if (department) {
      setSelectedDepartment(department);
    }

    return;
  }

  const { mutateAsync: updateDepartmentFn } = useMutation({
    mutationFn: updateDepartment,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(createDepartmentFormSchema),
    values: {
      name: selectedDepartment?.name ?? '',
      sigla: selectedDepartment?.sigla ?? '',
    },
  });

  async function handleCreateDepartment(data: DepartmentFormData) {
    try {
      const departmentId = selectedDepartment?.id as string;

      await updateDepartmentFn({
        departmentId,
        name: data.name,
        sigla: data.sigla,
      });

      notify({
        type: 'success',
        message: 'Edição realizada com sucesso.',
        description: 'O departamento foi editado com sucesso.',
      });

      changeDepartmentModal();
    } catch (err) {
      notify({
        type: 'error',
        message: 'Erro na solicitação.',
        description:
          'Houve um problema durante a solicitação. Tente novamente mais tarde.',
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-lg py-5 px-6 shadow-shape bg-white space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Editar departamento</h2>
            <button onClick={changeDepartmentModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <form
          className="flex flex-col gap-2 mt-8"
          onSubmit={handleSubmit(handleCreateDepartment)}
        >
          <label
            htmlFor=""
            className="flex items-center gap-2 font-semibold text-zinc-700"
          >
            Departamento
            {isLoadingDepartments && (
              <svg
                aria-hidden="true"
                className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
            )}
          </label>

          <select
            id="department"
            className="w-max"
            disabled={isLoadingDepartments}
            value={selectedDepartment?.id}
            onChange={handleSelectDepartmentChange}
          >
            <option disabled>
              {isLoadingDepartments
                ? 'Carregando...'
                : 'Selecione um departamento'}
            </option>

            {departments &&
              departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          <label htmlFor="" className="font-semibold text-zinc-700">
            Nome do departamento:
          </label>
          <input
            type="text"
            className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg py-1 px-3 w-max"
            {...register('name')}
            disabled={selectedDepartment === null}
          />

          <label htmlFor="" className="font-semibold text-zinc-700">
            Sigla (Exemplo: TI):
          </label>

          <input
            type="text"
            className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg py-1 px-3 w-24"
            {...register('sigla')}
            disabled={selectedDepartment === null}
          />

          <Button
            type="submit"
            disabled={isSubmitting || selectedDepartment === null}
          >
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
                Enviando...
              </>
            ) : (
              'Enviar'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
