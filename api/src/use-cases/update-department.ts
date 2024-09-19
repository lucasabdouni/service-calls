import { ClientError } from '@/errors/client-erro';
import {
  findDepartment,
  updateDepartment,
} from '@/repositories/department-respository';

interface UpdateDepartmentRequest {
  departmentId: string;
  name: string;
  sigla: string;
}

export async function UpdateDepartmentUseCase({
  departmentId,
  name,
  sigla,
}: UpdateDepartmentRequest) {
  const checkDepartmentExists = await findDepartment(departmentId);

  if (!checkDepartmentExists) {
    throw new ClientError(409, 'Deparment not found.');
  }

  const department = await updateDepartment({
    id: departmentId,
    data: {
      name,
      sigla,
    },
  });

  return { department };
}
