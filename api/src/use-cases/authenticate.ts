import { ClientError } from '@/errors/client-erro';
import { findUserByEmailAuth } from '@/repositories/user-repository';
import { compare } from 'bcryptjs';

interface AuthenticateRequest {
  email: string;
  password: string;
}

export async function AuthenticateUseCase({
  email,
  password,
}: AuthenticateRequest) {
  const user = await findUserByEmailAuth(email);

  if (!user) throw new ClientError(401, 'Invalid credentials');

  const doesPasswordMatchnes = await compare(password, user.password_hash);

  if (!doesPasswordMatchnes) throw new ClientError(401, 'Invalid credentials');

  return { user };
}
