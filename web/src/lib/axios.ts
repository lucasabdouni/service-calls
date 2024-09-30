import axios from 'axios';

const token = localStorage.getItem('token');

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.request.use(async (config) => {
  await new Promise((resolve) =>
    setTimeout(resolve, Math.round(Math.random() * 3000)),
  );

  return config;
});

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       if (error.response?.data.code === 'token.expired') {
//         localStorage.removeItem('token');
//         redirect('/');
//       }
//     }
//     return Promise.reject(error);
//   },
// );
