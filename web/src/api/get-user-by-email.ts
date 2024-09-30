import { api } from '../lib/axios';

export type GetUserByEmailRequest = {
  email: string;
};

export type GetUserByEmailResponse = {
  id: string;
  name: string;
  email: string;
  registration_number: number;
  ramal: number;
  role: string;
  departments_responsible: {
    id: string;
    name: string;
    sigla: string;
    created_at: Date;
  }[];
};

export async function getUserByEmail({ email }: GetUserByEmailRequest) {
  const response = await api.get<GetUserByEmailResponse>(`/user/${email}`);

  return response.data;
}
