import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { findJobById, updateJob } from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface UpdateJobProps {
  local?: string;
  problem?: string;
  problemDescription?: string;
  occurs_at?: Date;
  priority?: string;
  status?: string;
}

interface UpdateJobRequest {
  data: UpdateJobProps;
  jobId: string;
  userId: string;
  role: string;
}

export async function UpdateJobUseCase({
  data,
  jobId,
  userId,
  role,
}: UpdateJobRequest) {
  const checkJobExists = await findJobById(jobId);
  if (!checkJobExists) {
    throw new ClientError(409, 'Job not found.');
  }

  const departmentCheck = await findDepartment(checkJobExists.department.id);

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

  const job = await updateJob({
    id: jobId,
    data: {
      ...data,
      responsable: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return { job };
}