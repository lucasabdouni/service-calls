import { CreateServiceUseCase } from '@/use-cases/service/create-service';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const bodySchema = z.object({
  name: z.string({ message: 'Name is mandatory' }),
  description: z.string({ message: 'Description is mandatory' }),
  executionTime: z.number({ message: 'Execution Time is mandatory' }),
  departmentId: z
    .string({ message: 'Id is mandatory' })
    .uuid({ message: 'Id is invalid' }),
});

export const createServiceHandler = async (request: FastifyRequest) => {
  const { name, description, executionTime, departmentId } = bodySchema.parse(
    request.body,
  );

  const userId = request.user.sub;
  const role = request.user.role;

  const { service } = await CreateServiceUseCase({
    name,
    description,
    executionTime,
    departmentId,
    userId,
    role,
  });

  return { service: service };
};
