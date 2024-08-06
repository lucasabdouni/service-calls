import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type serviceProps = {
  department: Department;
  local: string;
  problem: string;
  problem_description: string;
  priority: string;
  occurs_at?: Date;
  responsible_accomplish?: string;
  status?: string;
  user_id: string;
};

export enum Department {
  ELECTRICAL = 'ELECTRICAL',
  MECANIC = 'MECANIC',
  TI = 'TI',
  SG = 'SG_RESPONSIBLE',
}

export async function createService(data: serviceProps) {
  const service = await prisma.service.create({
    data,
  });

  return service;
}

export async function getServices({
  department,
  accomplished,
}: {
  department: Department | null;
  accomplished: boolean;
}) {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const where = {
    accomplished,
    created_at: {
      gte: thirtyDaysAgo,
      lte: today,
    },
    ...(department && { department }),
  };

  const services = await prisma.service.findMany({ where });

  return services;
}

export async function getServicesInDateRange({
  startDate,
  endDate,
  department,
  accomplished,
}: {
  startDate: Date;
  endDate: Date;
  department: Department | null;
  accomplished: boolean;
}) {
  const where = {
    accomplished,
    created_at: {
      gte: startDate,
      lte: endDate,
    },
    ...(department && { department }),
  };

  const services = await prisma.service.findMany({
    where,
  });

  return services;
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  return service;
}

export async function getServiceByUserId(id: string) {
  const service = await prisma.service.findMany({
    where: { user_id: id },
  });

  return service;
}

export async function updateService({
  id,
  data,
}: {
  id: string;
  data: Prisma.ServiceUpdateInput;
}) {
  const service = await prisma.service.update({
    where: { id },
    data,
  });

  return service;
}

export async function confirmAccomplisheService({
  id,
  data,
}: {
  id: string;
  data: Prisma.ServiceUpdateInput;
}) {
  const service = await prisma.service.update({
    where: { id },
    data,
  });

  return service;
}

export async function deleteService(id: string) {
  const service = await prisma.service.delete({
    where: { id },
  });

  return service;
}
