import { api } from '../lib/axios';

export interface UpdateDepartmentBody {
  name: string;
  sigla: string;
  departmentId: string;
}

export async function updateDepartment({
  name,
  sigla,
  departmentId,
}: UpdateDepartmentBody) {
  const response = await api.put(`/department/${departmentId}`, {
    sigla,
    name,
  });

  return response.data;
}
