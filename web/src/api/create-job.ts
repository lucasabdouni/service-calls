import { api } from '../lib/axios';

export interface CreateJobBody {
  local: string;
  departmentId: string;
  serviceId: string;
  priority: 'Baixa' | 'Media' | 'Alta';
  problemDescription: string;
}

export interface CreateJobResponse {
  id: string;
}

export async function createJob({
  local,
  departmentId,
  serviceId,
  priority,
  problemDescription,
}: CreateJobBody) {
  const response = await api.post<CreateJobResponse>('/job', {
    local,
    departmentId,
    serviceId,
    priority,
    problemDescription,
  });

  return response.data;
}
