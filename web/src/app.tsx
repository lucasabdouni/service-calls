import { QueryClientProvider } from '@tanstack/react-query';
import 'antd/locale/pt_BR';
import 'react-datepicker/dist/react-datepicker.css';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/react-query';
import { router } from './routes';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
