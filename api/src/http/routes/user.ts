import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateUserRoleHandler } from '../controllers/user//update-user-role';
import { getUserByIdHandler } from '../controllers/user/get-user';
import { getServicesByUserEmailHandler } from '../controllers/user/get-user-by-email';
import { getUserMetricsHandler } from '../controllers/user/get-user-metrics';
import { registerHandler } from '../controllers/user/register';
import { updateUserResponsibilitiesDepartmentHandler } from '../controllers/user/update-user-responsibles-department';

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/user', registerHandler);
  app
    .withTypeProvider()
    .get('/me', { onRequest: [verifyJwt] }, getUserByIdHandler);
  app
    .withTypeProvider()
    .put(
      '/user/update-role',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateUserRoleHandler,
    );

  app
    .withTypeProvider()
    .get(
      '/user/:userEmail',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      getServicesByUserEmailHandler,
    );

  app
    .withTypeProvider()
    .get('/user-metrics', { onRequest: [verifyJwt] }, getUserMetricsHandler);

  app
    .withTypeProvider()
    .put(
      '/update-departments-responsable/:userId',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateUserResponsibilitiesDepartmentHandler,
    );
}
