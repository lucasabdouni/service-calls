import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { createDepartmentHandler } from './create-department';
import { deleteDepartmentHandler } from './delete-department';
import { getDepartmentHandler } from './get-departments';
import { getDepartmentByIdHandler } from './get-departments-by-id';
import { updateDepartmentHandler } from './update-department';
import { updateDepartmentResponsibilitiesHandler } from './update-responsibles-department';

export async function departmentRoutes(app: FastifyInstance) {
  app
    .withTypeProvider()
    .post(
      '/department',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      createDepartmentHandler,
    );

  app
    .withTypeProvider()
    .get('/departments', { onRequest: [verifyJwt] }, getDepartmentHandler);

  app.withTypeProvider().get(
    '/department/:id',
    {
      onRequest: [verifyJwt],
    },
    getDepartmentByIdHandler,
  );

  app
    .withTypeProvider()
    .put(
      '/department/:id',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateDepartmentHandler,
    );

  app
    .withTypeProvider()
    .put(
      '/department/:id/responsibles',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateDepartmentResponsibilitiesHandler,
    );

  app
    .withTypeProvider()
    .delete(
      '/department/:id/',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      deleteDepartmentHandler,
    );
}
