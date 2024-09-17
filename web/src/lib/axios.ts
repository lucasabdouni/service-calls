import axios from 'axios';
import { redirect } from 'react-router-dom';

const token = localStorage.getItem('token');

export const api = axios.create({
  baseURL: 'https://service-calls.onrender.com',
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
