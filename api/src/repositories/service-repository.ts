import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function createService(data: Prisma.ServiceCreateInput) {
  const service = await prisma.service.create({
    data,
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

export async function findServices() {
  const departments = await prisma.department.findMany({
    include: {
      services: {
        select: {
          name: true,
          description: true,
          execution_time: true,
        },
      },
    },
  });

  return departments.map((department) => ({
    department: {
      name: department.name,
      sigla: department.sigla,
      services: department.services,
    },
  }));
}

export async function findService(id: string) {
  const service = await prisma.service.findUnique({
    where: {
      id: id,
    },
    include: {
      department: true,
    },
  });

  return service;
}

export async function findServiceByDepartmentId(departmentId: string) {
  const departmentWithServices = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
    include: {
      services: {
        select: {
          name: true,
          description: true,
          execution_time: true,
        },
      },
    },
  });

  return {
    department: {
      name: departmentWithServices?.name,
      sigla: departmentWithServices?.sigla,
      services: departmentWithServices?.services,
    },
  };
}

export async function deleteService(serviceId: string) {
  await prisma.service.delete({
    where: { id: serviceId },
  });
}
