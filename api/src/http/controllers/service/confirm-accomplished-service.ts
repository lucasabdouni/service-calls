import { ConfirmAccomplishedServiceUseCase } from '@/use-cases/confirm-accomplished-service';
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

  await ConfirmAccomplishedServiceUseCase({ serviceId, userId, role });

  return true;
};
