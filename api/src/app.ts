import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { errorHandler } from './error-handler';
import { authenticateRoutes } from './routes/authenticate/routes';
import { serviceRoutes } from './routes/service/routes';
import { userRoutes } from './routes/user/routes';

export const app = fastify();

app.register(cors, {
  origin: '*',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: 60 * 60 * 2, // 2 Hours
  },
});

app.setErrorHandler(errorHandler);

app.register(authenticateRoutes);
app.register(userRoutes);
app.register(serviceRoutes);
