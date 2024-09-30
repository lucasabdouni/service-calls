import { api } from '../lib/axios';

export interface UpdateServiceBody {
  name: string;
  description: string;
  executionTime: number;
  serviceId: string;
}

export async function updateService({
  name,
  description,
  executionTime,
  serviceId,
}: UpdateServiceBody) {
  const response = await api.put(`/service/${serviceId}`, {
    name,
    description,
    executionTime,
  });

  return response.data;
}
