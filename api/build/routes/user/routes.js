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

// src/routes/user/routes.ts
var routes_exports = {};
__export(routes_exports, {
  userRoutes: () => userRoutes
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

// src/repositories/user-repository.ts
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

// src/routes/user/get-user.ts
var getUserByIdHandler = async (request) => {
  await request.jwtVerify();
  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, "User not found.");
  return { user };
};

// src/routes/user/get-user-by-email.ts
var import_zod = __toESM(require("zod"));
var paramsSchema = import_zod.default.object({
  userEmail: import_zod.default.string({ message: "Email is invalid" })
});
var getServicesByUserEmailHandler = async (request) => {
  const { userEmail } = paramsSchema.parse(request.params);
  const user = await findUserByEmail(userEmail);
  if (!user) throw new ClientError(409, "User not found.");
  return { user };
};

// src/routes/user/register-user.ts
var import_bcryptjs = require("bcryptjs");
var import_zod2 = __toESM(require("zod"));
var bodySchema = import_zod2.default.object({
  name: import_zod2.default.string({ message: "Name is mandatory" }).min(3, { message: "Name must have at least 3 characters" }),
  email: import_zod2.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  password: import_zod2.default.string({ message: "Password is mandatory" }).min(6, { message: "Password must have at least 6 characters" }),
  registration_number: import_zod2.default.number({ message: "Registration is mandatory" }),
  department: import_zod2.default.string({ message: "Department is mandatory" }).min(3, "Department must have at least 3 characters"),
  ramal: import_zod2.default.number({ message: "Ramal is mandatory" })
});
var registerUserHandler = async (request) => {
  const { name, email, password, department, ramal, registration_number } = bodySchema.parse(request.body);
  const verifyEmailAlready = await findUserByEmail(email);
  if (verifyEmailAlready)
    throw new ClientError(409, "E-mail already registered");
  const verifyRegistrationNumerAlready = await findUserByRegistrationNumber(registration_number);
  if (verifyRegistrationNumerAlready)
    throw new ClientError(409, "Registration number already registered");
  const password_hash = await (0, import_bcryptjs.hash)(password, 6);
  const user = await createUser({
    name,
    email,
    password_hash,
    registration_number,
    department,
    ramal
  });
  return { user: user.id };
};

// src/routes/user/update-user-responsibles-department.ts
var import_zod3 = __toESM(require("zod"));
var paramsSchema2 = import_zod3.default.object({
  id: import_zod3.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema2 = import_zod3.default.object({
  addDepartmentsIds: import_zod3.default.array(import_zod3.default.string().uuid()).optional(),
  removeDepartmentsIds: import_zod3.default.array(import_zod3.default.string().uuid()).optional()
});
var updateUserResponsibilitiesDepartmentHandler = async (request) => {
  const { addDepartmentsIds, removeDepartmentsIds } = bodySchema2.parse(
    request.body
  );
  const { id } = paramsSchema2.parse(request.params);
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

// src/routes/user/update-user-roles.ts
var import_zod4 = __toESM(require("zod"));
var RoleEnumSchema = import_zod4.default.enum(["ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */, "MEMBER" /* MEMBER */]);
var bodySchema3 = import_zod4.default.object({
  email: import_zod4.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  role: RoleEnumSchema
});
var updateUserRolesHandler = async (request) => {
  const { email, role } = bodySchema3.parse(request.body);
  const verifyEmailAlready = await findUserByEmail(email);
  if (!verifyEmailAlready) throw new ClientError(409, "User not found");
  const user = await updateUserRoles(email, role);
  return { user: user.id };
};

// src/routes/user/routes.ts
async function userRoutes(app) {
  app.withTypeProvider().post("/user", registerUserHandler);
  app.withTypeProvider().get("/me", { onRequest: [verifyJwt] }, getUserByIdHandler);
  app.withTypeProvider().put(
    "/user/update-role",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateUserRolesHandler
  );
  app.withTypeProvider().get(
    "/user/:userEmail",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    getServicesByUserEmailHandler
  );
  app.withTypeProvider().put(
    "/user/:id/update-departments-responsable",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateUserResponsibilitiesDepartmentHandler
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});
