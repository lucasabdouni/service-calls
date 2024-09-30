import { api } from '../lib/axios';

export interface stopJobParams {
  jobId: string;
}

export async function stopJob({ jobId }: stopJobParams) {
  await api.put(`/job/${jobId}/stop`);
}
