import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
    },
  });

  return user;
}
