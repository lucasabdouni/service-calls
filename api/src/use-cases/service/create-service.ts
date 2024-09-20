import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { createService } from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

interface CreateServiceRequest {
  name: string;
  description: string;
  executionTime: number;
  departmentId: string;
  userId: string;
  role: string;
}

export async function CreateServiceUseCase({
  name,
  description,
  executionTime,
  departmentId,
  userId,
  role,
}: CreateServiceRequest) {
  const departmentCheck = await findDepartment(departmentId);

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

  const service = await createService({
    name,
    description,
    execution_time: executionTime,
    department: {
      connect: {
        id: departmentId,
      },
    },
  });

  return { service };
}
