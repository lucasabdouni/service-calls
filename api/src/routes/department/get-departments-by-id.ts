import { ClientError } from '@/errors/client-erro';
import { getDepartmentById } from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  id: z.string({ message: 'Id is invalid' }).uuid({ message: 'Id is invalid' }),
});

export const getDepartmentByIdHandler = async (request: FastifyRequest) => {
  const { id } = paramsSchema.parse(request.params);

  const department = await getDepartmentById(id);
  if (!department) throw new ClientError(409, 'Department not found.');

  return { department };
};
