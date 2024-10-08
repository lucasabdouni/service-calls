import { GetJobsUseCase } from '@/use-cases/job/get-jobs';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  starts_at: z.string({ message: 'Date start is invalid' }).optional(),
  ends_at: z.string({ message: 'Date end is invalid' }).optional(),
  accomplished: z
    .string()
    .optional()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'Accomplished is invalid',
    })
    .transform((val) => val === 'true')
    .default('false'),
});

export const getUserResponsableJobsHandler = async (
  request: FastifyRequest,
) => {
  const { starts_at, ends_at, accomplished } = paramsSchema.parse(
    request.query,
  );

  const userId = request.user.sub;

  const { jobs } = await GetJobsUseCase({
    starts_at,
    ends_at,
    accomplished,
    userId,
  });

  return jobs;
};
