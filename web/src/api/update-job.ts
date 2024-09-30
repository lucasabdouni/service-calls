import { api } from '../lib/axios';

export interface UpdateJobBody {
  status?: string;
  responsableId?: string;
  serviceId?: string;
  occurs_at?: Date;
  jobId: string;
}

export interface GetJobByIdResponse {
  id: string;
  local: string;
  problem_description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: string;
  accomplished: boolean;
  created_at: string;
  occurs_at: string | null;
  start_time: number;
  elapsed_time: number;
  running: boolean;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    sigla: string;
    created_at: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    ramal: number;
    registration_number: number;
  };
  responsable: {
    id: string;
    name: string;
    email: string;
    ramal: number;
    registration_number: number;
  } | null;
  service: {
    id: string;
    description: string;
    name: string;
    execution_time: number;
  };
}

export async function updateJob({
  status,
  responsableId,
  serviceId,
  occurs_at,
  jobId,
}: UpdateJobBody) {
  const response = await api.put<GetJobByIdResponse>(`/job/${jobId}`, {
    status,
    responsableId,
    serviceId,
    occurs_at,
  });

  return response.data;
}
