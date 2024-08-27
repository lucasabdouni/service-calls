import { ClientError } from '@/errors/client-erro';
import { getDepartmentById } from '@/repositories/department-respository';
import {
  getServiceById,
  updateService,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string().optional(),
  problem: z.string().optional(),
  problem_description: z.string().optional(),
  priority: PriorityEnum.optional(),
  occurs_at: z.coerce.date().optional(),
  responsible_accomplish: z.string().optional(),
  status: z.string().optional(),
});

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateServiceHandler = async (request: FastifyRequest) => {
  const data = bodySchema.parse(request.body);
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

  const service = await updateService({ id: serviceId, data });

  return { service: service };
};
