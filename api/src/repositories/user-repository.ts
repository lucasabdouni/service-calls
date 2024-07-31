import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  ELECTRICAL_RESPONSIBLE = 'ELECTRICAL_RESPONSIBLE',
  MECANIC_RESPONSIBLE = 'MECANIC_RESPONSIBLE',
  TI_RESPONSIBLE = 'TI_RESPONSIBLE',
  SG_RESPONSIBLE = 'SG_RESPONSIBLE',
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

export async function findUserByRegistrationNumber(
  registration_number: number,
) {
  const user = await prisma.user.findUnique({
    where: { registration_number },
  });

  return user;
}

export async function createUser(data: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      registration_number: true,
      department: true,
      ramal: true,
      role: true,
    },
  });

  return user;
}
export async function updateUserRoles(email: string, role: Role) {
  const user = await prisma.user.update({
    where: { email },
    data: { role: role },
  });

  return user;
}

export async function getUserResponsable(role: Role) {
  const users = await prisma.user.findMany({
    where: { role },
    select: {
      email: true,
    },
  });

  return users;
}
