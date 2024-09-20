import { ClientError } from '@/errors/client-erro';
import { findService } from '@/repositories/service-repository';

interface GetServiceRequest {
  serviceId: string;
}

export async function GetServiceUseCase({ serviceId }: GetServiceRequest) {
  const service = await findService(serviceId);

  if (!service) {
    throw new ClientError(404, 'Service not exists.');
  }

  return { service };
}
