import { ClientError } from '@/errors/client-erro';
import {
  getServices,
  getServicesInDateRange,
} from '@/repositories/service-repository';
import { CheckDepartmentFromRoles } from '@/utils/check-department';
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
  const { role } = request.user;
  let services = [];

  const startDate = dayjs(starts_at).startOf('day').toDate();
  const endDate = dayjs(ends_at)
    .startOf('day')
    .set('hour', 23)
    .set('minute', 59)
    .toDate();

  if (starts_at && dayjs(startDate).isAfter(endDate)) {
    throw new ClientError(401, 'Invalid start date');
  }

  if (ends_at && dayjs(endDate).isAfter(new Date())) {
    throw new ClientError(401, 'Invalid end date');
  }

  const department = CheckDepartmentFromRoles(role);

  if (starts_at && ends_at) {
    services = await getServicesInDateRange({
      startDate,
      endDate,
      department,
      accomplished,
    });
  } else {
    services = await getServices({ department, accomplished });
  }

  if (services.length < 1) {
    return 'No services registered in the selected data';
  }

  return { services };
};
