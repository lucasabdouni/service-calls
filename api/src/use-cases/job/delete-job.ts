import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { deleteJob, findJobById } from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface DeleteJobRequest {
  jobId: string;
  userId: string;
  role: string;
}

export async function DeleteJobUseCase({
  jobId,
  userId,
  role,
}: DeleteJobRequest) {
  const checkJobExists = await findJobById(jobId);
  if (!checkJobExists) {
    throw new ClientError(409, 'Job not found.');
  }

  const departmentCheck = await findDepartment(checkJobExists.department.id);

  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
      'User not authorized to update this department.',
    );
  }

  const job = await deleteJob(checkJobExists.id);

  return { job };
}
