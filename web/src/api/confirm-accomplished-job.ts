import { api } from '../lib/axios';

export interface ConfirmAccomplishedJobParams {
  jobId: string;
}

export async function confirmAccomplishedJob({
  jobId,
}: ConfirmAccomplishedJobParams) {
  await api.put(`/job/accomplished/${jobId}`);
}
