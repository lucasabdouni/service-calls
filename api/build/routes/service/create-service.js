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

// src/routes/service/create-service.ts
var create_service_exports = {};
__export(create_service_exports, {
  createServiceHandler: () => createServiceHandler
});
module.exports = __toCommonJS(create_service_exports);

// src/env.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string().url(),
  WEB_URL: import_zod.z.string().url(),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

// src/errors/client-erro.ts
var ClientError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ClientError";
  }
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

// src/routes/service/create-service.ts
var import_nodemailer2 = __toESM(require("nodemailer"));
var import_zod2 = __toESM(require("zod"));
var PriorityEnum = import_zod2.default.enum(["Baixa", "Media", "Alta"]);
var bodySchema = import_zod2.default.object({
  local: import_zod2.default.string({ message: "Local is mandatory" }),
  problem: import_zod2.default.string({ message: "Problem is mandatory" }),
  department_id: import_zod2.default.string({ message: "Department is mandatory" }).uuid({ message: "Department id is invalid" }),
  problem_description: import_zod2.default.string({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServiceHandler
});
