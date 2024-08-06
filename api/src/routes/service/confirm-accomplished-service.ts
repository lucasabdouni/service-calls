import { ClientError } from '@/errors/client-erro';
import {
  confirmAccomplisheService,
  getServiceById,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';
import { CheckDepartmentFromRoles } from '@/utils/check-department';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const confirmAccomplishedServiceHandler = async (
  request: FastifyRequest,
) => {
  const { serviceId } = paramsSchema.parse(request.params);
  const { role } = request.user;

  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  const departmentCheck = CheckDepartmentFromRoles(role);
  if (role !== Role.ADMIN) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  if (
    role !== Role.ADMIN &&
    checkServiceExists.department !== departmentCheck
  ) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  const service = await confirmAccomplisheService({
    id: serviceId,
    data: {
      accomplished: true,
      status: 'Finalizado',
    },
  });

  return { service };
};
