interface Department {
  id: string;
  name: string;
  sigla: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  ramal: number;
  registration_number: number;
}

interface Service {
  id: string;
  description: string;
  name: string;
  execution_time: number;
}

export interface Job {
  id: string;
  local: string;
  problem_description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: string;
  accomplished: boolean;
  department: Department;
  created_at: string;
  occurs_at: string | null;
  start_time: number;
  elapsed_time: number;
  running: boolean;
  updatedAt: string;
  user: User;
  responsable: User | null;
  service: Service;
}
