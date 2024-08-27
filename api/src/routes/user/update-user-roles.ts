import { ClientError } from '@/errors/client-erro';
import {
  Role,
  findUserByEmail,
  updateUserRoles,
} from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const RoleEnumSchema = z.enum([Role.ADMIN, Role.RESPONSIBLE, Role.MEMBER]);

const bodySchema = z.object({
  email: z
    .string({ message: 'Email is mandatory' })
    .email({ message: 'Email invalid' }),
  role: RoleEnumSchema,
});

export const updateUserRolesHandler = async (request: FastifyRequest) => {
  const { email, role } = bodySchema.parse(request.body);

  const verifyEmailAlready = await findUserByEmail(email);

  if (!verifyEmailAlready) throw new ClientError(409, 'User not found');

  const user = await updateUserRoles(email, role);

  return { user: user.id };
};
