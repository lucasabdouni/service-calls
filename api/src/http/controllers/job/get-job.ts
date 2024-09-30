import { GetJobUseCase } from '@/use-cases/job/get-job';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getJobHandler = async (request: FastifyRequest) => {
  const { jobId } = paramsSchema.parse(request.params);

  const { job } = await GetJobUseCase({
    jobId,
  });

  return job;
};
