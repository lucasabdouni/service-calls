import { ClientError } from '@/errors/client-erro';
import { getServiceById } from '@/repositories/service-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const getServicesByIdHandler = async (request: FastifyRequest) => {
  const { serviceId } = paramsSchema.parse(request.params);

  const service = await getServiceById(serviceId);

  if (!service) throw new ClientError(409, 'service not found.');

  return { service };
};
