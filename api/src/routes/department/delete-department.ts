import { ClientError } from '@/errors/client-erro';
import {
  deleteDepartment,
  getDepartmentById,
} from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const deleteDepartmentHandler = async (request: FastifyRequest) => {
  const { departmentId } = paramsSchema.parse(request.params);

  const checkDepartmentExists = await getDepartmentById(departmentId);
  if (!checkDepartmentExists) throw new ClientError(409, 'service not found.');

  await deleteDepartment(departmentId);

  return true;
};
