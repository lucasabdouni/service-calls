import { ClientError } from '@/errors/client-erro';
import { getServices } from '@/repositories/service-repository';
import dayjs from 'dayjs';
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

export const getServicesHandler = async (request: FastifyRequest) => {
  const { starts_at, ends_at, accomplished } = paramsSchema.parse(
    request.query,
  );

  const userId = request.user.sub;

  const startDate = starts_at ? dayjs(starts_at).startOf('day').toDate() : null;
  const endDate = ends_at
    ? dayjs(ends_at).startOf('day').set('hour', 23).set('minute', 59).toDate()
    : null;

  if (starts_at && dayjs(startDate).isAfter(endDate)) {
    throw new ClientError(401, 'Invalid date');
  }

  const services = await getServices({
    userId,
    accomplished,
    startDate,
    endDate,
  });

  if (services.length < 1) {
    return 'No services registered in the selected data';
  }

  return { services };
};
