import { UpdateDepartmentUseCase } from '@/use-cases/update-department';

import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

const bodySchema = z.object({
  name: z.string({ message: 'Name is mandatory' }),
  sigla: z
    .string({ message: 'Sigla is mandatory' })
    .min(1, { message: 'Sigla must have at least 1 characters' }),
});

export const updateDepartmentHandler = async (request: FastifyRequest) => {
  const { name, sigla } = bodySchema.parse(request.body);
  const { departmentId } = paramsSchema.parse(request.params);

  const { department } = await UpdateDepartmentUseCase({
    departmentId,
    name,
    sigla,
  });

  return { department: department };
};
