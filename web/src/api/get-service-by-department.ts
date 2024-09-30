import { api } from '../lib/axios';

export type GetServicesByDepartmentResponse = {
  id: string;
  description: string;
  name: string;
  execution_time: number;
}[];

export type GetServicesByDepartmentRequest = {
  departmentId: string;
};

export async function getServicesByDepartment({
  departmentId,
}: GetServicesByDepartmentRequest) {
  const response = await api.get<GetServicesByDepartmentResponse>(
    `/service-by-department/${departmentId}`,
  );

  return response.data;
}
