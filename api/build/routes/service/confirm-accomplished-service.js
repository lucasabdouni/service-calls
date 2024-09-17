"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/service/confirm-accomplished-service.ts
var confirm_accomplished_service_exports = {};
__export(confirm_accomplished_service_exports, {
  confirmAccomplishedServiceHandler: () => confirmAccomplishedServiceHandler
});
module.exports = __toCommonJS(confirm_accomplished_service_exports);

// src/errors/client-erro.ts
var ClientError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ClientError";
  }
};

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/repositories/department-respository.ts
async function getDepartmentById(id) {
  const department = await prisma.department.findUnique({
    where: {
      id
    },
    include: {
      responsables: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return department;
}

// src/repositories/service-repository.ts
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

// src/routes/service/confirm-accomplished-service.ts
var import_zod = __toESM(require("zod"));
var paramsSchema = import_zod.default.object({
  serviceId: import_zod.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var confirmAccomplishedServiceHandler = async (request) => {
  const { serviceId } = paramsSchema.parse(request.params);
  const { role } = request.user;
  const userId = request.user.sub;
  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, "Service not found.");
  }
  const departmentCheck = await getDepartmentById(
    checkServiceExists.department.id
  );
  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId
  );
  if (role !== "ADMIN" /* ADMIN */ && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
      "User not authorized to update this department."
    );
  }
  const service = await confirmAccomplisheService({
    id: serviceId,
    data: {
      accomplished: true,
      status: "Finalizado"
    }
  });
  return { service };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  confirmAccomplishedServiceHandler
});
