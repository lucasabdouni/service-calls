import { api } from '../lib/axios';

export interface TransferDepartmentJobBody {
  departmentId: string;
  jobId: string;
}

export async function transferDepartmentJob({
  departmentId,
  jobId,
}: TransferDepartmentJobBody) {
  const response = await api.put(`/job/transfer-department/${jobId}`, {
    departmentId,
  });

  return response.data;
}
