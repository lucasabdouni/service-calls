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
  const services = await prisma.department.findMany({
    include: {
      services: {
        select: {
          id: true,
          name: true,
          description: true,
          execution_time: true,
        },
      },
    },
  });

  return services.map((department) => ({
    id: department.id,
    name: department.name,
    sigla: department.sigla,
    services: department.services,
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
  const services = await prisma.service.findMany({
    where: {
      department_id: departmentId,
    },
  });

  return services;
}

export async function deleteService(serviceId: string) {
  await prisma.service.delete({
    where: { id: serviceId },
  });
}
