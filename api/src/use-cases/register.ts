import { ClientError } from '@/errors/client-erro';
import {
  createUser,
  findUserByEmail,
  findUserByRegistrationNumber,
} from '@/repositories/user-repository';
import { hash } from 'bcryptjs';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  registrationNumber: number;
  department: string;
  ramal: number;
}

export async function CreateUserUseCase(data: CreateUserRequest) {
  const verifyEmailAlready = await findUserByEmail(data.email);

  if (verifyEmailAlready)
    throw new ClientError(409, 'E-mail already registered');

  const verifyRegistrationNumerAlready = await findUserByRegistrationNumber(
    data.registrationNumber,
  );

  if (verifyRegistrationNumerAlready)
    throw new ClientError(409, 'Registration number already registered');

  const password_hash = await hash(data.password, 6);

  const user = await createUser({
    name: data.name,
    email: data.email,
    password_hash,
    registration_number: data.registrationNumber,
    department: data.department,
    ramal: data.ramal,
  });

  return { user };
}
