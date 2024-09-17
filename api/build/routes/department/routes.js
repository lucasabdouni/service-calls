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

// src/routes/department/routes.ts
var routes_exports = {};
__export(routes_exports, {
  departmentRoutes: () => departmentRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/errors/client-erro.ts
var ClientError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ClientError";
  }
};

// src/middlewares/verify-jwt.ts
async function verifyJwt(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    if (request.user) {
      throw new ClientError(401, "token.expired");
    } else throw new ClientError(401, "Unauthorized");
  }
}

// src/middlewares/verify-user-role.ts
function verifyUserRole(...rolesToVerify) {
  return async (request, reply) => {
    const { role } = request.user;
    if (!rolesToVerify.includes(role)) {
      throw new ClientError(401, "Unauthorized");
    }
  };
}

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

// src/routes/department/delete-department.ts
var import_zod2 = __toESM(require("zod"));
var paramsSchema = import_zod2.default.object({
  departmentId: import_zod2.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var deleteDepartmentHandler = async (request) => {
  const { departmentId } = paramsSchema.parse(request.params);
  const checkDepartmentExists = await getDepartmentById(departmentId);
  if (!checkDepartmentExists) throw new ClientError(409, "service not found.");
  await deleteDepartment(departmentId);
  return true;
};

// src/routes/department/get-departments.ts
var getDepartmentHandler = async (request) => {
  const departments = await getDepartment();
  if (!departments) {
    return "No department registered";
  }
  return { departments };
};

// src/routes/department/get-departments-by-id.ts
var import_zod3 = __toESM(require("zod"));
var paramsSchema2 = import_zod3.default.object({
  id: import_zod3.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getDepartmentByIdHandler = async (request) => {
  const { id } = paramsSchema2.parse(request.params);
  const department = await getDepartmentById(id);
  if (!department) throw new ClientError(409, "Department not found.");
  return { department };
};

// src/routes/department/update-department.ts
var import_zod4 = __toESM(require("zod"));
var paramsSchema3 = import_zod4.default.object({
  id: import_zod4.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema2 = import_zod4.default.object({
  name: import_zod4.default.string({ message: "Name is mandatory" }),
  sigla: import_zod4.default.string({ message: "Sigla is mandatory" }).min(1, { message: "Sigla must have at least 1 characters" })
});
var updateDepartmentHandler = async (request) => {
  const { name, sigla } = bodySchema2.parse(request.body);
  const { id } = paramsSchema3.parse(request.params);
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

// src/routes/department/update-responsibles-department.ts
var import_zod5 = __toESM(require("zod"));
var paramsSchema4 = import_zod5.default.object({
  id: import_zod5.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema3 = import_zod5.default.object({
  addUserIds: import_zod5.default.array(import_zod5.default.string().uuid()).optional(),
  removeUserIds: import_zod5.default.array(import_zod5.default.string().uuid()).optional()
});
var updateDepartmentResponsibilitiesHandler = async (request) => {
  const { addUserIds, removeUserIds } = bodySchema3.parse(request.body);
  const { id } = paramsSchema4.parse(request.params);
  const checkDepartmentExists = await getDepartmentById(id);
  if (!checkDepartmentExists) {
    throw new ClientError(409, "Deparment not found.");
  }
  const department = await updateDepartmentResponsibilities(
    id,
    addUserIds || [],
    removeUserIds || []
  );
  return { department };
};

// src/routes/department/routes.ts
async function departmentRoutes(app) {
  app.withTypeProvider().post(
    "/department",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    createDepartmentHandler
  );
  app.withTypeProvider().get("/departments", { onRequest: [verifyJwt] }, getDepartmentHandler);
  app.withTypeProvider().get(
    "/department/:id",
    {
      onRequest: [verifyJwt]
    },
    getDepartmentByIdHandler
  );
  app.withTypeProvider().put(
    "/department/:id",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateDepartmentHandler
  );
  app.withTypeProvider().put(
    "/department/:id/responsibles",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateDepartmentResponsibilitiesHandler
  );
  app.withTypeProvider().delete(
    "/department/:id/",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    deleteDepartmentHandler
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  departmentRoutes
});
