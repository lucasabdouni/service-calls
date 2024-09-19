import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { createDepartmentHandler } from '../controllers/department/create-department';
import { deleteDepartmentHandler } from '../controllers/department/delete-department';
import { getDepartmentHandler } from '../controllers/department/get-department';
import { getDepartmentsHandler } from '../controllers/department/get-departments';
import { updateDepartmentHandler } from '../controllers/department/update-department';
import { updateDepartmentResponsibilitiesHandler } from '../controllers/department/update-responsibles-department';

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
    .get('/departments', { onRequest: [verifyJwt] }, getDepartmentsHandler);

  app.withTypeProvider().get(
    '/department/:id',
    {
      onRequest: [verifyJwt],
    },
    getDepartmentHandler,
  );

  app
    .withTypeProvider()
    .put(
      '/department/:departmentId',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateDepartmentHandler,
    );

  app
    .withTypeProvider()
    .put(
      '/department/:departmentId/responsibles',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      updateDepartmentResponsibilitiesHandler,
    );

  app
    .withTypeProvider()
    .delete(
      '/department/:departmentId/',
      { onRequest: [verifyJwt, verifyUserRole(Role.ADMIN)] },
      deleteDepartmentHandler,
    );
}
