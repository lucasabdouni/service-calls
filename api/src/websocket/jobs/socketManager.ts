import { GetJobUseCase } from '@/use-cases/job/get-job';
import { GetUserUseCase } from '@/use-cases/user/get-user';
import { WebSocket } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest } from 'fastify';
import z from 'zod';

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const connections = new Map<string, Set<WebSocket>>();

export async function socketManagerJobs(app: FastifyInstance) {
  app.get(
    '/job/:jobId/ws',
    { websocket: true },
    async (connection, request: FastifyRequest) => {
      const { jobId } = paramsSchema.parse(request.params);

      let userId = null;
      let role = null;

      if (!connections.has(jobId)) {
        connections.set(jobId, new Set());
      }
      const clients = connections.get(jobId);
      clients?.add(connection);

      const servico = await GetJobUseCase({ jobId });

      if (!servico) {
        connection.send(JSON.stringify({ error: 'Service not found' }));
        return connection.close();
      }

      connection.on('message', async (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'USER_ID') {
          console.log(`User ID recebido: ${parsedMessage.userId}`);
          const { user } = await GetUserUseCase({
            userId: parsedMessage.userId,
          });

          if (user) {
            userId = user.id;
            role = user.role;
            console.log(`Usuário encontrado: ${userId}, Role: ${role}`);

            connection.send(JSON.stringify({ success: true, userId, role }));
          } else {
            connection.send(JSON.stringify({ error: 'User not found' }));
          }
        }
      });

      connection.on('close', () => {
        console.log(`Cliente WebSocket desconectado.`);
        clients?.delete(connection.socket);
        if (clients?.size === 0) {
          connections.delete(jobId);
        }
      });
    },
  );
}
