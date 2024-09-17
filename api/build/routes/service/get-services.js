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

// src/routes/service/get-services.ts
var get_services_exports = {};
__export(get_services_exports, {
  getServicesHandler: () => getServicesHandler
});
module.exports = __toCommonJS(get_services_exports);

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

// src/repositories/service-repository.ts
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

// src/routes/service/get-services.ts
var import_dayjs = __toESM(require("dayjs"));
var import_zod = __toESM(require("zod"));
var paramsSchema = import_zod.default.object({
  starts_at: import_zod.default.string({ message: "Date start is invalid" }).optional(),
  ends_at: import_zod.default.string({ message: "Date end is invalid" }).optional(),
  accomplished: import_zod.default.string().optional().refine((val) => val === "true" || val === "false", {
    message: "Accomplished is invalid"
  }).transform((val) => val === "true").default("false")
});
var getServicesHandler = async (request) => {
  const { starts_at, ends_at, accomplished } = paramsSchema.parse(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getServicesHandler
});
