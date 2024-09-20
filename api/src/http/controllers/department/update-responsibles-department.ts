import { UpdateDepartmentReponsibilitiesUseCase } from '@/use-cases/department/update-responsibles-department';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  departmentId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

const bodySchema = z.object({
  addUserIds: z.array(z.string().uuid()).optional(),
  removeUserIds: z.array(z.string().uuid()).optional(),
});

export const updateDepartmentResponsibilitiesHandler = async (
  request: FastifyRequest,
) => {
  const { addUserIds, removeUserIds } = bodySchema.parse(request.body);
  const { departmentId } = paramsSchema.parse(request.params);

  const { department } = await UpdateDepartmentReponsibilitiesUseCase({
    departmentId,
    addUserIds,
    removeUserIds,
  });
  return { department: department };
};
