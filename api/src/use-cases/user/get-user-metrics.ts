import { ClientError } from '@/errors/client-erro';
import { findJobsByUserId } from '@/repositories/job-repository';
import { findUserById } from '@/repositories/user-repository';

interface GetUserMetricsRequest {
  userId: string;
}

export async function GetUserMetricsUseCase({ userId }: GetUserMetricsRequest) {
  const user = await findUserById(userId);

  if (!user) throw new ClientError(409, 'User not found.');

  const jobs = await findJobsByUserId(userId);

  if (!jobs) throw new ClientError(409, 'No jobs registered.');

  const metrics = {
    requests: jobs.length,
    openRequests: jobs.filter((item) => item.accomplished !== false).length,
    performedRequests: jobs.filter((item) => item.accomplished === true).length,
  };

  return { metrics };
}
