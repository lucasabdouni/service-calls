interface StatisticsProps {
  requests: number;
  openRequest: number;
  completedRequest: number;
}

export function Statistics({
  completedRequest,
  openRequest,
  requests,
}: StatisticsProps) {
  return (
    <div className="flex w-auto lg:w-full items-center justify-between py-6 lg:px-10 bg-white rounded-lg">
      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        <span className="text-xl sm:text-2xl font-bold">{requests}</span>
        <p className="text-gray-400 text-sm sm:text-base">Solicitações</p>
      </div>

      <div className="w-[2px] h-[80%]  bg-zinc-300" />

      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        <span className="text-xl sm:text-2xl font-bold">{openRequest}</span>
        <p className="text-gray-400 text-sm sm:text-base">Abertos</p>
      </div>

      <div className="w-[2px] h-[80%] bg-zinc-300" />

      <div className="flex flex-col px-3 sm:px-12 py-4 items-center justify-center">
        <span className="text-xl sm:text-2xl font-bold">
          {completedRequest}
        </span>
        <p className="text-gray-400 text-sm sm:text-base">Finalizado</p>
      </div>
    </div>
  );
}
