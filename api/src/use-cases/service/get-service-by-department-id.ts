import { ClientError } from '@/errors/client-erro';
import { findServiceByDepartmentId } from '@/repositories/service-repository';

interface GetServiceByDepartmentRequest {
  departmentId: string;
}

export async function GetServiceByDepartmentUseCase({
  departmentId,
}: GetServiceByDepartmentRequest) {
  const service = await findServiceByDepartmentId(departmentId);

  if (!service)
    throw new ClientError(
      409,
      'There are no services registered in the department.',
    );

  return { service };
}
