import { updateResponsibilityAndRole } from '@/helpers/update-responsibility-and-role';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  RESPONSIBLE = 'RESPONSIBLE',
}

export async function findUserByEmailAuth(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      registration_number: true,
      ramal: true,
      role: true,
      departments_responsible: true,
    },
  });

  return user;
}

export async function findUserByRegistrationNumber(
  registration_number: number,
) {
  const user = await prisma.user.findUnique({
    where: { registration_number },
    select: {
      id: true,
      name: true,
      email: true,
      registration_number: true,
      ramal: true,
      role: true,
      departments_responsible: true,
    },
  });

  return user;
}

export async function createUser(data: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      registration_number: true,
      ramal: true,
      role: true,
      departments_responsible: true,
    },
  });

  return user;
}

export async function updateUserRoles(email: string, role: Role) {
  const user = await prisma.user.update({
    where: { email },
    data: { role: role },
  });

  if (role === Role.MEMBER) {
    await prisma.user.update({
      where: { email: email },
      data: {
        departments_responsible: {
          set: [],
        },
      },
    });
  }

  return user;
}

export async function findUserResponsable(role: Role) {
  const users = await prisma.user.findMany({
    where: { role },
    select: {
      email: true,
    },
  });

  return users;
}

export async function updateUserResponsibilitiesDepartment(
  userId: string,
  addDepartmentsIds: string[],
  removeDepartmentsIds: string[],
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      departments_responsible: {
        connect: addDepartmentsIds.map((id) => ({ id })),
        disconnect: removeDepartmentsIds.map((id) => ({ id })),
      },
    },
    select: {
      id: true,
      departments_responsible: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  updateResponsibilityAndRole(userId);

  return user;
}
