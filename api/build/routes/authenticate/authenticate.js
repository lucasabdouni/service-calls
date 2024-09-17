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

// src/routes/authenticate/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  authenticateUserHandler: () => authenticateUserHandler
});
module.exports = __toCommonJS(authenticate_exports);

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
async function findUserByEmailAuth(email) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return user;
}

// src/routes/authenticate/authenticate.ts
var import_bcryptjs = require("bcryptjs");
var import_zod = __toESM(require("zod"));
var bodySchema = import_zod.default.object({
  email: import_zod.default.string({ message: "Email is mandatory" }).email({ message: "Email invalid" }),
  password: import_zod.default.string({ message: "Password is mandatory" }).min(6, { message: "Password must have at least 6 characters" })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUserHandler
});
