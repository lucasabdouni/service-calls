import { zodResolver } from '@hookform/resolvers/zod';
import { ptBR } from 'date-fns/locale';
import { CalendarFold, X } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/button';
import { ErrorMessage } from '../../components/error-message';
import { api } from '../../lib/axios';
import { ServiceProps } from '../dashboard/services-user-table';

interface CreateLinkModalProps {
  changeEditServiceModal: () => void;
  service: ServiceProps;
  setService: React.Dispatch<React.SetStateAction<ServiceProps | undefined>>;
}

const updateServiceFormSchema = z.object({
  status: z.string(),
  responsible_accomplish: z.string(),
});

type ServiceFormData = z.infer<typeof updateServiceFormSchema>;

export function EditServiceModal({
  changeEditServiceModal,
  service,
  setService,
}: CreateLinkModalProps) {
  const [errorSubmitForm, setErrorSubmitForm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    service.occurs_at || null,
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    service.department,
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(updateServiceFormSchema),
    defaultValues: {
      status: service.status,
      responsible_accomplish: service.responsible_accomplish || '',
    },
  });

  async function handleUpdateService(data: ServiceFormData) {
    try {
      const { status, responsible_accomplish } = data;

      const response = await api.put(`/service/${service?.id}`, {
        status,
        responsible_accomplish,
        occurs_at: selectedDate,
      });

      setService(response.data.service);

      changeEditServiceModal();
    } catch (err) {
      setErrorSubmitForm('Tente novamente mais tarde');
    }
  }

  async function handleTransferDepartment() {
    try {
      const response = await api.put(`/service/${service?.id}`, {
        selectedDepartment,
      });

      setService(response.data.service);

      changeEditServiceModal();
    } catch (err) {
      setErrorSubmitForm('Tente novamente mais tarde');
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
            <button onClick={changeEditServiceModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <form
          className="flex flex-col gap-2 mt-8"
          onSubmit={handleSubmit(handleUpdateService)}
        >
          {errorSubmitForm && <ErrorMessage message={errorSubmitForm} />}

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

          <label htmlFor="" className="font-semibold text-zinc-700">
            Responsavel pela execução
          </label>
          <input
            type="text"
            className="bg-zinc-100 border-[2px] border-zinc-400 rounded-lg py-1 px-3 w-72"
            {...register('responsible_accomplish')}
          />

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

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">
            Transferir para outro departamento:
          </p>
          <form action="submit" className="flex flex-col gap-2">
            <label htmlFor="" className="font-semibold text-zinc-700">
              Departamento
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              className="w-32 p-2"
            >
              <option value="TI">TI</option>
            </select>

            <Button onClick={handleTransferDepartment} disabled={isSubmitting}>
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
    </div>
  );
}
