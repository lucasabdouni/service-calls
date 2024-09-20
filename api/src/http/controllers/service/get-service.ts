import { GetServiceUseCase } from '@/use-cases/service/get-service';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getServiceHandler = async (request: FastifyRequest) => {
  const { serviceId } = paramsSchema.parse(request.params);

  const { service } = await GetServiceUseCase({ serviceId });

  return { service };
};
