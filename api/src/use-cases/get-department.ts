import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';

interface GetDepartmentRequest {
  departmentId: string;
}

export async function GetDepartmentUseCase({
  departmentId,
}: GetDepartmentRequest) {
  const department = await findDepartment(departmentId);

  if (!department) throw new ClientError(409, 'Department not found.');

  return { department };
}
