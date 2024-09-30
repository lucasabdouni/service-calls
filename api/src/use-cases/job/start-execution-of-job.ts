import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { findJobById, startJob } from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface StartExecutionOfJobRequest {
  jobId: string;
  userId: string;
  role: string;
}

export async function StartExecutionOfJobUseCase({
  jobId,
  userId,
  role,
}: StartExecutionOfJobRequest) {
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

  const current_at = Date.now();

  const startTime = current_at;

  const job = await startJob({ id: jobId, startTime, responsableId: userId });

  return { job };
}
