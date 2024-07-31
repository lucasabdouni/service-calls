import { ClientError } from '@/errors/client-erro';
import {
  getServices,
  getServicesInDateRange,
} from '@/repositories/service-repository';
import dayjs from 'dayjs';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  starts_at: z.string({ message: 'Date start is invalid' }).optional(),
  ends_at: z.string({ message: 'Date end is invalid' }).optional(),
});

export const getServicesHandler = async (request: FastifyRequest) => {
  const { starts_at, ends_at } = paramsSchema.parse(request.query);
  let services = [];

  const startDate = dayjs(starts_at).startOf('day').toDate();
  const endDate = dayjs(ends_at)
    .startOf('day')
    .set('hour', 23)
    .set('minute', 59)
    .toDate();

  console.log(startDate, endDate);

  if (dayjs(startDate).isAfter(endDate)) {
    throw new ClientError(401, 'Invalid start date');
  }

  if (endDate && dayjs(endDate).isAfter(new Date())) {
    throw new ClientError(401, 'Invalid end date');
  }

  if (startDate && endDate) {
    console.log('buscou pela data de inicio e fim');
    services = await getServicesInDateRange({ startDate, endDate });
  } else {
    console.log('buscou pela data de 30 dias');
    services = await getServices();
  }

  if (services.length < 1) {
    return 'Is not a service registered in selected data';
  }

  return { services };
};
