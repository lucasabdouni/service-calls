import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { createServiceHandler } from './create-service';
import { deleteServiceHandler } from './delete-service';
import { getServicesHandler } from './get-services';
import { getServicesByIdHandler } from './get-services-by-id';
import { getServicesByUserIdHandler } from './get-services-by-user-id';
import { updateServiceHandler } from './update-service';

export async function serviceRoutes(app: FastifyInstance) {
  app
    .withTypeProvider()
    .post('/service', { onRequest: [verifyJwt] }, createServiceHandler);
  app.withTypeProvider().get(
    '/services',
    {
      onRequest: [
        verifyJwt,
        verifyUserRole(
          Role.ADMIN,
          Role.ELECTRICAL_RESPONSIBLE,
          Role.MECANIC_RESPONSIBLE,
          Role.SG_RESPONSIBLE,
          Role.TI_RESPONSIBLE,
        ),
      ],
    },
    getServicesHandler,
  );
  app
    .withTypeProvider()
    .get(
      '/service/:serviceId',
      { onRequest: [verifyJwt] },
      getServicesByIdHandler,
    );
  app.withTypeProvider().put(
    '/service/:serviceId',
    {
      onRequest: [
        verifyJwt,
        verifyUserRole(
          Role.ADMIN,
          Role.ELECTRICAL_RESPONSIBLE,
          Role.MECANIC_RESPONSIBLE,
          Role.SG_RESPONSIBLE,
          Role.TI_RESPONSIBLE,
        ),
      ],
    },
    updateServiceHandler,
  );
  app.withTypeProvider().get(
    '/services/user/:userId',
    {
      onRequest: [verifyJwt],
    },
    getServicesByUserIdHandler,
  );
  app.withTypeProvider().delete(
    '/service/:serviceId',
    {
      onRequest: [verifyJwt],
    },
    deleteServiceHandler,
  );
}
