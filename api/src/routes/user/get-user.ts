import { ClientError } from '@/errors/client-erro';
import { getUserById } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z
    .string({ message: 'ID is invalid' })
    .uuid({ message: 'ID is invalid' }),
});

export const getUserByIdHandler = async (request: FastifyRequest) => {
  const { userId } = paramsSchema.parse(request.params);

  console.log(userId);

  const user = await getUserById(userId);

  if (!user) throw new ClientError('User not found.');

  return { user };
};
