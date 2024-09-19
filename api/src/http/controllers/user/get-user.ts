import { GetUserUseCase } from '@/use-cases/get-user';
import { FastifyRequest } from 'fastify';

export const getUserByIdHandler = async (request: FastifyRequest) => {
  const userId = request.user.sub;

  const user = await GetUserUseCase({ userId });

  return { user };
};
