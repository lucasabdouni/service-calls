import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  findJobById,
  updateResponsableService,
} from '@/repositories/job-repository';
import { findUserById, Role } from '@/repositories/user-repository';

interface UpdateResponsableJobRequest {
  responsableId: string;
  jobId: string;
  userId: string;
  role: string;
}

export async function UpdateResponsableJobUseCase({
  responsableId,
  jobId,
  userId,
  role,
}: UpdateResponsableJobRequest) {
  const checkJobExists = await findJobById(jobId);

  if (!checkJobExists) {
    throw new ClientError(409, 'Job not found.');
  }

  const departmentCheck = await findDepartment(checkJobExists.department.id);

  const checkUserIsResponsableDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsableDepartment) {
    throw new ClientError(
      403,
      'User not authorized to update this department.',
    );
  }

  const findResponsable = await findUserById(responsableId);

  if (!findResponsable) {
    throw new ClientError(409, 'New user responsable not found.');
  }

  const job = await updateResponsableService({
    id: jobId,
    responsableId,
  });

  return { job };
}
