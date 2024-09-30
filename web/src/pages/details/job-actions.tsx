import { useMutation } from '@tanstack/react-query';
import { Popconfirm } from 'antd';
import { CheckCheck, Pause, Play, SquarePen, Trash2 } from 'lucide-react';
import { confirmAccomplishedJob } from '../../api/confirm-accomplished-job';
import { startJob } from '../../api/start-job';
import { stopJob } from '../../api/stop-job';
import { notify } from '../../components/notification';

interface JobActionsProps {
  changeEditJobModal: () => void;
  handleDeleteJob: () => void;
  serviceTeminated: boolean;
  disabledIsRunning: boolean;
  jobId: string;
  running?: boolean;
}

export default function JobActions({
  changeEditJobModal,
  handleDeleteJob,
  serviceTeminated,
  jobId,
  running = false,
  disabledIsRunning,
}: JobActionsProps) {
  const { mutateAsync: StartJobFn, isPending: isPendingStart } = useMutation({
    mutationFn: startJob,
  });

  async function handleStartJob() {
    try {
      await StartJobFn({ jobId });

      notify({
        type: 'success',
        message: 'Serviço iniciado com sucesso.',
        description: 'As mudanças foram aplicadas com sucesso.',
      });
    } catch (err) {
      notify({
        type: 'error',
        message: 'Erro na solicitação.',
        description:
          'Houve um problema durante a solicitação. Tente novamente mais tarde.',
      });
    }
  }

  const { mutateAsync: StopJobFn, isPending: isPendingStop } = useMutation({
    mutationFn: stopJob,
  });

  async function handleStopJob() {
    try {
      await StopJobFn({ jobId });

      notify({
        type: 'success',
        message: 'Serviço pausado com sucesso.',
        description: 'As mudanças foram aplicadas com sucesso.',
      });
    } catch (err) {
      notify({
        type: 'error',
        message: 'Erro na solicitação.',
        description:
          'Houve um problema durante a solicitação. Tente novamente mais tarde.',
      });
    }
  }

  const {
    mutateAsync: ConfirmAccomplishedJobFn,
    isPending: isPendingConfirmAccomplishedJob,
  } = useMutation({
    mutationFn: confirmAccomplishedJob,
  });

  async function handleConfirmAccomplishedJob() {
    try {
      await ConfirmAccomplishedJobFn({ jobId });

      notify({
        type: 'success',
        message: 'Serviço finalizado com sucesso.',
        description: 'O serviço foi realizado com sucesso.',
      });
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
    <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="flex items-center justify-center gap-2 bg-orange-500 p-2 text-zinc-100 hover:bg-orange-700 disabled:bg-orange-300"
        disabled={serviceTeminated || running}
        onClick={changeEditJobModal}
      >
        <SquarePen />
        Responder a solicitação
      </button>

      <div className="flex w-auto flex-col sm:flex-row gap-2 mt-2">
        {isPendingStart || isPendingStop || isPendingConfirmAccomplishedJob ? (
          <>
            {isPendingStart && (
              <div className="flex item-center justify-center bg-green-500 text-zinc-200 px-8 py-2 animate-pulse gap-2">
                <Play />
                <p className="capitalize font-bold">INICIANDO O SERVIÇO...</p>
              </div>
            )}
            {isPendingStop && (
              <div className="flex item-center justify-center bg-red-500 text-zinc-200 px-8 py-2 animate-pulse gap-2">
                <Play />
                <p className="capitalize font-bold">PARANDO O SERVIÇO...</p>
              </div>
            )}

            {isPendingConfirmAccomplishedJob && (
              <div className="flex item-center justify-center bg-blue-500 text-zinc-200 px-8 py-2 animate-pulse gap-2">
                <Play />
                <p className="capitalize font-bold">FINALIZANDO SERVIÇO...</p>
              </div>
            )}
          </>
        ) : (
          <>
            {running ? (
              <>
                <button
                  onClick={handleStopJob}
                  className="flex w-full items-center justify-center gap-2 bg-red-500 p-2 text-zinc-100 hover:bg-red-600 disabled:bg-red-300"
                  disabled={isPendingStop}
                >
                  <Pause />
                  Pausar
                </button>

                <Popconfirm
                  title="Você tem certeza que o serviço foi realizado?"
                  onConfirm={handleConfirmAccomplishedJob}
                  okText="Sim"
                  cancelText="Não"
                >
                  <button
                    className="flex w-full items-center justify-center gap-2 bg-cyan-400 px-5  text-zinc-100 hover:bg-cyan-600 disabled:bg-cyan-300"
                    disabled={serviceTeminated}
                  >
                    <CheckCheck className="shrink-0 " />
                    Realizado
                  </button>
                </Popconfirm>
              </>
            ) : (
              <>
                <button
                  onClick={handleStartJob}
                  className="flex w-full items-center justify-center gap-2 bg-green-400 p-2 text-zinc-100 hover:bg-green-600 disabled:bg-green-300"
                  disabled={
                    serviceTeminated || isPendingStart || disabledIsRunning
                  }
                >
                  <Play />
                  Iniciar
                </button>

                <Popconfirm
                  title="Você tem certeza que o serviço foi realizado?"
                  onConfirm={handleConfirmAccomplishedJob}
                  okText="Sim"
                  cancelText="Não"
                >
                  <button
                    className="flex w-full items-center justify-center gap-2 bg-cyan-400 px-5  text-zinc-100 hover:bg-cyan-600 disabled:bg-cyan-300"
                    disabled={serviceTeminated}
                  >
                    <CheckCheck className="shrink-0 " />
                    Realizado
                  </button>
                </Popconfirm>

                <Popconfirm
                  title="Tem certeza que deseja deletar?"
                  onConfirm={handleDeleteJob}
                  okText="Sim"
                  cancelText="Não"
                >
                  <button
                    className="flex w-full items-center justify-center gap-2 bg-red-500 p-2 text-zinc-100 hover:bg-red-700 disabled:bg-red-400"
                    disabled={serviceTeminated}
                  >
                    <Trash2 className="size-4" /> Deletar
                  </button>
                </Popconfirm>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
