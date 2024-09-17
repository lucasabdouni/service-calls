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

// src/middlewares/verify-jwt.ts
var verify_jwt_exports = {};
__export(verify_jwt_exports, {
  verifyJwt: () => verifyJwt
});
module.exports = __toCommonJS(verify_jwt_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifyJwt
});
