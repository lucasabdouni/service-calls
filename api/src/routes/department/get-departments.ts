import { getDepartment } from '@/repositories/department-respository';
import { FastifyRequest } from 'fastify';

export const getDepartmentHandler = async (request: FastifyRequest) => {
  const departments = await getDepartment();

  if (!departments) {
    return 'No department registered';
  }

  return { departments };
};
