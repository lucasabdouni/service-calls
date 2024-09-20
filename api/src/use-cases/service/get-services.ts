import { ClientError } from '@/errors/client-erro';
import { findServices } from '@/repositories/service-repository';

export async function GetServicesUseCase() {
  const services = await findServices();

  if (!services || services.length === 0) {
    throw new ClientError(404, 'No services found.');
  }

  return { services };
}
