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

// src/routes/user/update-user-responsibles-department.ts
var update_user_responsibles_department_exports = {};
__export(update_user_responsibles_department_exports, {
  updateUserResponsibilitiesDepartmentHandler: () => updateUserResponsibilitiesDepartmentHandler
});
module.exports = __toCommonJS(update_user_responsibles_department_exports);

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

// src/helpers/update-responsibility-and-role.ts
async function updateResponsibilityAndRole(userId) {
  const departments = await prisma.department.findMany({
    where: {
      responsables: {
        some: {
          id: userId
        }
      }
    }
  });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  if (!user) {
    throw new Error("Usu\xE1rio n\xE3o encontrado");
  }
  switch (user.role) {
    case "MEMBER" /* MEMBER */:
      if (departments.length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "RESPONSIBLE" /* RESPONSIBLE */ }
        });
      }
      break;
    case "RESPONSIBLE" /* RESPONSIBLE */:
      if (departments.length === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "MEMBER" /* MEMBER */ }
        });
      }
      break;
    default:
      break;
  }
}

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
async function updateUserResponsibilitiesDepartment(userId, addDepartmentsIds, removeDepartmentsIds) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      departments_responsible: {
        connect: addDepartmentsIds.map((id) => ({ id })),
        disconnect: removeDepartmentsIds.map((id) => ({ id }))
      }
    },
    select: {
      id: true,
      departments_responsible: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  updateResponsibilityAndRole(userId);
  return user;
}

// src/routes/user/update-user-responsibles-department.ts
var import_zod = __toESM(require("zod"));
var paramsSchema = import_zod.default.object({
  id: import_zod.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema = import_zod.default.object({
  addDepartmentsIds: import_zod.default.array(import_zod.default.string().uuid()).optional(),
  removeDepartmentsIds: import_zod.default.array(import_zod.default.string().uuid()).optional()
});
var updateUserResponsibilitiesDepartmentHandler = async (request) => {
  const { addDepartmentsIds, removeDepartmentsIds } = bodySchema.parse(
    request.body
  );
  const { id } = paramsSchema.parse(request.params);
  const checkUserExists = await getUserById(id);
  if (!checkUserExists) {
    throw new ClientError(409, "User not found.");
  }
  const user = await updateUserResponsibilitiesDepartment(
    id,
    addDepartmentsIds || [],
    removeDepartmentsIds || []
  );
  return { user };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateUserResponsibilitiesDepartmentHandler
});
