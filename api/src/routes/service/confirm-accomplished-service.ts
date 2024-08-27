import { ClientError } from '@/errors/client-erro';
import { getDepartmentById } from '@/repositories/department-respository';
import {
  confirmAccomplisheService,
  getServiceById,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';
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
  const userId = request.user.sub;

  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  const departmentCheck = await getDepartmentById(
    checkServiceExists.department.id,
  );

  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
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
