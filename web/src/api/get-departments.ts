import { api } from '../lib/axios';

export type getDepartmentsResponse = {
  id: string;
  name: string;
  sigla: string;
  created_at: string;
}[];

export async function getDepartments() {
  const response = await api.get<getDepartmentsResponse>('/departments');

  return response.data;
}
