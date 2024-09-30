import { verifyJwt } from '@/middlewares/verify-jwt';
import { verifyUserRole } from '@/middlewares/verify-user-role';
import { Role } from '@/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { confirmAccomplishedJobHandler } from '../controllers/job/confirm-accomplished-job';
import { createJobHandler } from '../controllers/job/create-job';
import { deleteJobHandler } from '../controllers/job/delete-job-request';
import { getJobHandler } from '../controllers/job/get-job';
import { getJobsHandler } from '../controllers/job/get-jobs';
import { getJobsByUserIdHandler } from '../controllers/job/get-jobs-by-user-id';
import { getUserResponsableJobsHandler } from '../controllers/job/get-user-responsable-jobs';
import { getJobsInRunningByUserResponsableDepartmentsHandler } from '../controllers/job/get-user-responsable-jobs-in-running';
import { startJobHandler } from '../controllers/job/start-job';
import { stopJobHandler } from '../controllers/job/stop-job';
import { transferDepartmentJobHandler } from '../controllers/job/transfer-department-job';
import { updateJobHandler } from '../controllers/job/update-job';
import { updateResponsableJobHandler } from '../controllers/job/update-responsable-job';
import { updateServiceJobHandler } from '../controllers/job/update-service-job';

export async function jobRoutes(app: FastifyInstance) {
  app
    .withTypeProvider()
    .post('/job', { onRequest: [verifyJwt] }, createJobHandler);

  app.withTypeProvider().get(
    '/jobs',
    {
      onRequest: [verifyJwt],
    },
    getJobsHandler,
  );

  app.withTypeProvider().get(
    '/job/user-responsable',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    getUserResponsableJobsHandler,
  );

  app.withTypeProvider().get(
    '/job/running',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    getJobsInRunningByUserResponsableDepartmentsHandler,
  );

  app.withTypeProvider().get('/job/:jobId', getJobHandler);

  app.withTypeProvider().put(
    '/job/:jobId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    updateJobHandler,
  );

  app.withTypeProvider().put(
    '/job/:jobId/start',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    startJobHandler,
  );

  app.withTypeProvider().put(
    '/job/:jobId/stop',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    stopJobHandler,
  );

  app.withTypeProvider().put(
    '/job/update-reponsable/:jobId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    updateResponsableJobHandler,
  );

  app.withTypeProvider().put(
    '/job/update-service/:jobId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    updateServiceJobHandler,
  );

  app.withTypeProvider().put(
    '/job/transfer-department/:jobId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    transferDepartmentJobHandler,
  );

  app.withTypeProvider().get(
    '/jobs/user/:userId',
    {
      onRequest: [verifyJwt],
    },
    getJobsByUserIdHandler,
  );

  app.withTypeProvider().delete(
    '/job/:jobId',
    {
      onRequest: [verifyJwt],
    },
    deleteJobHandler,
  );
  app.withTypeProvider().put(
    '/job/accomplished/:jobId',
    {
      onRequest: [verifyJwt, verifyUserRole(Role.ADMIN, Role.RESPONSIBLE)],
    },
    confirmAccomplishedJobHandler,
  );
}
