import { api } from '../lib/axios';

export interface UpdateDepartmentsUserResponsableBody {
  addDepartmentsIds: string[];
  removeDepartmentsIds: string[];
  userId: string;
}

export async function updateDepartmentsUserResponsable({
  addDepartmentsIds,
  removeDepartmentsIds,
  userId,
}: UpdateDepartmentsUserResponsableBody) {
  await api.put(`/update-departments-responsable/${userId}`, {
    addDepartmentsIds,
    removeDepartmentsIds,
  });
}
