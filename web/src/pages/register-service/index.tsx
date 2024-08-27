import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/button';
import { notify } from '../../components/notification';
import { api } from '../../lib/axios';
import { DepartmentProps } from '../../types/department';

const serviceFormSchema = z.object({
  local: z.string().min(2),
  department_id: z
    .string()
    .uuid({ message: 'Selecione um departamento válido.' }),
  priority: z.enum(['Baixa', 'Media', 'Alta'], {
    errorMap: () => ({ message: 'Selecione uma prioridade válida.' }),
  }),
  problem_description: z.string().min(3),
  problem: z.string().min(3),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function RegisterService() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getDepartments() {
      try {
        const response = await api.get(`/departments`);
        setDepartments(response.data.departments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getDepartments();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      priority: 'Baixa',
    },
  });

  async function handleCreateService(data: ServiceFormData) {
    try {
      const response = await api.post('/service', data);

      notify({
        type: 'success',
        message: 'Serviço criado com sucesso.',
        description: 'A requisição de serviço foi cadastrada com sucesso.',
      });

      navigate(`/servico/${response.data.service.id}`);
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
    <>
      <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
        <div className="w-full bg-white p-4 sm:p-16">
          <h1 className="text-2xl font-bold text-title">Nova requisição</h1>

          <form
            className="flex flex-col gap-2 mt-8"
            onSubmit={handleSubmit(handleCreateService)}
          >
            <label htmlFor="" className="font-semibold text-zinc-700">
              Serviço
            </label>
            <input
              type="text"
              className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg p-2 sm:w-72"
              {...register('problem')}
            />

            {errors.problem && (
              <div className="flex items-center gap-2">
                <BadgeX className="text-red-500 size-4" />
                <p className="text-red-500 text-sm">
                  Preenchimento obrigatório
                </p>
              </div>
            )}

            <label htmlFor="" className="font-semibold text-zinc-700">
              Local
            </label>
            <input
              type="text"
              className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg p-2 sm:w-72"
              {...register('local')}
            />

            {errors.local && (
              <div className="flex items-center gap-2">
                <BadgeX className="text-red-500 size-4" />
                <p className="text-red-500 text-sm">
                  Preenchimento obrigatório
                </p>
              </div>
            )}

            <label htmlFor="" className="font-semibold text-zinc-700">
              Descrição da atividade / problema
            </label>
            <textarea
              {...register('problem_description')}
              className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg p-2 h-44"
            />

            {errors.problem_description && (
              <div className="flex items-center gap-2">
                <BadgeX className="text-red-500 size-4" />
                <p className="text-red-500 text-sm">
                  Preenchimento obrigatório
                </p>
              </div>
            )}

            <label
              htmlFor=""
              className="flex items-center gap-2 font-semibold text-zinc-700"
            >
              Departamento
              {loading && (
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
              {...register('department_id')}
              className="w-max"
              disabled={loading}
            >
              <option className="flex" value="" disabled>
                {loading ? 'Carregando...' : 'Selecione'}
              </option>

              {departments &&
                departments.map((department) => {
                  return (
                    <option key={department.id} value={department.id}>
                      {department.sigla} - {department.name}
                    </option>
                  );
                })}
            </select>

            <label htmlFor="" className="font-semibold text-zinc-700">
              Prioridade
            </label>
            <div className="flex gap-4">
              <div className="flex justify-center items-center gap-1">
                <input
                  type="radio"
                  id="low"
                  value="Baixa"
                  {...register('priority')}
                />
                <label htmlFor="low">Baixa</label>
              </div>

              <div className="flex justify-center items-center gap-1">
                <input
                  type="radio"
                  id="medium"
                  value="Media"
                  {...register('priority')}
                />
                <label htmlFor="medium">Média</label>
              </div>

              <div className="flex justify-center items-center gap-1">
                <input
                  type="radio"
                  id="high"
                  value="Alta"
                  {...register('priority')}
                />
                <label htmlFor="high">Alta</label>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
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
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
