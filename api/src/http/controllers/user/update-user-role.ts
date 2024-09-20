import { Role } from '@/repositories/user-repository';
import { UpdateUserRoleUseCase } from '@/use-cases/user/update-user-role';
import { FastifyRequest } from 'fastify';
import z from 'zod';

const RoleEnumSchema = z.enum([Role.ADMIN, Role.RESPONSIBLE, Role.MEMBER]);

const bodySchema = z.object({
  email: z
    .string({ message: 'Email is mandatory' })
    .email({ message: 'Email invalid' }),
  role: RoleEnumSchema,
});

export const updateUserRoleHandler = async (request: FastifyRequest) => {
  const { email, role } = bodySchema.parse(request.body);

  const { user } = await UpdateUserRoleUseCase({ email, role });

  return { user };
};
