import { GetJobsByUserUseCase } from '@/use-cases/job/get-jobs-by-user-id';
import { FastifyRequest } from 'fastify';

export const getJobsHandler = async (request: FastifyRequest) => {
  const userId = request.user.sub;

  const { jobs } = await GetJobsByUserUseCase({ userId });

  return jobs;
};
