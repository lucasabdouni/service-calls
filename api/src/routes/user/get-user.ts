import { ClientError } from '@/errors/client-erro';
import { getUserById } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';

export const getUserByIdHandler = async (request: FastifyRequest) => {
  await request.jwtVerify();

  const user = await getUserById(request.user.sub);

  if (!user) throw new ClientError(409, 'User not found.');

  return { user };
};
