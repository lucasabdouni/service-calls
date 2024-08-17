import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotifyProps {
  type: NotificationType;
  message: string;
  description?: string;
}

export const notify = ({ type, message, description = '' }: NotifyProps) => {
  notification[type]({
    message,
    description,
  });
};
