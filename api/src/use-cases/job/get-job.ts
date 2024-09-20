import { ClientError } from '@/errors/client-erro';
import { findJobById } from '@/repositories/job-repository';

interface GetJobRequest {
  jobId: string;
}

export async function GetJobUseCase({ jobId }: GetJobRequest) {
  const job = await findJobById(jobId);

  if (!job) throw new ClientError(409, 'Job not found.');

  return { job };
}
