import { GetJobUseCase } from '@/use-cases/job/get-job';
import { FastifyInstance, FastifyRequest } from 'fastify';
import z from 'zod';
import { setupEvents } from './events';

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export function initializeSocket(app: FastifyInstance) {
  app.get(
    '/job/:jobId/ws',
    { websocket: true },
    async (connection, request: FastifyRequest) => {
      const { jobId } = paramsSchema.parse(request.params);
      const token = await request.jwtVerify();
      const userId = request.user.sub;
      const role = request.user.role;

      const servico = await GetJobUseCase({ jobId });

      if (!servico) {
        connection.socket.send(JSON.stringify({ error: 'Service not found' }));
        return connection.socket.close();
      }

      setupEvents(connection.socket, { userId, role });

      connection.on('close', () => {
        console.log('Cliente WebSocket desconectado');
      });
    },
  );
}
