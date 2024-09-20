import { ClientError } from '@/errors/client-erro';
import { findJobs } from '@/repositories/job-repository';
import dayjs from 'dayjs';

interface GetJobsRequest {
  starts_at?: string;
  ends_at?: string;
  accomplished: boolean;
  userId: string;
}

export async function GetJobsUseCase({
  starts_at,
  ends_at,
  accomplished,
  userId,
}: GetJobsRequest) {
  const startDate = starts_at ? dayjs(starts_at).startOf('day').toDate() : null;
  const endDate = ends_at
    ? dayjs(ends_at).startOf('day').set('hour', 23).set('minute', 59).toDate()
    : null;

  if (starts_at && dayjs(startDate).isAfter(endDate)) {
    throw new ClientError(401, 'Invalid date');
  }

  const jobs = await findJobs({
    userId,
    accomplished,
    startDate,
    endDate,
  });

  if (jobs.length === 0) {
    throw new ClientError(403, 'No jobs registered in the selected data');
  }

  return { jobs };
}
