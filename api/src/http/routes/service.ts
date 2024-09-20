import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { createServiceHandler } from '../controllers/service/create-service';
import { deleteServiceHandler } from '../controllers/service/delete-service';
import { getServiceHandler } from '../controllers/service/get-service';
import { getServiceByDepartmentHandler } from '../controllers/service/get-service-by-departments';
import { getServicesHandler } from '../controllers/service/get-services';
import { updateServiceHandler } from '../controllers/service/update-service';

export async function serviceRoutes(app: FastifyInstance) {
  app.withTypeProvider().post(
    '/service',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    createServiceHandler,
  );

  app
    .withTypeProvider()
    .get('/services', { onRequest: [verifyJwt] }, getServicesHandler);

  app.withTypeProvider().get(
    '/service/:serviceId',
    {
      onRequest: [verifyJwt],
    },
    getServiceHandler,
  );

  app.withTypeProvider().get(
    '/service-by-department/:departmentId',
    {
      onRequest: [verifyJwt],
    },
    getServiceByDepartmentHandler,
  );

  app.withTypeProvider().put(
    '/service/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    updateServiceHandler,
  );

  app.withTypeProvider().delete(
    '/service/:serviceId/',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    deleteServiceHandler,
  );
}
