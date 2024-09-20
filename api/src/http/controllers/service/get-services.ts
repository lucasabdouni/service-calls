import { GetServicesUseCase } from '@/use-cases/service/get-services';
import { FastifyRequest } from 'fastify';

export const getServicesHandler = async (request: FastifyRequest) => {
  const { services } = await GetServicesUseCase();

  return { services };
};
