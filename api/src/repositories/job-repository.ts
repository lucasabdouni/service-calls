import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Role, findUserById } from './user-repository';

type jobProps = {
  local: string;
  problem_description: string;
  priority: string;
  occurs_at?: Date;
  start_time?: number;
  elapsed_time?: number;
  status?: string;
  user_id: string;
  department_id: string;
  responsible_id?: string;
  service_id?: string;
};

type updateJobDepartmentProps = {
  department_id: string;
};

export async function createJob(data: jobProps) {
  const job = await prisma.job.create({
    data,
    include: {
      service: true,
    },
  });

  return job;
}

export async function findJobs({
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

  const user = await findUserById(userId);

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

  const jobs = await prisma.job.findMany({
    where,
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      running: true,
      elapsed_time: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return jobs;
}

export async function findJobsInRunningByUserResponsableDepartments({
  userId,
}: {
  userId: string;
}) {
  const user = await findUserById(userId);

  const where = {
    running: true,
    ...(user?.role !== Role.ADMIN && {
      department: {
        id: { in: user?.departments_responsible.map((dep) => dep.id) },
      },
    }),
  };

  const jobs = await prisma.job.findMany({
    where,
    select: {
      id: true,
      local: true,
      problem_description: true,
      running: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return jobs;
}

export async function findJobsInRunning() {
  const jobs = await prisma.job.findMany({
    where: {
      running: true,
    },
  });

  return jobs;
}

export async function findJobsInInterval() {
  const jobs = await prisma.job.findMany({
    where: {
      running: false,
      status: 'Intervalo',
    },
  });

  return jobs;
}

export async function findJobById(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      running: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function findJobsByUserId(id: string) {
  const job = await prisma.job.findMany({
    where: { user_id: id },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function updateJob({
  id,
  data,
}: {
  id: string;
  data: Prisma.JobUpdateInput;
}) {
  const job = await prisma.job.update({
    where: { id },
    data,
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function updateJobDepartment({
  id,
  data,
}: {
  id: string;
  data: updateJobDepartmentProps;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      service_id: null,
      responsable_id: null,
      ...data,
    },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function updateJobService({
  id,
  serviceId,
}: {
  id: string;
  serviceId: string;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      service_id: serviceId,
    },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function updateResponsableService({
  id,
  responsableId,
}: {
  id: string;
  responsableId: string;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      responsable_id: responsableId,
    },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function confirmAccomplisheJob({
  id,
  data,
}: {
  id: string;
  data: Prisma.JobUpdateInput;
}) {
  const job = await prisma.job.update({
    where: { id },
    data,
    include: {
      department: true,
      user: true,
      responsable: true,
      service: true,
    },
  });

  return job;
}

export async function deleteJob(id: string) {
  const job = await prisma.job.delete({
    where: { id },
    include: {
      responsable: true,
      service: true,
      user: true,
    },
  });

  return job;
}

export async function pauseJobInExecution({
  id,
  elapsedTime,
  status,
  responsableId,
}: {
  id: string;
  elapsedTime: number;
  status: string;
  responsableId: string;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      running: false,
      status,
      elapsed_time: elapsedTime,
      start_time: 0,
      responsable_id: responsableId,
    },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}

export async function startJob({
  id,
  startTime,
  responsableId,
}: {
  id: string;
  startTime: number;
  responsableId: string;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      running: true,
      status: 'Em execução',
      start_time: startTime,
      occurs_at: new Date(),
      responsable_id: responsableId,
    },
    select: {
      id: true,
      local: true,
      problem_description: true,
      priority: true,
      status: true,
      accomplished: true,
      department: true,
      created_at: true,
      occurs_at: true,
      start_time: true,
      elapsed_time: true,
      running: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      responsable: {
        select: {
          id: true,
          name: true,
          email: true,
          ramal: true,
          registration_number: true,
        },
      },
      service: {
        select: {
          id: true,
          description: true,
          name: true,
          execution_time: true,
        },
      },
    },
  });

  return job;
}
