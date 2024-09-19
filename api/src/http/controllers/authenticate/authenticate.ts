import { AuthenticateUseCase } from '@/use-cases/authenticate';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const bodySchema = z.object({
  email: z
    .string({ message: 'Email is mandatory' })
    .email({ message: 'Email invalid' }),
  password: z
    .string({ message: 'Password is mandatory' })
    .min(6, { message: 'Password must have at least 6 characters' }),
});

export const authenticateUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = bodySchema.parse(request.body);

  const { user } = await AuthenticateUseCase({ email, password });

  const token = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  );

  return { token: token };
};
