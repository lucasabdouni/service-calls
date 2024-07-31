import { Department } from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

export function CheckResponsableFromDepartment(department: Department) {
  switch (department) {
    case Department.ELECTRICAL:
      return Role.ELECTRICAL_RESPONSIBLE;
    case Department.SG:
      return Role.SG_RESPONSIBLE;
    case Department.TI:
      return Role.TI_RESPONSIBLE;
    case Department.MECANIC:
      return Role.MECANIC_RESPONSIBLE;

    default:
      throw new Error('Department not recognized');
  }
}
