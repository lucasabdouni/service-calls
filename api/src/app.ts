import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyWebsocket from '@fastify/websocket';
import fastify from 'fastify';
import fastifyCron from 'fastify-cron';
import { env } from './env';
import { errorHandler } from './error-handler';
import { authenticateRoutes } from './http/routes/authenticate';
import { departmentRoutes } from './http/routes/department';
import { jobRoutes } from './http/routes/job';
import { serviceRoutes } from './http/routes/service';
import { userRoutes } from './http/routes/user';
import { pauseJobServices } from './jobs/taskHandlers/pauseJobServices';
import { resumeJobServices } from './jobs/taskHandlers/resumeJobServices';
import { socketManagerJobs } from './websocket/jobs/socketManager';

export const app = fastify();

app.register(cors, {
  origin: '*',
});

app.register(fastifyWebsocket);

app.register(fastifyCron, {
  jobs: [
    {
      name: 'pauseJobsServices',
      cronTime: '30 17 * * 1-5',
      onTick: async () => {
        await pauseJobServices();
      },
    },
    {
      name: 'resumeJobsServices',
      cronTime: '30 7 * * 1-5',
      onTick: async () => {
        await resumeJobServices();
      },
    },
  ],
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
app.register(jobRoutes);
app.register(departmentRoutes);
app.register(serviceRoutes);
app.register(socketManagerJobs);
