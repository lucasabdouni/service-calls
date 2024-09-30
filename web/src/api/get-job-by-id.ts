import { api } from '../lib/axios';

interface GetJobByIdResponse {
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

export type GetJobByIdRequest = {
  jobId: string;
};

export async function getJobsById({ jobId }: GetJobByIdRequest) {
  const response = await api.get<GetJobByIdResponse>(`/job/${jobId}`);

  return response.data;
}
