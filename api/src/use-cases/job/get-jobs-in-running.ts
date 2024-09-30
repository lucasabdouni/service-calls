import { ClientError } from '@/errors/client-erro';
import { findJobsInRunningByUserResponsableDepartments } from '@/repositories/job-repository';

interface GetJobsRequest {
  userId: string;
}

export async function GetJobsInRunningByUserResponsableDepartmentsUseCase({
  userId,
}: GetJobsRequest) {
  const jobs = await findJobsInRunningByUserResponsableDepartments({
    userId,
  });

  if (jobs.length === 0) {
    throw new ClientError(403, 'No jobs in running');
  }

  return { jobs };
}
