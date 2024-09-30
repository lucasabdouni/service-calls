import { api } from '../lib/axios';

interface GetDepartmentByIdResponse {
  id: string;
  name: string;
  sigla: string;
  created_at: string;
  responsables: {
    id: string;
    name: string;
    email: string;
  }[];
}

export type GetDepartmentByIdRequest = {
  departmentId: string;
};

export async function getDepartmentsById({
  departmentId,
}: GetDepartmentByIdRequest) {
  const response = await api.get<GetDepartmentByIdResponse>(
    `/department/${departmentId}`,
  );

  return response.data;
}
