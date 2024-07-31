import { prisma } from '@/lib/prisma';

type serviceProps = {
  department: string;
  local: string;
  problem: string;
  problem_description: string;
  priority: string;
  user_id: string;
};

type rangeProps = {
  startDate: Date;
  endDate: Date;
};

export async function createService(data: serviceProps) {
  const service = await prisma.service.create({
    data,
  });

  return service;
}

export async function getServices() {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const services = await prisma.service.findMany({
    where: {
      created_at: {
        gte: thirtyDaysAgo,
        lte: today,
      },
    },
  });

  return services;
}

export async function getServicesInDateRange({
  startDate,
  endDate,
}: rangeProps) {
  const services = await prisma.service.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return services;
}
