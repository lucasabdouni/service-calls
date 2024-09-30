import { api } from '../lib/axios';

export type Service = {
  id: string;
  name: string;
  description: string;
  execution_time: number;
};

export type GetServicesResponse = {
  id: string;
  name: string;
  sigla: string;
  created_at: Date;
  services: Service[];
}[];

export async function getServices() {
  const response = await api.get<GetServicesResponse>('/services');

  return response.data;
}
