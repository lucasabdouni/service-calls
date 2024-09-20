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
  const checkRequestExists = await findJobById(jobId);

  if (!checkRequestExists) {
    throw new ClientError(409, 'Request not found.');
  }

  const departmentCheck = await findDepartment(
    checkRequestExists.department.id,
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

  const job = await confirmAccomplisheJob({
    id: jobId,
    data: {
      accomplished: true,
      status: 'Finalizado',
    },
  });

  return { job };
}
