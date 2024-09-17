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

// src/routes/department/update-department.ts
var update_department_exports = {};
__export(update_department_exports, {
  updateDepartmentHandler: () => updateDepartmentHandler
});
module.exports = __toCommonJS(update_department_exports);

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
async function updateDepartment({
  id,
  data
}) {
  const department = await prisma.department.update({
    where: { id },
    data
  });
  return department;
}

// src/routes/department/update-department.ts
var import_zod = __toESM(require("zod"));
var paramsSchema = import_zod.default.object({
  id: import_zod.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema = import_zod.default.object({
  name: import_zod.default.string({ message: "Name is mandatory" }),
  sigla: import_zod.default.string({ message: "Sigla is mandatory" }).min(1, { message: "Sigla must have at least 1 characters" })
});
var updateDepartmentHandler = async (request) => {
  const { name, sigla } = bodySchema.parse(request.body);
  const { id } = paramsSchema.parse(request.params);
  const checkDepartmentExists = await getDepartmentById(id);
  if (!checkDepartmentExists) {
    throw new ClientError(409, "Deparment not found.");
  }
  const department = await updateDepartment({
    id,
    data: {
      name,
      sigla
    }
  });
  return { department };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateDepartmentHandler
});
