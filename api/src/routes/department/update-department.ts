import { ClientError } from '@/errors/client-erro';
import {
  getDepartmentById,
  updateDepartment,
} from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  id: z.string({ message: 'Id is invalid' }).uuid({ message: 'Id is invalid' }),
});

const bodySchema = z.object({
  name: z.string({ message: 'Name is mandatory' }),
  sigla: z
    .string({ message: 'Sigla is mandatory' })
    .min(1, { message: 'Sigla must have at least 1 characters' }),
});

export const updateDepartmentHandler = async (request: FastifyRequest) => {
  const { name, sigla } = bodySchema.parse(request.body);
  const { id } = paramsSchema.parse(request.params);

  const checkDepartmentExists = await getDepartmentById(id);
  if (!checkDepartmentExists) {
    throw new ClientError(409, 'Deparment not found.');
  }

  const department = await updateDepartment({
    id,
    data: {
      name,
      sigla,
    },
  });

  return { department: department };
};
