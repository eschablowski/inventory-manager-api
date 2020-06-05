import { ajv } from "../index";
// import node from "./schema.node.json";
// import search from "./schema.search.json";
// import searchResponse from "./schema.search.response.json";
import { Types } from "./types";

export const schemas = {
  // node,
  // search,
  // searchResponse,
};

export const validators = {
  // node: ajv.compile(node),
  // search: ajv.compile(search),
  // searchResponse: ajv.compile(searchResponse),
};

export { generate as generateID, parse as parseID } from "./id";

export * as mocks from "./mocks";
export * as types from "./types";
export * as examples from "./examples";
export { Types };
