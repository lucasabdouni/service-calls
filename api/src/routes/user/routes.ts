import { verifyJwt } from '@/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getUserByIdHandler } from './get-user';
import { registerUserHandler } from './register-user';

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/user', registerUserHandler);
  app
    .withTypeProvider()
    .get('/me', { onRequest: [verifyJwt] }, getUserByIdHandler);
}
