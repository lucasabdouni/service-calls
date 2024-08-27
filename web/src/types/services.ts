import { DepartmentProps } from './department';
import { UserProps } from './user';

export type ServiceProps = {
  accomplished: boolean;
  department: DepartmentProps;
  id: string;
  local: string;
  priority: 'Baixa' | 'Media' | 'Alta';
  problem: string;
  problem_description: string;
  status: string;
  created_at: string;
  occurs_at: Date;
  responsible_accomplish: string;
  user: UserProps;
};
