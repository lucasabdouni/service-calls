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

// src/routes/service/routes.ts
var routes_exports = {};
__export(routes_exports, {
  serviceRoutes: () => serviceRoutes
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

// src/env.ts
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  DATABASE_URL: import_zod2.z.string().url(),
  WEB_URL: import_zod2.z.string().url(),
  JWT_SECRET: import_zod2.z.string(),
  PORT: import_zod2.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

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
var import_zod3 = __toESM(require("zod"));
var PriorityEnum = import_zod3.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema = import_zod3.default.object({
  local: import_zod3.default.string({ message: "Local is mandatory" }),
  problem: import_zod3.default.string({ message: "Problem is mandatory" }),
  department_id: import_zod3.default.string({ message: "Department is mandatory" }).uuid({ message: "Department id is invalid" }),
  problem_description: import_zod3.default.string({
    message: "Description of the problem pro is mandatory"
  }),
  priority: PriorityEnum
});
var createServiceHandler = async (request) => {
  const { department_id, local, problem, problem_description, priority } = bodySchema.parse(request.body);
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
var import_zod4 = __toESM(require("zod"));
var paramsSchema2 = import_zod4.default.object({
  serviceId: import_zod4.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var deleteServiceHandler = async (request) => {
  const { serviceId } = paramsSchema2.parse(request.params);
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
var import_zod5 = __toESM(require("zod"));
var paramsSchema3 = import_zod5.default.object({
  starts_at: import_zod5.default.string({ message: "Date start is invalid" }).optional(),
  ends_at: import_zod5.default.string({ message: "Date end is invalid" }).optional(),
  accomplished: import_zod5.default.string().optional().refine((val) => val === "true" || val === "false", {
    message: "Accomplished is invalid"
  }).transform((val) => val === "true").default("false")
});
var getServicesHandler = async (request) => {
  const { starts_at, ends_at, accomplished } = paramsSchema3.parse(
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
var import_zod6 = __toESM(require("zod"));
var paramsSchema4 = import_zod6.default.object({
  serviceId: import_zod6.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getServicesByIdHandler = async (request) => {
  const { serviceId } = paramsSchema4.parse(request.params);
  const service = await getServiceById(serviceId);
  if (!service) throw new ClientError(409, "service not found.");
  return { service };
};

// src/routes/service/get-services-by-user-id.ts
var import_zod7 = __toESM(require("zod"));
var paramsSchema5 = import_zod7.default.object({
  userId: import_zod7.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var getServicesByUserIdHandler = async (request) => {
  const { userId } = paramsSchema5.parse(request.params);
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
var import_zod8 = __toESM(require("zod"));
var bodySchema2 = import_zod8.default.object({
  department_id: import_zod8.default.string({ message: "Department is mandatory" }).uuid({ message: "Department id is invalid" })
});
var paramsSchema6 = import_zod8.default.object({
  serviceId: import_zod8.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var transferDepartmentServiceHandler = async (request) => {
  const data = bodySchema2.parse(request.body);
  const { serviceId } = paramsSchema6.parse(request.params);
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
var import_zod9 = __toESM(require("zod"));
var PriorityEnum2 = import_zod9.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema3 = import_zod9.default.object({
  local: import_zod9.default.string().optional(),
  problem: import_zod9.default.string().optional(),
  problem_description: import_zod9.default.string().optional(),
  priority: PriorityEnum2.optional(),
  occurs_at: import_zod9.default.coerce.date().optional(),
  responsible_accomplish: import_zod9.default.string().optional(),
  status: import_zod9.default.string().optional()
});
var paramsSchema7 = import_zod9.default.object({
  serviceId: import_zod9.default.string({ message: "Id is invalid" }).uuid({ message: "Id is invalid" })
});
var updateServiceHandler = async (request) => {
  const data = bodySchema3.parse(request.body);
  const { serviceId } = paramsSchema7.parse(request.params);
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
async function serviceRoutes(app) {
  app.withTypeProvider().post("/service", { onRequest: [verifyJwt] }, createServiceHandler);
  app.withTypeProvider().get(
    "/services",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    getServicesHandler
  );
  app.withTypeProvider().get("/service/:serviceId", getServicesByIdHandler);
  app.withTypeProvider().put(
    "/service/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    updateServiceHandler
  );
  app.withTypeProvider().put(
    "/transfer-service-department/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    transferDepartmentServiceHandler
  );
  app.withTypeProvider().get(
    "/services/user/:userId",
    {
      onRequest: [verifyJwt]
    },
    getServicesByUserIdHandler
  );
  app.withTypeProvider().delete(
    "/service/:serviceId",
    {
      onRequest: [verifyJwt]
    },
    deleteServiceHandler
  );
  app.withTypeProvider().get(
    "/accomplished/:serviceId",
    {
      onRequest: [verifyJwt, verifyUserRole("ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */)]
    },
    confirmAccomplishedServiceHandler
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  serviceRoutes
});
