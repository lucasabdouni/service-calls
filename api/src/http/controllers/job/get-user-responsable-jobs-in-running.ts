import { GetJobsInRunningByUserResponsableDepartmentsUseCase } from '@/use-cases/job/get-jobs-in-running';
import { FastifyRequest } from 'fastify';

export const getJobsInRunningByUserResponsableDepartmentsHandler = async (
  request: FastifyRequest,
) => {
  const userId = request.user.sub;

  const { jobs } = await GetJobsInRunningByUserResponsableDepartmentsUseCase({
    userId,
  });

  return jobs;
};
