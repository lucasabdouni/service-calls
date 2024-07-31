import { Department } from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';

export function CheckDepartmentFromRoles(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return null;
    case Role.ELECTRICAL_RESPONSIBLE:
      return Department.ELECTRICAL;
    case Role.SG_RESPONSIBLE:
      return Department.SG;
    case Role.TI_RESPONSIBLE:
      return Department.TI;
    case Role.MECANIC_RESPONSIBLE:
      return Department.MECANIC;

    default:
      throw new Error('Role not recognized');
  }
}
