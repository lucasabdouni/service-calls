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

// src/middlewares/verify-user-role.ts
var verify_user_role_exports = {};
__export(verify_user_role_exports, {
  verifyUserRole: () => verifyUserRole
});
module.exports = __toCommonJS(verify_user_role_exports);

// src/errors/client-erro.ts
var ClientError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ClientError";
  }
};

// src/middlewares/verify-user-role.ts
function verifyUserRole(...rolesToVerify) {
  return async (request, reply) => {
    const { role } = request.user;
    if (!rolesToVerify.includes(role)) {
      throw new ClientError(401, "Unauthorized");
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifyUserRole
});
