import { api } from '../lib/axios';

export type getJobsByUserRequest = {
  userId: string;
};

export type getJobsByUserResponse = {
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
}[];

export async function getJobsByUser({ userId }: getJobsByUserRequest) {
  const response = await api.get<getJobsByUserResponse>(`/jobs/user/${userId}`);

  return response.data;
}
