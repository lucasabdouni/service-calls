import { GetJobsByUserUseCase } from '@/use-cases/job/get-jobs-by-user-id';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  userId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getJobsByUserIdHandler = async (request: FastifyRequest) => {
  const { userId } = paramsSchema.parse(request.params);

  const { jobs } = await GetJobsByUserUseCase({ userId });

  return jobs;
};
