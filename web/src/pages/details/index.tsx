import { useContext, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { deleteJob } from '../../api/delete-job';
import { getJobsById } from '../../api/get-job-by-id';
import { notify } from '../../components/notification';
import { Skeleton } from '../../components/skeleton';
import { AuthContext } from '../../context/AuthContext';
import { useJobDetailsWebSockets } from '../../hooks/job-action-web-socket';
import { EditJobModal } from './edit-job-modal';
import JobActions from './job-actions';

const priorityVariants = tv({
  base: 'text-xl sm:text-3xl',
  variants: {
    priority: {
      Baixa: 'text-green-500',
      Media: 'text-yellow-400',
      Alta: 'text-red-500',
    },
  },
});

export default function Details() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    data: job,
    isLoading: isLoadingJob,
    isError: isErrorInGetJob,
  } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobsById({ jobId: jobId as string }),
    enabled: !!jobId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (isErrorInGetJob) {
      navigate('/dashboard');
    }
  }, [navigate, isErrorInGetJob]);

  const timestamp = new Date().getTime();
  const suppostElapsedTime =
    job && job.start_time ? timestamp - job.start_time : 0;

  const elapsed_time =
    job && job.elapsed_time > 0
      ? Math.floor(job.elapsed_time / 1000 / 60)
      : Math.floor(suppostElapsedTime / 1000 / 60);

  const [time, setTime] = useState<number>(elapsed_time || 0);

  useEffect(() => {
    let interval: number | undefined;

    if (job?.running) {
      setTime(elapsed_time);
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 60000);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [job?.running]);

  if (!jobId) {
    throw new Error('Details component not found');
  }

  useJobDetailsWebSockets({ jobId });

  const { isAuthenticated, user, isLoadingProfile } = useContext(AuthContext);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);

  const { mutateAsync: deleteJobFn } = useMutation({
    mutationFn: deleteJob,
  });

  if (!jobId) {
    navigate('/dashboard');
    return null;
  }

  async function handleDeleteJob() {
    try {
      if (!job?.id) {
        return;
      }

      await deleteJobFn({ jobId: job.id });

      navigate('/dashboard');

      notify({
        type: 'success',
        message: 'Deletado com sucesso.',
        description: 'O serviço foi deletado com sucesso.',
      });
    } catch (error) {
      notify({
        type: 'error',
        message: 'Erro na solicitação.',
        description:
          'Houve um problema durante a solicitação. Tente novamente mais tarde.',
      });
    }
  }

  function changeEditJobModal() {
    setIsEditJobModalOpen(!isEditJobModalOpen);
  }

  const userAuthorizedToEdit =
    (isAuthenticated &&
      user &&
      job?.department &&
      user.departments_responsible.some(
        (item) => item.id === job.department.id,
      )) ||
    (user && user.role === 'ADMIN');

  const serviceTeminated = job?.status === 'Finalizado' ? true : false;

  const dateCreate = job
    ? format(job.created_at, 'dd/MM/yyyy', {
        locale: ptBR,
      })
    : null;

  const dateOccurs = job?.occurs_at
    ? format(job.occurs_at, 'dd/MM/yyyy', {
        locale: ptBR,
      })
    : null;

  const hourlyStimate =
    job && Math.floor(job.service.execution_time / 1000 / 60);

  return (
    <>
      <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
        <div className="flex flex-col w-full bg-white gap-4 p-14">
          <div className="flex flex-col justify-between sm:flex-row gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Serviço</p>
              {isLoadingJob ? (
                <Skeleton className="w-64 h-16" />
              ) : (
                <h2 className="font-semibold text-2xl sm:text-4xl max-w-full break-words">
                  {job?.service?.name
                    ? job.service.name.toUpperCase()
                    : 'Não definido'}
                </h2>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Prioridade</p>
              {isLoadingJob ? (
                <Skeleton className="w-36 h-10" />
              ) : (
                <span
                  className={priorityVariants({
                    priority: job?.priority as 'Baixa' | 'Media' | 'Alta',
                  })}
                >
                  ● {job?.priority}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Descrição</p>
            {isLoadingJob ? (
              <Skeleton className="w-36 h-10" />
            ) : (
              <span className="text-base sm:text-2xl max-w-full break-words">
                {job?.problem_description}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Departamento responsável</p>
            {isLoadingJob ? (
              <Skeleton className="w-80 h-10" />
            ) : (
              <span className="text-lg sm:text-2xl max-w-full break-words">
                {job?.department.name}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-start sm:items-center sm:flex-row gap-4 sm:gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Local</p>
              {isLoadingJob ? (
                <Skeleton className="w-36 h-10" />
              ) : (
                <span className="text-lg sm:text-2xl max-w-full break-words">
                  {job?.local}
                </span>
              )}
            </div>

            <div className="h-10 w-[1px] bg-gray-300 hidden sm:block" />

            <div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Data de solicitação</p>
                {isLoadingJob ? (
                  <Skeleton className="w-40 h-10" />
                ) : (
                  <span className="text-lg sm:text-2xl max-w-full break-words">
                    {dateCreate}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start sm:items-center sm:flex-row gap-4 sm:gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Status</p>
              {isLoadingJob ? (
                <Skeleton className="w-80 h-10" />
              ) : (
                <span className="text-lg sm:text-2xl max-w-full break-words">
                  {job?.status}
                </span>
              )}
            </div>

            <div className="h-10 w-[1px] bg-gray-300 hidden sm:block" />

            <div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Tempo previsto para execução
                </p>
                {isLoadingJob ? (
                  <Skeleton className="w-40 h-10" />
                ) : (
                  <span className="text-lg sm:text-2xl max-w-full break-words">
                    {hourlyStimate} min.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col justify-start sm:items-center sm:flex-row gap-4 sm:gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Data prevista para execução
                </p>
                {isLoadingJob ? (
                  <Skeleton className="w-40 h-10" />
                ) : (
                  <span className="text-lg sm:text-2xl max-w-full break-words">
                    {dateOccurs ? dateOccurs : '-- / -- / --'}
                  </span>
                )}
              </div>

              <div className="h-10 w-[1px] bg-gray-300 hidden sm:block" />

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Responsavel pela execução
                </p>
                {isLoadingJob ? (
                  <Skeleton className="w-40 h-10" />
                ) : (
                  <span className="text-lg sm:text-2xl max-w-full break-words">
                    {job?.responsable?.name
                      ? job.responsable?.name
                      : 'Não definido'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1">
                <Clock className="text-gray-500 size-5" />
                <p className="text-sm text-gray-500">Tempo decorrido</p>
              </div>

              {isLoadingJob ? (
                <Skeleton className="w-40 h-10" />
              ) : (
                <span className="text-lg sm:text-2xl max-w-full break-words  text-right">
                  {time} min.
                </span>
              )}
            </div>
          </div>

          {!isLoadingProfile && !isLoadingJob && userAuthorizedToEdit && (
            <JobActions
              changeEditJobModal={changeEditJobModal}
              handleDeleteJob={handleDeleteJob}
              serviceTeminated={serviceTeminated}
              jobId={jobId}
              running={job?.running}
              disabledIsRunning={!job?.service}
            />
          )}
        </div>
      </div>

      {isEditJobModalOpen && job && (
        <EditJobModal
          changeEditJobModal={changeEditJobModal}
          job={job}
          isOpen={isEditJobModalOpen}
        />
      )}
    </>
  );
}
