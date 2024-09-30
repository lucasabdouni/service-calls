import { api } from '../lib/axios';

export interface UpdateUserRoleBody {
  role: 'RESPONSIBLE' | 'ADMIN' | 'MEMBER';
  email: string;
}

export async function updateUserRole({ email, role }: UpdateUserRoleBody) {
  await api.put(`/user/update-role`, {
    email,
    role,
  });
}
