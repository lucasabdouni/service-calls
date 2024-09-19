import { GetServicesByUserUseCase } from '@/use-cases/get-services-by-user-id';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getServicesByUserIdHandler = async (request: FastifyRequest) => {
  const { userId } = paramsSchema.parse(request.params);

  const { services } = await GetServicesByUserUseCase({ userId });

  return { services };
};
