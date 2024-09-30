import { Download } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { GetUserResponsableJobsResponse } from '../../../api/get-user-responsable-job';

interface JobsMetricsProps {
  data: GetUserResponsableJobsResponse;
}

export function ExportJobsMetrics({ data }: JobsMetricsProps) {
  if (!data || !Array.isArray(data)) {
    return null;
  }

  const formattedData = data.map((job) => ({
    service: job.service.name,
    department: job.department.name,
    local: job.local,
    user: job.user.name,
    problem_description: job.problem_description,
    execution_time: `${Math.floor(
      job.service.execution_time / 1000 / 60,
    )} min.`,
    priority: job.priority,
    status: job.status,
    created_at: job.created_at,
    elapsed_time: `${Math.floor(job.elapsed_time / 1000 / 60)} min.`,
    responsable: job.responsable?.name || '',
  }));

  const headers = [
    { label: 'Serviço', key: 'service' },
    { label: 'Departamento', key: 'department' },
    { label: 'Local', key: 'local' },
    { label: 'Nome do solicitante', key: 'user' },
    { label: 'Descrição da solicitação', key: 'problem_description' },
    { label: 'Tempo estimado para execução', key: 'execution_time' },
    { label: 'Prioridade', key: 'priority' },
    { label: 'Status', key: 'status' },
    { label: 'Data de solicitação', key: 'created_at' },
    { label: 'Tempo decorrido', key: 'elapsed_time' },
    { label: 'Responsável pela execução', key: 'responsable' },
  ];

  return (
    <CSVLink
      data={formattedData}
      headers={headers}
      className="bg-cyan-400 text-sm p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-500"
      filename="requests-service-table.csv"
    >
      <Download className="size-5" />
      Exportar tabela em CSV
    </CSVLink>
  );
}
