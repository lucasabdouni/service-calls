import { ClientError } from '@/errors/client-erro';
import {
  createUser,
  findUserByEmail,
  findUserByRegistrationNumber,
} from '@/repositories/user-repository';
import { hash } from 'bcryptjs';
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
  registration_number: z.number({ message: 'Registration is mandatory' }),
  department: z
    .string({ message: 'Department is mandatory' })
    .min(3, 'Department must have at least 3 characters'),
  ramal: z.number({ message: 'Ramal is mandatory' }),
});

export const registerUserHandler = async (request: FastifyRequest) => {
  const { name, email, password, department, ramal, registration_number } =
    bodySchema.parse(request.body);

  const verifyEmailAlready = await findUserByEmail(email);

  if (verifyEmailAlready)
    throw new ClientError(409, 'E-mail already registered');

  const verifyRegistrationNumerAlready =
    await findUserByRegistrationNumber(registration_number);

  if (verifyRegistrationNumerAlready)
    throw new ClientError(409, 'Registration number already registered');

  const password_hash = await hash(password, 6);

  const user = await createUser({
    name,
    email,
    password_hash,
    registration_number,
    department,
    ramal,
  });

  return { user: user.id };
};
