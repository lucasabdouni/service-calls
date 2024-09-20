import { ClientError } from '@/errors/client-erro';
import { findJobsByUserId } from '@/repositories/job-repository';
import { findUserById } from '@/repositories/user-repository';

interface GetJobsByUserRequest {
  userId: string;
}

export async function GetJobsByUserUseCase({ userId }: GetJobsByUserRequest) {
  const user = await findUserById(userId);

  if (!user) throw new ClientError(409, 'User not found.');

  const jobs = await findJobsByUserId(userId);

  if (!jobs) throw new ClientError(409, 'No jobs registered.');

  return { jobs };
}
