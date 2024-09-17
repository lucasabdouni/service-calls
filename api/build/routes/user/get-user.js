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

// src/routes/user/get-user.ts
var get_user_exports = {};
__export(get_user_exports, {
  getUserByIdHandler: () => getUserByIdHandler
});
module.exports = __toCommonJS(get_user_exports);

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

// src/routes/user/get-user.ts
var getUserByIdHandler = async (request) => {
  await request.jwtVerify();
  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, "User not found.");
  return { user };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserByIdHandler
});
