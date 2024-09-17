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

// src/routes/user/register-user.ts
var register_user_exports = {};
__export(register_user_exports, {
  registerUserHandler: () => registerUserHandler
});
module.exports = __toCommonJS(register_user_exports);

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

// src/routes/user/register-user.ts
var import_bcryptjs = require("bcryptjs");
var import_zod = __toESM(require("zod"));
var bodySchema = import_zod.default.object({
  name: import_zod.default.string({ message: "Name is mandatory" }).min(3, { message: "Name must have at least 3 characters" }),
  email: import_zod.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  password: import_zod.default.string({ message: "Password is mandatory" }).min(6, { message: "Password must have at least 6 characters" }),
  registration_number: import_zod.default.number({ message: "Registration is mandatory" }),
  department: import_zod.default.string({ message: "Department is mandatory" }).min(3, "Department must have at least 3 characters"),
  ramal: import_zod.default.number({ message: "Ramal is mandatory" })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerUserHandler
});
