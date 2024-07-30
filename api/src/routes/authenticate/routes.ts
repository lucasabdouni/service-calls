import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticateUserHandler } from './authenticate';
export async function authenticateRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/sessions', authenticateUserHandler);
}
