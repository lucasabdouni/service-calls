import { UpdateUserResponsiblesDepartmentUseCase } from '@/use-cases/update-user-responsibles-departments';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
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
  const { userId } = paramsSchema.parse(request.params);

  const user = await UpdateUserResponsiblesDepartmentUseCase({
    userId,
    addDepartmentsIds,
    removeDepartmentsIds,
  });

  return { user: user };
};
