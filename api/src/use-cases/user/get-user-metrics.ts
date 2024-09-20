import { ClientError } from '@/errors/client-erro';
import { findServicesByUserId } from '@/repositories/service-repository';
import { findUserById } from '@/repositories/user-repository';

interface GetUserMetricsRequest {
  userId: string;
}

export async function GetUserMetricsUseCase({ userId }: GetUserMetricsRequest) {
  const user = await findUserById(userId);

  if (!user) throw new ClientError(409, 'User not found.');

  const services = await findServicesByUserId(userId);

  if (!services) throw new ClientError(409, 'No services registered.');

  const metrics = {
    requests: services.length,
    openRequests: services.filter((item) => item.accomplished !== false).length,
    performedRequests: services.filter((item) => item.accomplished === true)
      .length,
  };

  return { metrics };
}
