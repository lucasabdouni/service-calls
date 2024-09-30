import { api } from '../lib/axios';

export interface DeleteServiceBody {
  serviceId: string;
}

export async function deleteService({ serviceId }: DeleteServiceBody) {
  await api.delete(`/service/${serviceId}`);
}
