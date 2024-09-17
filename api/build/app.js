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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_cors = __toESM(require("@fastify/cors"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_fastify = __toESM(require("fastify"));

// src/env.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string().url(),
  WEB_URL: import_zod.z.string().url(),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

// src/error-handler.ts
var import_zod2 = require("zod");

// src/errors/client-erro.ts
var ClientError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ClientError";
  }
};

// src/error-handler.ts
var errorHandler = (error, request, reply) => {
  if (error instanceof import_zod2.ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof ClientError) {
    return reply.status(Number(error.code)).send({
      message: error.message
    });
  }
  return reply.status(500).send({ message: "Internal server error" });
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

// src/routes/authenticate/authenticate.ts
var import_bcryptjs = require("bcryptjs");
var import_zod3 = __toESM(require("zod"));
var bodySchema = import_zod3.default.object({
  email: import_zod3.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  password: import_zod3.default.string({ message: "Password is mandatory" }).min(6, { message: "Password must have at least 6 characters" })
});
var authenticateUserHandler = async (request, reply) => {
  const { email, password } = bodySchema.parse(request.body);
  const user = await findUserByEmailAuth(email);
  if (!user) throw new ClientError(401, "Invalid credentials");
  const doesPasswordMatchnes = await (0, import_bcryptjs.compare)(password, user.password_hash);
  if (!doesPasswordMatchnes) throw new ClientError(401, "Invalid credentials");
  const token = await reply.jwtSign(
    {
      role: user.role
    },
    {
      sign: {
        sub: user.id
      }
    }
  );
  return { token };
};

// src/routes/authenticate/routes.ts
async function authenticateRoutes(app2) {
  app2.withTypeProvider().post("/sessions", authenticateUserHandler);
}

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
var import_zod4 = __toESM(require("zod"));
var bodySchema2 = import_zod4.default.object({
  name: import_zod4.default.string({ message: "Name is mandatory" }),
  sigla: import_zod4.default.string({ message: "Sigla is mandatory" }).min(1, { message: "Sigla must have at least 1 characters" })
});
var createDepartmentHandler = async (request) => {
  const { name, sigla } = bodySchema2.parse(request.body);
  const department = await createDepartment({
    name,
    sigla
  });
  return { department };
};

// src/routes/department/delete-department.ts
var import_zod5 = __toESM(require("zod"));
var paramsSchema = import_zod5.default.object({
  departmentId: import_zod5.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
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
var import_zod6 = __toESM(require("zod"));
var paramsSchema2 = import_zod6.default.object({
  id: import_zod6.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getDepartmentByIdHandler = async (request) => {
  const { id } = paramsSchema2.parse(request.params);
  const department = await getDepartmentById(id);
  if (!department) throw new ClientError(409, "Department not found.");
  return { department };
};

// src/routes/department/update-department.ts
var import_zod7 = __toESM(require("zod"));
var paramsSchema3 = import_zod7.default.object({
  id: import_zod7.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema3 = import_zod7.default.object({
  name: import_zod7.default.string({ message: "Name is mandatory" }),
  sigla: import_zod7.default.string({ message: "Sigla is mandatory" }).min(1, { message: "Sigla must have at least 1 characters" })
});
var updateDepartmentHandler = async (request) => {
  const { name, sigla } = bodySchema3.parse(request.body);
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
var import_zod8 = __toESM(require("zod"));
var paramsSchema4 = import_zod8.default.object({
  id: import_zod8.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema4 = import_zod8.default.object({
  addUserIds: import_zod8.default.array(import_zod8.default.string().uuid()).optional(),
  removeUserIds: import_zod8.default.array(import_zod8.default.string().uuid()).optional()
});
var updateDepartmentResponsibilitiesHandler = async (request) => {
  const { addUserIds, removeUserIds } = bodySchema4.parse(request.body);
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
async function departmentRoutes(app2) {
  app2.withTypeProvider().post(
    "/department",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    createDepartmentHandler
  );
  app2.withTypeProvider().get("/departments", { onRequest: [verifyJwt] }, getDepartmentHandler);
  app2.withTypeProvider().get(
    "/department/:id",
    {
      onRequest: [verifyJwt]
    },
    getDepartmentByIdHandler
  );
  app2.withTypeProvider().put(
    "/department/:id",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateDepartmentHandler
  );
  app2.withTypeProvider().put(
    "/department/:id/responsibles",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateDepartmentResponsibilitiesHandler
  );
  app2.withTypeProvider().delete(
    "/department/:id/",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    deleteDepartmentHandler
  );
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

// src/routes/service/confirm-accomplished-service.ts
var import_zod9 = __toESM(require("zod"));
var paramsSchema5 = import_zod9.default.object({
  serviceId: import_zod9.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var confirmAccomplishedServiceHandler = async (request) => {
  const { serviceId } = paramsSchema5.parse(request.params);
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

// src/lib/mail.ts
var import_nodemailer = __toESM(require("nodemailer"));
async function getMailClient() {
  const account = await import_nodemailer.default.createTestAccount();
  const transporter = import_nodemailer.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  return transporter;
}

// src/routes/service/create-service.ts
var import_nodemailer2 = __toESM(require("nodemailer"));
var import_zod10 = __toESM(require("zod"));
var PriorityEnum = import_zod10.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema5 = import_zod10.default.object({
  local: import_zod10.default.string({ message: "Local is mandatory" }),
  problem: import_zod10.default.string({ message: "Problem is mandatory" }),
  department_id: import_zod10.default.string({ message: "Department is mandatory" }).uuid({ message: "Department id is invalid" }),
  problem_description: import_zod10.default.string({
    message: "Description of the problem pro is mandatory"
  }),
  priority: PriorityEnum
});
var createServiceHandler = async (request) => {
  const { department_id, local, problem, problem_description, priority } = bodySchema5.parse(request.body);
  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, "User not found.");
  const departmentDetails = await getDepartmentById(department_id);
  if (!departmentDetails) throw new ClientError(409, "Department not found.");
  const data = {
    local,
    problem,
    problem_description,
    priority,
    user_id: user.id,
    department_id
  };
  const service = await createService(data);
  const mail = await getMailClient();
  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const serviceLink = `${env.WEB_URL}/servico/${service.id}`;
      const message = await mail.sendMail({
        from: {
          name: "Gerenciador de Servi\xE7os",
          address: "oi@service.com.br"
        },
        to: responsable.email,
        subject: `Nova requisi\xE7\xE3o de servi\xE7o: ${service.problem}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Ol\xE1, recebemos uma nova requi\xE7\xE3o de servi\xE7o: <strong>${service.problem}</strong></p>
              <p></p>
              <p>Descri\xE7\xE3o do do servi\xE7o:</p>
              <p></p>
              <p>${service.problem_description}</p>
              <p>Local: ${service.local}</p>
              <p>
                <a href="${serviceLink}">Visualizar</a>
              </p>
              <p></p>
              <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim()
      });
      console.log(import_nodemailer2.default.getTestMessageUrl(message));
    })
  );
  return { service };
};

// src/routes/service/delete-service.ts
var import_zod11 = __toESM(require("zod"));
var paramsSchema6 = import_zod11.default.object({
  serviceId: import_zod11.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var deleteServiceHandler = async (request) => {
  const { serviceId } = paramsSchema6.parse(request.params);
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
  await deleteService(checkServiceExists.id);
  return true;
};

// src/routes/service/get-services.ts
var import_dayjs = __toESM(require("dayjs"));
var import_zod12 = __toESM(require("zod"));
var paramsSchema7 = import_zod12.default.object({
  starts_at: import_zod12.default.string({ message: "Date start is invalid" }).optional(),
  ends_at: import_zod12.default.string({ message: "Date end is invalid" }).optional(),
  accomplished: import_zod12.default.string().optional().refine((val) => val === "true" || val === "false", {
    message: "Accomplished is invalid"
  }).transform((val) => val === "true").default("false")
});
var getServicesHandler = async (request) => {
  const { starts_at, ends_at, accomplished } = paramsSchema7.parse(
    request.query
  );
  const userId = request.user.sub;
  const startDate = starts_at ? (0, import_dayjs.default)(starts_at).startOf("day").toDate() : null;
  const endDate = ends_at ? (0, import_dayjs.default)(ends_at).startOf("day").set("hour", 23).set("minute", 59).toDate() : null;
  if (starts_at && (0, import_dayjs.default)(startDate).isAfter(endDate)) {
    throw new ClientError(401, "Invalid date");
  }
  const services = await getServices({
    userId,
    accomplished,
    startDate,
    endDate
  });
  if (services.length < 1) {
    return "No services registered in the selected data";
  }
  return { services };
};

// src/routes/service/get-services-by-id.ts
var import_zod13 = __toESM(require("zod"));
var paramsSchema8 = import_zod13.default.object({
  serviceId: import_zod13.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getServicesByIdHandler = async (request) => {
  const { serviceId } = paramsSchema8.parse(request.params);
  const service = await getServiceById(serviceId);
  if (!service) throw new ClientError(409, "service not found.");
  return { service };
};

// src/routes/service/get-services-by-user-id.ts
var import_zod14 = __toESM(require("zod"));
var paramsSchema9 = import_zod14.default.object({
  userId: import_zod14.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getServicesByUserIdHandler = async (request) => {
  const { userId } = paramsSchema9.parse(request.params);
  const user = await getUserById(userId);
  if (!user) throw new ClientError(409, "User not found.");
  const services = await getServiceByUserId(user.id);
  if (!services) {
    return "No services registered";
  }
  return { services };
};

// src/routes/service/transfer-department-service.ts
var import_nodemailer3 = __toESM(require("nodemailer"));
var import_zod15 = __toESM(require("zod"));
var bodySchema6 = import_zod15.default.object({
  department_id: import_zod15.default.string({ message: "Department is mandatory" }).uuid({ message: "Department id is invalid" })
});
var paramsSchema10 = import_zod15.default.object({
  serviceId: import_zod15.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var transferDepartmentServiceHandler = async (request) => {
  const data = bodySchema6.parse(request.body);
  const { serviceId } = paramsSchema10.parse(request.params);
  const { role } = request.user;
  const userId = request.user.sub;
  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, "Service not found.");
  }
  if (data.department_id === checkServiceExists.department.id) {
    throw new ClientError(409, "Service already belongs to this department.");
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
  const departmentDetails = await getDepartmentById(data.department_id);
  if (!departmentDetails) {
    throw new ClientError(409, "New department not found.");
  }
  const service = await updateServiceDepartment({ id: serviceId, data });
  const mail = await getMailClient();
  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const serviceLink = `${env.WEB_URL}/servico/${service.id}`;
      const message = await mail.sendMail({
        from: {
          name: "Gerenciador de Servi\xE7os",
          address: "oi@service.com.br"
        },
        to: responsable.email,
        subject: `Nova requisi\xE7\xE3o de servi\xE7o direcionada: ${service.problem}`,
        html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Ol\xE1, recebemos uma nova requi\xE7\xE3o de servi\xE7o: <strong>${service.problem}</strong></p>
                <p></p>
                <p>Descri\xE7\xE3o do do servi\xE7o:</p>
                <p></p>
                <p>${service.problem_description}</p>
                <p>Local: ${service.local}</p>
                <p>
                  <a href="${serviceLink}">Visualizar</a>
                </p>
                <p></p>
                <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
              </div>
            `.trim()
      });
      console.log(import_nodemailer3.default.getTestMessageUrl(message));
    })
  );
  return { service };
};

// src/routes/service/update-service.ts
var import_zod16 = __toESM(require("zod"));
var PriorityEnum2 = import_zod16.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema7 = import_zod16.default.object({
  local: import_zod16.default.string().optional(),
  problem: import_zod16.default.string().optional(),
  problem_description: import_zod16.default.string().optional(),
  priority: PriorityEnum2.optional(),
  occurs_at: import_zod16.default.coerce.date().optional(),
  responsible_accomplish: import_zod16.default.string().optional(),
  status: import_zod16.default.string().optional()
});
var paramsSchema11 = import_zod16.default.object({
  serviceId: import_zod16.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var updateServiceHandler = async (request) => {
  const data = bodySchema7.parse(request.body);
  const { serviceId } = paramsSchema11.parse(request.params);
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

// src/routes/service/routes.ts
async function serviceRoutes(app2) {
  app2.withTypeProvider().post("/service", { onRequest: [verifyJwt] }, createServiceHandler);
  app2.withTypeProvider().get(
    "/services",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    getServicesHandler
  );
  app2.withTypeProvider().get("/service/:serviceId", getServicesByIdHandler);
  app2.withTypeProvider().put(
    "/service/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    updateServiceHandler
  );
  app2.withTypeProvider().put(
    "/transfer-service-department/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    transferDepartmentServiceHandler
  );
  app2.withTypeProvider().get(
    "/services/user/:userId",
    {
      onRequest: [verifyJwt]
    },
    getServicesByUserIdHandler
  );
  app2.withTypeProvider().delete(
    "/service/:serviceId",
    {
      onRequest: [verifyJwt]
    },
    deleteServiceHandler
  );
  app2.withTypeProvider().get(
    "/accomplished/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    confirmAccomplishedServiceHandler
  );
}

// src/routes/user/get-user.ts
var getUserByIdHandler = async (request) => {
  await request.jwtVerify();
  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, "User not found.");
  return { user };
};

// src/routes/user/get-user-by-email.ts
var import_zod17 = __toESM(require("zod"));
var paramsSchema12 = import_zod17.default.object({
  userEmail: import_zod17.default.string({ message: "Email is invalid" })
});
var getServicesByUserEmailHandler = async (request) => {
  const { userEmail } = paramsSchema12.parse(request.params);
  const user = await findUserByEmail(userEmail);
  if (!user) throw new ClientError(409, "User not found.");
  return { user };
};

// src/routes/user/register-user.ts
var import_bcryptjs2 = require("bcryptjs");
var import_zod18 = __toESM(require("zod"));
var bodySchema8 = import_zod18.default.object({
  name: import_zod18.default.string({ message: "Name is mandatory" }).min(3, { message: "Name must have at least 3 characters" }),
  email: import_zod18.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  password: import_zod18.default.string({ message: "Password is mandatory" }).min(6, { message: "Password must have at least 6 characters" }),
  registration_number: import_zod18.default.number({ message: "Registration is mandatory" }),
  department: import_zod18.default.string({ message: "Department is mandatory" }).min(3, "Department must have at least 3 characters"),
  ramal: import_zod18.default.number({ message: "Ramal is mandatory" })
});
var registerUserHandler = async (request) => {
  const { name, email, password, department, ramal, registration_number } = bodySchema8.parse(request.body);
  const verifyEmailAlready = await findUserByEmail(email);
  if (verifyEmailAlready)
    throw new ClientError(409, "E-mail already registered");
  const verifyRegistrationNumerAlready = await findUserByRegistrationNumber(registration_number);
  if (verifyRegistrationNumerAlready)
    throw new ClientError(409, "Registration number already registered");
  const password_hash = await (0, import_bcryptjs2.hash)(password, 6);
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
var import_zod19 = __toESM(require("zod"));
var paramsSchema13 = import_zod19.default.object({
  id: import_zod19.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var bodySchema9 = import_zod19.default.object({
  addDepartmentsIds: import_zod19.default.array(import_zod19.default.string().uuid()).optional(),
  removeDepartmentsIds: import_zod19.default.array(import_zod19.default.string().uuid()).optional()
});
var updateUserResponsibilitiesDepartmentHandler = async (request) => {
  const { addDepartmentsIds, removeDepartmentsIds } = bodySchema9.parse(
    request.body
  );
  const { id } = paramsSchema13.parse(request.params);
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
var import_zod20 = __toESM(require("zod"));
var RoleEnumSchema = import_zod20.default.enum(["ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */, "MEMBER" /* MEMBER */]);
var bodySchema10 = import_zod20.default.object({
  email: import_zod20.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  role: RoleEnumSchema
});
var updateUserRolesHandler = async (request) => {
  const { email, role } = bodySchema10.parse(request.body);
  const verifyEmailAlready = await findUserByEmail(email);
  if (!verifyEmailAlready) throw new ClientError(409, "User not found");
  const user = await updateUserRoles(email, role);
  return { user: user.id };
};

// src/routes/user/routes.ts
async function userRoutes(app2) {
  app2.withTypeProvider().post("/user", registerUserHandler);
  app2.withTypeProvider().get("/me", { onRequest: [verifyJwt] }, getUserByIdHandler);
  app2.withTypeProvider().put(
    "/user/update-role",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateUserRolesHandler
  );
  app2.withTypeProvider().get(
    "/user/:userEmail",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    getServicesByUserEmailHandler
  );
  app2.withTypeProvider().put(
    "/user/:id/update-departments-responsable",
    { onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */)] },
    updateUserResponsibilitiesDepartmentHandler
  );
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cors.default, {
  origin: "*"
});
app.register(import_jwt.default, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: 60 * 60 * 2
    // 2 Hours
  }
});
app.setErrorHandler(errorHandler);
app.register(authenticateRoutes);
app.register(userRoutes);
app.register(serviceRoutes);
app.register(departmentRoutes);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
