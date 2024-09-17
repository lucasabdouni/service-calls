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

// src/routes/service/update-service.ts
var update_service_exports = {};
__export(update_service_exports, {
  updateServiceHandler: () => updateServiceHandler
});
module.exports = __toCommonJS(update_service_exports);

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

// src/routes/service/update-service.ts
var import_zod = __toESM(require("zod"));
var PriorityEnum = import_zod.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema = import_zod.default.object({
  local: import_zod.default.string().optional(),
  problem: import_zod.default.string().optional(),
  problem_description: import_zod.default.string().optional(),
  priority: PriorityEnum.optional(),
  occurs_at: import_zod.default.coerce.date().optional(),
  responsible_accomplish: import_zod.default.string().optional(),
  status: import_zod.default.string().optional()
});
var paramsSchema = import_zod.default.object({
  serviceId: import_zod.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var updateServiceHandler = async (request) => {
  const data = bodySchema.parse(request.body);
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
  const service = await updateService({ id: serviceId, data });
  return { service };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateServiceHandler
});
