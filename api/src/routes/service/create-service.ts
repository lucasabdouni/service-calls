import { ClientError } from '@/errors/client-erro';
import { createService } from '@/repositories/service-repository';
import { getUserById } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const PriorityEnum = z.enum(['baixa', 'media', 'alta']);

const bodySchema = z.object({
  department: z
    .string({ message: 'Department is mandatory' })
    .min(3, 'Department must have at least 3 characters'),
  local: z.string({ message: 'Local is mandatory' }),
  problem: z.string({ message: 'Problem is mandatory' }),
  problem_description: z.string({
    message: 'Description of the problem pro is mandatory',
  }),
  priority: PriorityEnum,
});

export const createServiceHandler = async (request: FastifyRequest) => {
  const { department, local, problem, problem_description, priority } =
    bodySchema.parse(request.body);

  const user = await getUserById(request.user.sub);

  if (!user) throw new ClientError(409, 'User not found.');

  const data = {
    department,
    local,
    problem,
    problem_description,
    priority,
    user_id: user.id,
  };

  const service = await createService(data);

  return { service };
};
