import axios from 'axios';
import { redirect } from 'react-router-dom';
import { env } from '../env';

const token = localStorage.getItem('token');

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (error.response?.data.code === 'token.expired') {
        localStorage.removeItem('token');
        redirect('/');
      }
    }
    return Promise.reject(error);
  },
);

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    );

    return config;
  });
}
