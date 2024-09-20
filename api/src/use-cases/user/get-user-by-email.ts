import { ClientError } from '@/errors/client-erro';
import { findUserByEmail } from '@/repositories/user-repository';

interface GetUserByEmailRequest {
  email: string;
}

export async function GetUserByEmailUseCase({ email }: GetUserByEmailRequest) {
  const user = await findUserByEmail(email);

  if (!user) throw new ClientError(409, 'User not found.');

  return { user };
}
