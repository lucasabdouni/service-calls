import { GetDepartmentsUseCase } from '@/use-cases/department/get-departments';

export const getDepartmentsHandler = async () => {
  const { departments } = await GetDepartmentsUseCase();

  return { departments };
};
