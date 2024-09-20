import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { findService, updateService } from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface UpdateServiceRequest {
  serviceId: string;
  name?: string;
  description?: string;
  executionTime?: number;
  userId: string;
  role: string;
}

export async function UpdateServiceUseCase({
  serviceId,
  name,
  description,
  executionTime,
  userId,
  role,
}: UpdateServiceRequest) {
  const serviceCheck = await findService(serviceId);

  if (!serviceCheck) {
    throw new ClientError(409, 'Service not found.');
  }

  const departmentCheck = await findDepartment(serviceCheck.department_id);

  if (!departmentCheck) {
    throw new ClientError(409, 'Department not found.');
  }

  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
      'User not authorized to update this department.',
    );
  }

  const service = await updateService({
    id: serviceId,
    data: { name, description, execution_time: executionTime },
  });

  return { service };
}
