import { GetUserByEmailUseCase } from '@/use-cases/user/get-user-by-email';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userEmail: z.string({ message: 'Email is invalid' }),
});

export const getServicesByUserEmailHandler = async (
  request: FastifyRequest,
) => {
  const { userEmail } = paramsSchema.parse(request.params);

  const { user } = await GetUserByEmailUseCase({ email: userEmail });

  return { user };
};
