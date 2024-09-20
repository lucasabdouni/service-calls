import { ClientError } from '@/errors/client-erro';
import {
  findUserByEmail,
  Role,
  updateUserRoles,
} from '@/repositories/user-repository';

interface UpdateUserRoleRequest {
  email: string;
  role: Role;
}

export async function UpdateUserRoleUseCase({
  email,
  role,
}: UpdateUserRoleRequest) {
  const verifyEmailAlready = await findUserByEmail(email);

  if (!verifyEmailAlready) throw new ClientError(409, 'User not found');

  const user = await updateUserRoles(email, role);

  return { user };
}
