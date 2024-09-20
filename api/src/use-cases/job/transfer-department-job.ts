import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import {
  findJobById,
  updateJobDepartment,
} from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface TransferDepartmentJobRequest {
  departmentId: string;
  jobId: string;
  userId: string;
  role: string;
}

export async function TransferDepartmentJobUseCase({
  departmentId,
  jobId,
  userId,
  role,
}: TransferDepartmentJobRequest) {
  const checkJobExists = await findJobById(jobId);

  if (!checkJobExists) {
    throw new ClientError(409, 'Job not found.');
  }

  if (departmentId === checkJobExists.department.id) {
    throw new ClientError(409, 'Job already belongs to this department.');
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

  const departmentDetails = await findDepartment(departmentId);

  if (!departmentDetails) {
    throw new ClientError(409, 'New department not found.');
  }

  const job = await updateJobDepartment({
    id: jobId,
    data: {
      department_id: departmentId,
    },
  });

  const requesterJobEmail = job.user.email;

  return { job, departmentDetails, requesterJobEmail };
}
