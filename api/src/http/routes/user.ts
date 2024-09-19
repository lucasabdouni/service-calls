import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateUserRoleHandler } from '../controllers/user//update-user-role';
import { getUserByIdHandler } from '../controllers/user/get-user';
import { getServicesByUserEmailHandler } from '../controllers/user/get-user-by-email';
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
    .put(
      '/user/:id/update-departments-responsable',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateUserResponsibilitiesDepartmentHandler,
    );
}
