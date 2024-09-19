import { GetDepartmentsUseCase } from '@/use-cases/get-departments';

export const getDepartmentsHandler = async () => {
  const { departments } = await GetDepartmentsUseCase();

  return { departments };
};
