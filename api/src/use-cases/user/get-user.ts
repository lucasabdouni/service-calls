import { ClientError } from '@/errors/client-erro';
import { findUserById } from '@/repositories/user-repository';

interface GetUserRequest {
  userId: string;
}

export async function GetUserUseCase({ userId }: GetUserRequest) {
  const user = await findUserById(userId);

  if (!user) throw new ClientError(409, 'User not found.');

  return { user };
}
