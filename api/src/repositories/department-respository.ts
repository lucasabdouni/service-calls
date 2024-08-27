import { updateResponsibilityAndRole } from '@/helpers/update-responsibility-and-role';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function createDepartment(data: Prisma.DepartmentCreateInput) {
  const department = await prisma.department.create({
    data,
  });

  return department;
}

export async function getDepartment() {
  const departments = await prisma.department.findMany();

  return departments;
}

export async function getDepartmentById(id: string) {
  const department = await prisma.department.findUnique({
    where: {
      id: id,
    },
    include: {
      responsables: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return department;
}

export async function updateDepartment({
  id,
  data,
}: {
  id: string;
  data: Prisma.DepartmentUpdateInput;
}) {
  const department = await prisma.department.update({
    where: { id },
    data,
  });

  return department;
}

export async function updateDepartmentResponsibilities(
  departmentId: string,
  addUserIds: string[],
  removeUserIds: string[],
) {
  const department = await prisma.department.update({
    where: { id: departmentId },
    data: {
      responsables: {
        connect: addUserIds.map((id) => ({ id })),
        disconnect: removeUserIds.map((id) => ({ id })),
      },
    },
    include: {
      responsables: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const changeModifiedUserRole = [...addUserIds, ...removeUserIds];

  changeModifiedUserRole.map((user) => {
    updateResponsibilityAndRole(user);
  });

  return department;
}

export async function deleteDepartment(id: string) {
  await prisma.department.delete({
    where: { id },
  });
}
