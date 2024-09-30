import { api } from '../lib/axios';

export type getUserMetricsResponse = {
  requests: number;
  openRequests: number;
  performedRequests: number;
};

export async function getUserMetrics() {
  const response = await api.get<getUserMetricsResponse>('/user-metrics');

  return response.data;
}
