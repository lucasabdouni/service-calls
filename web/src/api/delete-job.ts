import { api } from '../lib/axios';

export interface DeleteJobBody {
  jobId: string;
}

export async function deleteJob({ jobId }: DeleteJobBody) {
  await api.delete(`/job/${jobId}`);
}
