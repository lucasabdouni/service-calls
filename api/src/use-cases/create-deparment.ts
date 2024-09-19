import { createDepartment } from '@/repositories/department-respository';

interface CreateDeparmentRequest {
  name: string;
  sigla: string;
}

export async function CreateDeparmentUseCase({
  name,
  sigla,
}: CreateDeparmentRequest) {
  const department = await createDepartment({
    name,
    sigla,
  });

  return { department };
}
