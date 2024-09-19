import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { findService, updateService } from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface UpdateServiceProps {
  local?: string;
  problem?: string;
  problemDescription?: string;
  occurs_at?: Date;
  priority?: string;
  responsible_accomplish?: string;
  status?: string;
}

interface UpdateServiceRequest {
  data: UpdateServiceProps;
  serviceId: string;
  userId: string;
  role: string;
}

export async function UpdateServiceUseCase({
  data,
  serviceId,
  userId,
  role,
}: UpdateServiceRequest) {
  const checkServiceExists = await findService(serviceId);
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

  const service = await updateService({ id: serviceId, data });

  return { service };
}
