import { DeleteServiceUseCase } from '@/use-cases/service/delete-service';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const deleteServiceHandler = async (request: FastifyRequest) => {
  const { serviceId } = paramsSchema.parse(request.params);

  await DeleteServiceUseCase({ serviceId });

  return true;
};
