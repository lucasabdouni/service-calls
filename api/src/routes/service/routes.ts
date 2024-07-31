import { verifyJwt } from '@/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { createServiceHandler } from './create-service';
import { getServicesHandler } from './get-services';

export async function serviceRoutes(app: FastifyInstance) {
  app
    .withTypeProvider()
    .post('/service', { onRequest: [verifyJwt] }, createServiceHandler);
  app
    .withTypeProvider()
    .get('/services', { onRequest: [verifyJwt] }, getServicesHandler);
}
