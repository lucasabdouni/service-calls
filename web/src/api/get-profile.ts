import { api } from '../lib/axios';

export type getProfileResponse = {
  id: string;
  name: string;
  email: string;
  registration_number: number;
  department: string;
  ramal: number;
  role: string;
  departments_responsible: {
    id: string;
    name: string;
    sigla: string;
    created_at: string;
  }[];
};

export async function getProfile() {
  const response = await api.get<getProfileResponse>('/me');

  return response.data;
}
