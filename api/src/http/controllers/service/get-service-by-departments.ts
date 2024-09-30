import { GetServiceByDepartmentUseCase } from '@/use-cases/service/get-service-by-department-id';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getServiceByDepartmentHandler = async (
  request: FastifyRequest,
) => {
  const { departmentId } = paramsSchema.parse(request.params);

  const { service } = await GetServiceByDepartmentUseCase({ departmentId });

  return service;
};
