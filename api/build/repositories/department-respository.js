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

// src/repositories/department-respository.ts
var department_respository_exports = {};
__export(department_respository_exports, {
  createDepartment: () => createDepartment,
  deleteDepartment: () => deleteDepartment,
  getDepartment: () => getDepartment,
  getDepartmentById: () => getDepartmentById,
  updateDepartment: () => updateDepartment,
  updateDepartmentResponsibilities: () => updateDepartmentResponsibilities
});
module.exports = __toCommonJS(department_respository_exports);

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

// src/repositories/department-respository.ts
async function createDepartment(data) {
  const department = await prisma.department.create({
    data
  });
  return department;
}
async function getDepartment() {
  const departments = await prisma.department.findMany();
  return departments;
}
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
async function updateDepartmentResponsibilities(departmentId, addUserIds, removeUserIds) {
  const department = await prisma.department.update({
    where: { id: departmentId },
    data: {
      responsables: {
        connect: addUserIds.map((id) => ({ id })),
        disconnect: removeUserIds.map((id) => ({ id }))
      }
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
  const changeModifiedUserRole = [...addUserIds, ...removeUserIds];
  changeModifiedUserRole.map((user) => {
    updateResponsibilityAndRole(user);
  });
  return department;
}
async function deleteDepartment(id) {
  await prisma.department.delete({
    where: { id }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentById,
  updateDepartment,
  updateDepartmentResponsibilities
});
