import { GetUserMetricsUseCase } from '@/use-cases/user/get-user-metrics';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z.string({ message: 'Email is invalid' }),
});

export const getUserMetricsHandler = async (request: FastifyRequest) => {
  const { userId } = paramsSchema.parse(request.params);

  const { metrics } = await GetUserMetricsUseCase({ userId });

  return { metrics };
};
