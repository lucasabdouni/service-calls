import { ClientError } from '@/errors/client-erro';
import {
  deleteDepartment,
  findDepartment,
} from '@/repositories/department-respository';

interface DeleteDeparmentRequest {
  departmentId: string;
}

export async function DeleteDeparmentUseCase({
  departmentId,
}: DeleteDeparmentRequest) {
  const checkDepartmentExists = await findDepartment(departmentId);

  if (!checkDepartmentExists)
    throw new ClientError(409, 'Department not found.');

  await deleteDepartment(departmentId);
}
