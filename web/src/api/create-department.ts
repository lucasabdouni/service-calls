import { api } from '../lib/axios';
import { DepartmentProps } from '../types/department';

export interface CreateDepartmentBody {
  name: string;
  sigla: string;
}

export async function createDepartment({ name, sigla }: CreateDepartmentBody) {
  const response = await api.post<DepartmentProps>('/department', {
    name,
    sigla,
  });

  return response.data;
}
