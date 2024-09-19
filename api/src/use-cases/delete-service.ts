import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  deleteService,
  findServiceById,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface DeleteServiceRequest {
  serviceId: string;
  userId: string;
  role: string;
}

export async function DeleteServiceUseCase({
  serviceId,
  userId,
  role,
}: DeleteServiceRequest) {
  const checkServiceExists = await findServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  const departmentCheck = await findDepartment(
    checkServiceExists.department.id,
  );

  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
      'User not authorized to update this department.',
    );
  }

  await deleteService(checkServiceExists.id);
}
