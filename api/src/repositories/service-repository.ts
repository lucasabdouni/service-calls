import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Role, getUserById } from './user-repository';

type serviceProps = {
  local: string;
  problem: string;
  problem_description: string;
  priority: string;
  occurs_at?: Date;
  responsible_accomplish?: string;
  status?: string;
  user_id: string;
  department_id: string;
};

type updateServiceDepartmentProps = {
  department_id: string;
};

export async function createService(data: serviceProps) {
  const service = await prisma.service.create({
    data,
  });

  return service;
}

export async function getServices({
  userId,
  accomplished,
  startDate,
  endDate,
}: {
  userId: string;
  accomplished: boolean;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const user = await getUserById(userId);

  const where = {
    accomplished,
    created_at: {
      gte: startDate ?? thirtyDaysAgo,
      lte: endDate ?? today,
    },
    ...(user?.role !== Role.ADMIN && {
      department: {
        id: { in: user?.departments_responsible.map((dep) => dep.id) },
      },
    }),
  };

  const services = await prisma.service.findMany({
    where,
    select: {
      id: true,
      local: true,
      problem: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      responsible_accomplish: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
    },
  });

  return services;
}

// export async function getServicesInDateRange({
//   startDate,
//   endDate,
//   department,
//   accomplished,
// }: {
//   startDate: Date;
//   endDate: Date;
//   department: Department | null;
//   accomplished: boolean;
// }) {
//   const where = {
//     accomplished,
//     created_at: {
//       gte: startDate,
//       lte: endDate,
//     },
//     ...(department && { department }),
//   };

//   const services = await prisma.service.findMany({
//     where,
//   });

//   return services;
// }

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      local: true,
      problem: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      responsible_accomplish: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
    },
  });

  return service;
}

export async function getServiceByUserId(id: string) {
  const service = await prisma.service.findMany({
    where: { user_id: id },
    select: {
      id: true,
      local: true,
      problem: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      responsible_accomplish: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
    },
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

export async function updateServiceDepartment({
  id,
  data,
}: {
  id: string;
  data: updateServiceDepartmentProps;
}) {
  const service = await prisma.service.update({
    where: { id },
    data,
    include: {
      department: true,
      user: true,
    },
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
    include: {
      department: true,
      user: true,
    },
  });

  return service;
}

export async function deleteService(id: string) {
  const service = await prisma.service.delete({
    where: { id },
  });

  return service;
}
