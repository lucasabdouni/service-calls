import { api } from '../lib/axios';

export interface AuthenticateBody {
  email: string;
  password: string;
}

export async function authenticate({ email, password }: AuthenticateBody) {
  const response = await api.post('/sessions', { email, password });

  return response.data;
}
