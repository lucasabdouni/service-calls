import { ClientError } from '@/errors/client-erro';
import { findUserByEmail } from '@/repositories/user-repository';
import { compare } from 'bcryptjs';
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

  const user = await findUserByEmail(email);

  if (!user) throw new ClientError(401, 'Invalid credentials');

  const doesPasswordMatchnes = await compare(password, user.password_hash);

  if (!doesPasswordMatchnes) throw new ClientError(401, 'Invalid credentials');

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
