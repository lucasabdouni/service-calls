import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  confirmAccomplisheJob,
  findJobById,
} from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface ConfirmAccomplishedJobRequest {
  jobId: string;
  userId: string;
  role: string;
}

export async function ConfirmAccomplishedJobUseCase({
  jobId,
  userId,
  role,
}: ConfirmAccomplishedJobRequest) {
  const findJob = await findJobById(jobId);

  if (!findJob) {
    throw new ClientError(409, 'Request not found.');
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
  const elapsedTime = findJob.elapsed_time + (current_at - findJob.start_time);

  const job = await confirmAccomplisheJob({
    id: jobId,
    data: {
      running: false,
      accomplished: true,
      status: 'Finalizado',
      elapsed_time: elapsedTime,
    },
  });

  return { job };
}
