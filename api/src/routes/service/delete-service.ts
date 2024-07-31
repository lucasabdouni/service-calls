import { ClientError } from '@/errors/client-erro';
import {
  deleteService,
  getServiceById,
} from '@/repositories/service-repository';
import { Role, getUserById } from '@/repositories/user-repository';
import { CheckDepartmentFromRoles } from '@/utils/check-department';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const deleteServiceHandler = async (request: FastifyRequest) => {
  console.log(request.params);
  const { serviceId } = paramsSchema.parse(request.params);

  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, 'user not found.');

  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) throw new ClientError(409, 'service not found.');

  const departmentCheck = CheckDepartmentFromRoles(request.user.role);

  if (user.role !== Role.ADMIN) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  if (
    (user.role !== Role.ADMIN && user.department !== departmentCheck) ||
    user.id !== checkServiceExists.user_id
  ) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  await deleteService(checkServiceExists.id);

  return true;
};
