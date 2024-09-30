import { GetDepartmentUseCase } from '@/use-cases/department/get-department';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getDepartmentHandler = async (request: FastifyRequest) => {
  const { departmentId } = paramsSchema.parse(request.params);

  const { department } = await GetDepartmentUseCase({ departmentId });

  return department;
};
