import { api } from '../lib/axios';

export interface CreateServiceBody {
  name: string;
  description: string;
  executionTime: number;
  departmentId: string;
}

export interface CreateServiceResponse {
  id: string;
  name: string;
  description: string;
  execution_time: number;
  department_id: string;
}

export async function createService({
  name,
  description,
  executionTime,
  departmentId,
}: CreateServiceBody) {
  const response = await api.post<CreateServiceResponse>('/service', {
    name,
    description,
    executionTime,
    departmentId,
  });

  return response.data;
}
