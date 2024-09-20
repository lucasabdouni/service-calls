import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { findJobById, updateJobService } from '@/repositories/job-repository';
import { Role } from '@/repositories/user-repository';

interface UpdateServiceJobRequest {
  serviceId: string;
  jobId: string;
  userId: string;
  role: string;
}

export async function UpdateServiceJobUseCase({
  serviceId,
  jobId,
  userId,
  role,
}: UpdateServiceJobRequest) {
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

  const serviceDetails = await findDepartment(serviceId);

  if (!serviceDetails) {
    throw new ClientError(409, 'New service not found.');
  }

  const job = await updateJobService({
    id: jobId,
    serviceId,
  });

  return { job };
}
