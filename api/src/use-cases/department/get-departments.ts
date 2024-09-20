import { ClientError } from '@/errors/client-erro';
import { findDepartments } from '@/repositories/department-respository';

export async function GetDepartmentsUseCase() {
  const departments = await findDepartments();

  if (!departments) {
    throw new ClientError(409, 'No exists departments.');
  }

  return { departments };
}
