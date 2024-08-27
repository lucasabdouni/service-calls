import { ClientError } from '@/errors/client-erro';
import {
  getDepartmentById,
  updateDepartmentResponsibilities,
} from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  id: z.string({ message: 'Id is invalid' }).uuid({ message: 'Id is invalid' }),
});

const bodySchema = z.object({
  addUserIds: z.array(z.string().uuid()).optional(),
  removeUserIds: z.array(z.string().uuid()).optional(),
});

export const updateDepartmentResponsibilitiesHandler = async (
  request: FastifyRequest,
) => {
  const { addUserIds, removeUserIds } = bodySchema.parse(request.body);
  const { id } = paramsSchema.parse(request.params);

  const checkDepartmentExists = await getDepartmentById(id);
  if (!checkDepartmentExists) {
    throw new ClientError(409, 'Deparment not found.');
  }

  const department = await updateDepartmentResponsibilities(
    id,
    addUserIds || [],
    removeUserIds || [],
  );

  return { department: department };
};
