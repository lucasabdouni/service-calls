import { ClientError } from '@/errors/client-erro';
import { findDepartment } from '@/repositories/department-respository';
import { createService } from '@/repositories/service-repository';

interface CreateServiceRequest {
  local: string;
  problem: string;
  departmentId: string;
  problemDescription: string;
  priority: string;
  userId: string;
}

export async function CreateServiceUseCase(data: CreateServiceRequest) {
  const departmentDetails = await findDepartment(data.departmentId);

  if (!departmentDetails) throw new ClientError(409, 'Department not found.');

  const service = await createService({
    local: data.local,
    department_id: data.departmentId,
    problem_description: data.problemDescription,
    priority: data.priority,
    problem: data.problem,
    user_id: data.userId,
  });

  return { service, departmentDetails };
}
