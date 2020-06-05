import Ajv from "ajv";
export const ajv = new Ajv({
  addUsedSchema: true,
});

import * as Base from "./base";

export * as openapi from "./openapi3";

export const mocks = {
  ...Base.mocks,
};

export const schemas = {
  ...Base.schemas,
};

export const examples = {
  ...Base.examples,
};

export const generateID = Base.generateID;
export const parseID = Base.parseID;

export const Types = Base.Types;

export { default as graphql } from "./graphql";

