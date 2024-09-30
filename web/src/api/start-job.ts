import { api } from '../lib/axios';

export interface startJobParams {
  jobId: string;
}

export async function startJob({ jobId }: startJobParams) {
  await api.put(`/job/${jobId}/start`);
}
