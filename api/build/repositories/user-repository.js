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

// src/repositories/user-repository.ts
var user_repository_exports = {};
__export(user_repository_exports, {
  Role: () => Role,
  createUser: () => createUser,
  findUserByEmail: () => findUserByEmail,
  findUserByEmailAuth: () => findUserByEmailAuth,
  findUserByRegistrationNumber: () => findUserByRegistrationNumber,
  getUserById: () => getUserById,
  getUserResponsable: () => getUserResponsable,
  updateUserResponsibilitiesDepartment: () => updateUserResponsibilitiesDepartment,
  updateUserRoles: () => updateUserRoles
});
module.exports = __toCommonJS(user_repository_exports);

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
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["MEMBER"] = "MEMBER";
  Role2["ADMIN"] = "ADMIN";
  Role2["RESPONSIBLE"] = "RESPONSIBLE";
  return Role2;
})(Role || {});
async function findUserByEmailAuth(email) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return user;
}
async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
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
async function findUserByRegistrationNumber(registration_number) {
  const user = await prisma.user.findUnique({
    where: { registration_number },
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
async function createUser(data) {
  const user = await prisma.user.create({
    data
  });
  return user;
}
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
async function updateUserRoles(email, role) {
  const user = await prisma.user.update({
    where: { email },
    data: { role }
  });
  if (role === "MEMBER" /* MEMBER */) {
    await prisma.user.update({
      where: { email },
      data: {
        departments_responsible: {
          set: []
        }
      }
    });
  }
  return user;
}
async function getUserResponsable(role) {
  const users = await prisma.user.findMany({
    where: { role },
    select: {
      email: true
    }
  });
  return users;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Role,
  createUser,
  findUserByEmail,
  findUserByEmailAuth,
  findUserByRegistrationNumber,
  getUserById,
  getUserResponsable,
  updateUserResponsibilitiesDepartment,
  updateUserRoles
});
