import { ClientError } from '@/errors/client-erro';
import { findUserByEmail } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userEmail: z.string({ message: 'Email is invalid' }),
});

export const getServicesByUserEmailHandler = async (
  request: FastifyRequest,
) => {
  const { userEmail } = paramsSchema.parse(request.params);

  const user = await findUserByEmail(userEmail);
  if (!user) throw new ClientError(409, 'User not found.');

  return { user };
};
