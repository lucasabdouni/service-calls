import { GetUserMetricsUseCase } from '@/use-cases/user/get-user-metrics';
import { FastifyRequest } from 'fastify';

export const getUserMetricsHandler = async (request: FastifyRequest) => {
  const userId = request.user.sub;

  const { metrics } = await GetUserMetricsUseCase({ userId });

  return metrics;
};
