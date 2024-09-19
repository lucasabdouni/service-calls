import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  confirmAccomplisheService,
  findServiceById,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface ConfirmAccomplishedServiceRequest {
  serviceId: string;
  userId: string;
  role: string;
}

export async function ConfirmAccomplishedServiceUseCase({
  serviceId,
  userId,
  role,
}: ConfirmAccomplishedServiceRequest) {
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

  await confirmAccomplisheService({
    id: serviceId,
    data: {
      accomplished: true,
      status: 'Finalizado',
    },
  });

  return true;
}
