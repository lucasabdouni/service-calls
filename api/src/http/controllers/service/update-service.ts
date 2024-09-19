import { UpdateServiceUseCase } from '@/use-cases/update-service';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string().optional(),
  problem: z.string().optional(),
  problemDescription: z.string().optional(),
  priority: PriorityEnum.optional(),
  occurs_at: z.coerce.date().optional(),
  responsible_accomplish: z.string().optional(),
  status: z.string().optional(),
});

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateServiceHandler = async (request: FastifyRequest) => {
  const data = bodySchema.parse(request.body);
  const { serviceId } = paramsSchema.parse(request.params);
  const { role } = request.user;
  const userId = request.user.sub;

  const { service } = await UpdateServiceUseCase({
    data,
    serviceId,
    userId,
    role,
  });

  return { service: service };
};
