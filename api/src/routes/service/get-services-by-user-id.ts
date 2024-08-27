import { ClientError } from '@/errors/client-erro';
import { getServiceByUserId } from '@/repositories/service-repository';
import { getUserById } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getServicesByUserIdHandler = async (request: FastifyRequest) => {
  const { userId } = paramsSchema.parse(request.params);

  const user = await getUserById(userId);
  if (!user) throw new ClientError(409, 'User not found.');

  const services = await getServiceByUserId(user.id);
  if (!services) {
    return 'No services registered';
  }

  return { services };
};
