import { ClientError } from '@/errors/client-erro';
import {
  findDepartment,
  updateDepartmentResponsibilities,
} from '@/repositories/department-respository';

interface UpdateDepartmentReponsibilitiesRequest {
  departmentId: string;
  addUserIds?: string[];
  removeUserIds?: string[];
}

export async function UpdateDepartmentReponsibilitiesUseCase({
  departmentId,
  addUserIds = [],
  removeUserIds = [],
}: UpdateDepartmentReponsibilitiesRequest) {
  const checkDepartmentExists = await findDepartment(departmentId);

  if (!checkDepartmentExists) {
    throw new ClientError(409, 'Deparment not found.');
  }

  const department = await updateDepartmentResponsibilities(
    departmentId,
    addUserIds,
    removeUserIds,
  );

  return { department };
}
