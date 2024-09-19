import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  findService,
  updateServiceDepartment,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface TransferDepartmentServiceRequest {
  departmentId: string;
  serviceId: string;
  userId: string;
  role: string;
}

export async function TransferDepartmentServiceUseCase({
  departmentId,
  serviceId,
  userId,
  role,
}: TransferDepartmentServiceRequest) {
  const checkServiceExists = await findService(serviceId);

  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  if (departmentId === checkServiceExists.department.id) {
    throw new ClientError(409, 'Service already belongs to this department.');
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

  const departmentDetails = await findDepartment(departmentId);

  if (!departmentDetails) {
    throw new ClientError(409, 'New department not found.');
  }

  const service = await updateServiceDepartment({
    id: serviceId,
    data: {
      department_id: departmentId,
    },
  });

  const requesterServiceEmail = service.user.email;

  return { service, departmentDetails, requesterServiceEmail };
}
