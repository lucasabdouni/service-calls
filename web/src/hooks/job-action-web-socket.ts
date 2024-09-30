import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { GetJobByIdResponse } from '../api/update-job';
import { AuthContext } from '../context/AuthContext';

interface useJobDetailsWebSocketsParams {
  jobId: string;
}

type WebhookJob = {
  type: 'JOB_UPDATED';
  job: GetJobByIdResponse;
};

export function useJobDetailsWebSockets({
  jobId,
}: useJobDetailsWebSocketsParams) {
  const queryClient = useQueryClient();
  const { loading, isAuthenticated, user, isLoadingProfile } =
    useContext(AuthContext);

  useEffect(() => {
    if (loading || isLoadingProfile) return;

    const ws = new WebSocket(`ws://localhost:3333/job/${jobId}/ws`);

    ws.onopen = () => {
      if (isAuthenticated && user) {
        const message = {
          type: 'USER_ID',
          userId: user.id,
        };
        ws.send(JSON.stringify(message));
      } else {
        console.log('Connected without user ID');
      }
    };

    ws.onmessage = (event) => {
      const data: WebhookJob = JSON.parse(event.data);

      if (data.type === 'JOB_UPDATED') {
        console.log('chegou aqui');
        const jobListCache = queryClient.getQueriesData<GetJobByIdResponse>({
          queryKey: ['job', jobId],
        });

        jobListCache.forEach(([cacheKey, cacheData]) => {
          if (!cacheData) {
            return;
          }

          queryClient.setQueryData<GetJobByIdResponse>(cacheKey, data.job);
        });
      }
    };

    ws.onclose = () => {
      console.log('Websocket connection closed!');
    };

    return () => {
      ws.close();
    };
  }, [jobId, loading, isAuthenticated, user, isLoadingProfile, queryClient]);
}
