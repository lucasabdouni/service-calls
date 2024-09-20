import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { createJob } from '@/repositories/job-repository';

interface CreateJobRequest {
  local: string;
  departmentId: string;
  problemDescription: string;
  priority: string;
  userId: string;
  serviceId?: string;
}

export async function CreateJobUseCase(data: CreateJobRequest) {
  const departmentDetails = await findDepartment(data.departmentId);

  if (!departmentDetails) throw new ClientError(409, 'Department not found.');

  const job = await createJob({
    local: data.local,
    department_id: data.departmentId,
    problem_description: data.problemDescription,
    priority: data.priority,
    user_id: data.userId,
    service_id: data.serviceId,
  });

  return { job, departmentDetails };
}
