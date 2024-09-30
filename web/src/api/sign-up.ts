import { api } from '../lib/axios';

export interface SignUpBody {
  name: string;
  email: string;
  password: string;
  registrationNumber: number;
  department: string;
  ramal: number;
}

export async function signUp({
  name,
  email,
  password,
  registrationNumber,
  department,
  ramal,
}: SignUpBody) {
  await api.post('/user', {
    name,
    email,
    password,
    registrationNumber,
    department,
    ramal,
  });
}
