import { PauseExecutionOfJobUseCase } from '@/use-cases/job/pause-execution-of-job';
import { StartExecutionOfJobUseCase } from '@/use-cases/job/start-execution-of-job';
import { WebSocket } from '@fastify/websocket';

interface JobRequest {
  jobId: string;
}

interface MessageProps {
  type: string;
  data: JobRequest;
}

export function setupEvents(
  connection: WebSocket,
  userInfo: { userId: string; role: string },
) {
  connection.on('message', async (message: string) => {
    try {
      const { type, data }: MessageProps = JSON.parse(message);

      if (!userInfo.userId || !userInfo.role) {
        connection.send(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      switch (type) {
        case 'startJob':
          await handleStartJobEvent(connection, data, userInfo);
          break;
        case 'pauseJob':
          await handlePauseJobEvent(connection, data, userInfo);
          break;
        default:
          console.log('Evento não reconhecido:', type);
      }
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      connection.send(JSON.stringify({ error: 'Mensagem inválida' }));
    }
  });
}

async function handleStartJobEvent(
  connection: WebSocket,
  data: JobRequest,
  userInfo: { userId: string; role: string },
) {
  console.log('Iniciando o trabalho com dados:', data);

  const jobId = data.jobId;

  try {
    const result = await StartExecutionOfJobUseCase({
      jobId,
      userId: userInfo.userId,
      role: userInfo.role,
    });
    connection.send(JSON.stringify({ type: 'startedJob', result }));
  } catch (error) {
    console.error('Erro ao iniciar o trabalho:', error);
    connection.send(JSON.stringify({ error: 'Falha ao iniciar o trabalho' }));
  }
}

async function handlePauseJobEvent(
  connection: WebSocket,
  data: JobRequest,
  userInfo: { userId: string; role: string },
) {
  console.log('Pausando o trabalho com dados:', data);

  const jobId = data.jobId;

  try {
    const result = await PauseExecutionOfJobUseCase({
      jobId,
      userId: userInfo.userId,
      role: userInfo.role,
    });
    connection.send(JSON.stringify({ type: 'pausedJob', result }));
  } catch (error) {
    console.error('Erro ao pausar o trabalho:', error);
    connection.send(JSON.stringify({ error: 'Falha ao pausar o trabalho' }));
  }
}
