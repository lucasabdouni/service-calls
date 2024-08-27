import { DepartmentProps } from './department';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  registration_number: number;
  department: string;
  ramal: number;
  role: string;
  departments_responsible: DepartmentProps[];
};
