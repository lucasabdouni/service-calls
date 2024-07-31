import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getUserByIdHandler } from './get-user';
import { registerUserHandler } from './register-user';
import { updateUserRolesHandler } from './update-user-roles';

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/user', registerUserHandler);
  app
    .withTypeProvider()
    .get('/me', { onRequest: [verifyJwt] }, getUserByIdHandler);
  app
    .withTypeProvider()
    .put(
      '/user/update-role',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateUserRolesHandler,
    );
}
