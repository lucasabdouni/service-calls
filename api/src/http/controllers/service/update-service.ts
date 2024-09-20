import { UpdateServiceUseCase } from '@/use-cases/service/update-service';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const bodySchema = z.object({
  name: z.string({ message: 'Name is mandatory' }).optional(),
  description: z.string({ message: 'Description is mandatory' }).optional(),
  executionTime: z
    .number({ message: 'Execution Time is mandatory' })
    .optional(),
});

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Service is mandatory' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateServiceHandler = async (request: FastifyRequest) => {
  const { name, description, executionTime } = bodySchema.parse(request.body);

  const { serviceId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;
  const role = request.user.role;

  const { service } = await UpdateServiceUseCase({
    serviceId,
    name,
    description,
    executionTime,
    userId,
    role,
  });

  return { service: service };
};
