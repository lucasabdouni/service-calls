"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/repositories/service-repository.ts
var service_repository_exports = {};
__export(service_repository_exports, {
  confirmAccomplisheService: () => confirmAccomplisheService,
  createService: () => createService,
  deleteService: () => deleteService,
  getServiceById: () => getServiceById,
  getServiceByUserId: () => getServiceByUserId,
  getServices: () => getServices,
  updateService: () => updateService,
  updateServiceDepartment: () => updateServiceDepartment
});
module.exports = __toCommonJS(service_repository_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/repositories/user-repository.ts
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      registration_number: true,
      ramal: true,
      role: true,
      departments_responsible: true
    }
  });
  return user;
}

// src/repositories/service-repository.ts
async function createService(data) {
  const service = await prisma.service.create({
    data
  });
  return service;
}
async function getServices({
  userId,
  accomplished,
  startDate,
  endDate
}) {
  const today = /* @__PURE__ */ new Date();
  const thirtyDaysAgo = /* @__PURE__ */ new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const user = await getUserById(userId);
  const where = {
    accomplished,
    created_at: {
      gte: startDate ?? thirtyDaysAgo,
      lte: endDate ?? today
    },
    ...user?.role !== "ADMIN" /* ADMIN */ && {
      department: {
        id: { in: user?.departments_responsible.map((dep) => dep.id) }
      }
    }
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
          registration_number: true
        }
      }
    }
  });
  return services;
}
async function getServiceById(id) {
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
          registration_number: true
        }
      }
    }
  });
  return service;
}
async function getServiceByUserId(id) {
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
          registration_number: true
        }
      }
    }
  });
  return service;
}
async function updateService({
  id,
  data
}) {
  const service = await prisma.service.update({
    where: { id },
    data
  });
  return service;
}
async function updateServiceDepartment({
  id,
  data
}) {
  const service = await prisma.service.update({
    where: { id },
    data,
    include: {
      department: true,
      user: true
    }
  });
  return service;
}
async function confirmAccomplisheService({
  id,
  data
}) {
  const service = await prisma.service.update({
    where: { id },
    data,
    include: {
      department: true,
      user: true
    }
  });
  return service;
}
async function deleteService(id) {
  const service = await prisma.service.delete({
    where: { id }
  });
  return service;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  confirmAccomplisheService,
  createService,
  deleteService,
  getServiceById,
  getServiceByUserId,
  getServices,
  updateService,
  updateServiceDepartment
});
