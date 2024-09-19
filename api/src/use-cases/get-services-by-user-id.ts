import { ClientError } from '@/errors/client-erro';
import { findServicesByUserId } from '@/repositories/service-repository';
import { findUserById } from '@/repositories/user-repository';

interface GetServicesByUserRequest {
  userId: string;
}

export async function GetServicesByUserUseCase({
  userId,
}: GetServicesByUserRequest) {
  const user = await findUserById(userId);

  if (!user) throw new ClientError(409, 'User not found.');

  const services = await findServicesByUserId(userId);

  if (!services) throw new ClientError(409, 'No services registered.');

  return { services };
}
