import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  findJobById,
  pauseJobInExecution,
} from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface PauseExecutionOfJobRequest {
  jobId: string;
  userId: string;
  role: string;
}

export async function PauseExecutionOfJobUseCase({
  jobId,
  userId,
  role,
}: PauseExecutionOfJobRequest) {
  const findJob = await findJobById(jobId);

  if (!findJob) {
    throw new ClientError(409, 'Job not found.');
  }

  const departmentCheck = await findDepartment(findJob.department.id);

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

  const status = 'Pausado';
  const elapsedTime = findJob.elapsed_time + (current_at - findJob.start_time);

  const job = await pauseJobInExecution({
    id: findJob.id,
    elapsedTime,
    status,
    responsableId: userId,
  });

  return { job };
}
