import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ptBR } from 'date-fns/locale';
import { CalendarFold, X } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getDepartmentsById } from '../../api/get-department-by-id';
import { getServicesByDepartment } from '../../api/get-service-by-department';
import { updateJob } from '../../api/update-job';
import { Button } from '../../components/button';
import { notify } from '../../components/notification';
import { Job } from '../../types/job';
import TransferJobToDepartment from './transfer-job-to-department';

interface CreateLinkModalProps {
  changeEditJobModal: () => void;
  isOpen: boolean;
  job: Job;
}

const updateJobFormSchema = z.object({
  status: z.string(),
  responsableId: z.string().uuid(),
  serviceId: z.string().uuid(),
});

type JobFormData = z.infer<typeof updateJobFormSchema>;

export function EditJobModal({
  changeEditJobModal,
  isOpen,
  job,
}: CreateLinkModalProps) {
  const { data: department, isLoading: isLoadingDeparment } = useQuery({
    queryKey: ['departments', job.department.id],
    queryFn: () => getDepartmentsById({ departmentId: job.department.id }),
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', job.department.id],
    queryFn: () => getServicesByDepartment({ departmentId: job.department.id }),
    enabled: !!job.department.id,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    (job.occurs_at && new Date(job.occurs_at)) || null,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(updateJobFormSchema),
    defaultValues: {
      status: job.status,
      responsableId: job.responsable?.id || '',
      serviceId: (job.service && job.service.id) || '',
    },
  });

  const { mutateAsync: UpdateJobFn } = useMutation({
    mutationFn: updateJob,
  });

  async function handleUpdateService(data: JobFormData) {
    try {
      const { status, responsableId, serviceId } = data;

      const occurs_at = selectedDate !== null ? selectedDate : undefined;

      await UpdateJobFn({
        status,
        responsableId,
        serviceId,
        occurs_at,
        jobId: job.id,
      });

      notify({
        type: 'success',
        message: 'Alterações realizadas com sucesso.',
        description: 'As mudanças foram aplicadas com sucesso.',
      });

      changeEditJobModal();
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
            <h2 className="text-xl font-semibold">
              Responder / Alterar solicitação
            </h2>
            <button onClick={changeEditJobModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <form
          className="flex flex-col gap-2 mt-8"
          onSubmit={handleSubmit(handleUpdateService)}
        >
          <label htmlFor="" className="font-semibold text-zinc-700">
            Status
          </label>
          <select id="status" {...register('status')} className="w-64 p-2">
            <option value="Aguardando atendimento">
              Aguardando atendimento
            </option>
            <option value="Aguardando material">Aguardando material</option>
            <option value="Agendado">Agendado</option>
            <option value="Em analise">Em analise</option>
          </select>

          <label
            htmlFor=""
            className="flex items-center gap-2 font-semibold text-zinc-700"
          >
            Responsavel
            {isLoadingDeparment && (
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
            id="responsable_department"
            {...register('responsableId')}
            className="w-max"
            disabled={isLoadingDeparment}
          >
            <option value="" disabled>
              {isLoadingDeparment
                ? 'Carregando...'
                : 'Selecione um responsavel'}
            </option>

            {department &&
              department.responsables.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          {errors.responsableId?.message && (
            <p className="text-red-400">Você deve definir um serviço</p>
          )}

          <label
            htmlFor=""
            className="flex items-center gap-2 font-semibold text-zinc-700"
          >
            Serviço
            {isLoadingServices && (
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
            id="service"
            {...register('serviceId')}
            className="w-max"
            disabled={isLoadingServices}
          >
            <option value="" disabled>
              {isLoadingServices ? 'Carregando...' : 'Selecione um serviço'}
            </option>

            {services &&
              services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          {errors.serviceId?.message && (
            <p className="text-red-400">Você deve definir um serviço</p>
          )}

          <label>Data prevista para execução</label>

          <div className="flex gap-2 bg-zinc-100 border-[2px] border-zinc-400 rounded-lg p-2  w-36">
            <DatePicker
              className="bg-transparent w-24"
              locale={ptBR}
              dateFormat="P"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              placeholderText="__/__/__"
            />
            <CalendarFold className="size-5" />
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
                Enviando...
              </>
            ) : (
              'Enviar'
            )}
          </Button>
        </form>

        <div className=" h-[1px] bg-gray-300" />

        <TransferJobToDepartment
          changeEditJobModal={changeEditJobModal}
          isOpen={isOpen}
          job={job}
        />
      </div>
    </div>
  );
}
