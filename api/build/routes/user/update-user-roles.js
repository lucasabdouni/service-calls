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

// src/routes/user/update-user-roles.ts
var update_user_roles_exports = {};
__export(update_user_roles_exports, {
  updateUserRolesHandler: () => updateUserRolesHandler
});
module.exports = __toCommonJS(update_user_roles_exports);

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

// src/routes/user/update-user-roles.ts
var import_zod = __toESM(require("zod"));
var RoleEnumSchema = import_zod.default.enum(["ADMIN" /* ADMIN */, "RESPONSIBLE" /* RESPONSIBLE */, "MEMBER" /* MEMBER */]);
var bodySchema = import_zod.default.object({
  email: import_zod.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  role: RoleEnumSchema
});
var updateUserRolesHandler = async (request) => {
  const { email, role } = bodySchema.parse(request.body);
  const verifyEmailAlready = await findUserByEmail(email);
  if (!verifyEmailAlready) throw new ClientError(409, "User not found");
  const user = await updateUserRoles(email, role);
  return { user: user.id };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateUserRolesHandler
});
