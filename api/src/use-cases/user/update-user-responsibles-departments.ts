import { ClientError } from '@/errors/client-erro';
import {
  findUserById,
  updateUserResponsibilitiesDepartment,
} from '@/repositories/user-repository';

interface UpdateUserResponsiblesDepartmentRequest {
  userId: string;
  addDepartmentsIds?: string[];
  removeDepartmentsIds?: string[];
}

export async function UpdateUserResponsiblesDepartmentUseCase({
  userId,
  addDepartmentsIds = [],
  removeDepartmentsIds = [],
}: UpdateUserResponsiblesDepartmentRequest) {
  const checkUserExists = await findUserById(userId);

  if (!checkUserExists) {
    throw new ClientError(409, 'User not found.');
  }

  const user = await updateUserResponsibilitiesDepartment(
    userId,
    addDepartmentsIds,
    removeDepartmentsIds,
  );

  return { user };
}
