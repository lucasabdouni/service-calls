import { useQuery } from '@tanstack/react-query';
import { getUserMetrics } from '../../api/get-user-metrics';
import { Skeleton } from '../../components/skeleton';

export function Statistics() {
  const { data: metrics, isLoading: isLoadingUserMetrics } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: getUserMetrics,
  });

  return (
    <div className="flex w-auto lg:w-full items-center justify-between py-6 lg:px-10 bg-white rounded-lg">
      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        {isLoadingUserMetrics ? (
          <Skeleton className="w-10 h-6" />
        ) : (
          <span className="text-xl sm:text-2xl font-bold">
            {metrics?.requests}
          </span>
        )}
        <p className="text-gray-400 text-sm sm:text-base">Solicitações</p>
      </div>

      <div className="w-[2px] h-[80%]  bg-zinc-300" />

      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        {isLoadingUserMetrics ? (
          <Skeleton className="w-10 h-6" />
        ) : (
          <span className="text-xl sm:text-2xl font-bold">
            {metrics?.openRequests}
          </span>
        )}
        <p className="text-gray-400 text-sm sm:text-base">Abertos</p>
      </div>

      <div className="w-[2px] h-[80%] bg-zinc-300" />

      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        {isLoadingUserMetrics ? (
          <Skeleton className="w-10 h-6" />
        ) : (
          <span className="text-xl sm:text-2xl font-bold">
            {metrics?.performedRequests}
          </span>
        )}
        <p className="text-gray-400 text-sm sm:text-base">Finalizado</p>
      </div>
    </div>
  );
}
