import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { confirmAccomplishedServiceHandler } from './confirm-accomplished-service';
import { createServiceHandler } from './create-service';
import { deleteServiceHandler } from './delete-service';
import { getServicesHandler } from './get-services';
import { getServicesByIdHandler } from './get-services-by-id';
import { getServicesByUserIdHandler } from './get-services-by-user-id';
import { transferDepartmentServiceHandler } from './transfer-department-service';
import { updateServiceHandler } from './update-service';

export async function serviceRoutes(app: FastifyInstance) {
  app
    .withTypeProvider()
    .post('/service', { onRequest: [verifyJwt] }, createServiceHandler);
  app.withTypeProvider().get(
    '/services',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    getServicesHandler,
  );
  app.withTypeProvider().get('/service/:serviceId', getServicesByIdHandler);

  app.withTypeProvider().put(
    '/service/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    updateServiceHandler,
  );

  app.withTypeProvider().put(
    '/transfer-service-department/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    transferDepartmentServiceHandler,
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
  app.withTypeProvider().get(
    '/accomplished/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    confirmAccomplishedServiceHandler,
  );
}
