import { ClientError } from '@/errors/client-erro';
import { findServices } from '@/repositories/service-repository';
import dayjs from 'dayjs';

interface GetServicesRequest {
  starts_at?: string;
  ends_at?: string;
  accomplished: boolean;
  userId: string;
}

export async function GetServicesUseCase({
  starts_at,
  ends_at,
  accomplished,
  userId,
}: GetServicesRequest) {
  const startDate = starts_at ? dayjs(starts_at).startOf('day').toDate() : null;
  const endDate = ends_at
    ? dayjs(ends_at).startOf('day').set('hour', 23).set('minute', 59).toDate()
    : null;

  if (starts_at && dayjs(startDate).isAfter(endDate)) {
    throw new ClientError(401, 'Invalid date');
  }

  const services = await findServices({
    userId,
    accomplished,
    startDate,
    endDate,
  });

  if (services.length === 0) {
    throw new ClientError(403, 'No services registered in the selected data');
  }

  return { services };
}
