import { ClientError } from '@/errors/client-erro';
import { deleteService, findService } from '@/repositories/service-repository';

interface DeleteServiceRequest {
  serviceId: string;
}

export async function DeleteServiceUseCase({
  serviceId,
}: DeleteServiceRequest) {
  const checkServiceExists = await findService(serviceId);

  if (!checkServiceExists) throw new ClientError(409, 'Service not found.');

  await deleteService(serviceId);
}
