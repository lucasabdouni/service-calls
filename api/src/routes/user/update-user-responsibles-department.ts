import { ClientError } from '@/errors/client-erro';
import {
  getUserById,
  updateUserResponsibilitiesDepartment,
} from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  id: z.string({ message: 'Id is invalid' }).uuid({ message: 'Id is invalid' }),
});

const bodySchema = z.object({
  addDepartmentsIds: z.array(z.string().uuid()).optional(),
  removeDepartmentsIds: z.array(z.string().uuid()).optional(),
});

export const updateUserResponsibilitiesDepartmentHandler = async (
  request: FastifyRequest,
) => {
  const { addDepartmentsIds, removeDepartmentsIds } = bodySchema.parse(
    request.body,
  );
  const { id } = paramsSchema.parse(request.params);

  const checkUserExists = await getUserById(id);

  if (!checkUserExists) {
    throw new ClientError(409, 'User not found.');
  }

  const user = await updateUserResponsibilitiesDepartment(
    id,
    addDepartmentsIds || [],
    removeDepartmentsIds || [],
  );

  return { user: user };
};
