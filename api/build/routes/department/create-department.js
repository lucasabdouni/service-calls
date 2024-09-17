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

// src/routes/department/create-department.ts
var create_department_exports = {};
__export(create_department_exports, {
  createDepartmentHandler: () => createDepartmentHandler
});
module.exports = __toCommonJS(create_department_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/repositories/department-respository.ts
async function createDepartment(data) {
  const department = await prisma.department.create({
    data
  });
  return department;
}

// src/routes/department/create-department.ts
var import_zod = __toESM(require("zod"));
var bodySchema = import_zod.default.object({
  name: import_zod.default.string({ message: "Name is mandatory" }),
  sigla: import_zod.default.string({ message: "Sigla is mandatory" }).min(1, { message: "Sigla must have at least 1 characters" })
});
var createDepartmentHandler = async (request) => {
  const { name, sigla } = bodySchema.parse(request.body);
  const department = await createDepartment({
    name,
    sigla
  });
  return { department };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDepartmentHandler
});
