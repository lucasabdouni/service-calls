import { createDepartment } from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const bodySchema = z.object({
  name: z.string({ message: 'Name is mandatory' }),
  sigla: z
    .string({ message: 'Sigla is mandatory' })
    .min(1, { message: 'Sigla must have at least 1 characters' }),
});

export const createDepartmentHandler = async (request: FastifyRequest) => {
  const { name, sigla } = bodySchema.parse(request.body);

  const department = await createDepartment({
    name,
    sigla,
  });

  return { department: department };
};
