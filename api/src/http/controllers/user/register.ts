import { CreateUserUseCase } from '@/use-cases/register';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const bodySchema = z.object({
  name: z
    .string({ message: 'Name is mandatory' })
    .min(3, { message: 'Name must have at least 3 characters' }),
  email: z
    .string({ message: 'Email is mandatory' })
    .email({ message: 'Email invalid' }),
  password: z
    .string({ message: 'Password is mandatory' })
    .min(6, { message: 'Password must have at least 6 characters' }),
  registrationNumber: z.number({ message: 'Registration is mandatory' }),
  department: z
    .string({ message: 'Department is mandatory' })
    .min(3, 'Department must have at least 3 characters'),
  ramal: z.number({ message: 'Ramal is mandatory' }),
});

export const registerHandler = async (request: FastifyRequest) => {
  const data = bodySchema.parse(request.body);

  const { user } = await CreateUserUseCase(data);

  return { user: user.id };
};
