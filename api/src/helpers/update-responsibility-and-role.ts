import { prisma } from '@/lib/prisma';
import { Role } from '@/repositories/user-repository';

export async function updateResponsibilityAndRole(userId: string) {
  const departments = await prisma.department.findMany({
    where: {
      responsables: {
        some: {
          id: userId,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  switch (user.role) {
    case Role.MEMBER:
      if (departments.length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: Role.RESPONSIBLE },
        });
      }
      break;

    case Role.RESPONSIBLE:
      if (departments.length === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: Role.MEMBER },
        });
      }
      break;

    default:
      break;
  }
}
