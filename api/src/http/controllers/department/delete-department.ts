import { DeleteDeparmentUseCase } from '@/use-cases/delete-department';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const deleteDepartmentHandler = async (request: FastifyRequest) => {
  const { departmentId } = paramsSchema.parse(request.params);

  await DeleteDeparmentUseCase({ departmentId });

  return true;
};
