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

// src/error-handler.ts
var error_handler_exports = {};
__export(error_handler_exports, {
  errorHandler: () => errorHandler
});
module.exports = __toCommonJS(error_handler_exports);
var import_zod = require("zod");

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
  if (error instanceof import_zod.ZodError) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorHandler
});
