import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { errorHandler } from './error-handler';
import { authenticateRoutes } from './http/routes/authenticate';
import { departmentRoutes } from './http/routes/department';
import { serviceRoutes } from './http/routes/service';
import { userRoutes } from './http/routes/user';

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
app.register(departmentRoutes);
