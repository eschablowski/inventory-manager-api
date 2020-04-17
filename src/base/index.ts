import node from "./schema.node.json";
import { Types } from "./types";

export const schemas = {
  node,
};

export { generate as generateID, parse as parseID } from "./id";

export * as mocks from "./mocks";
export * as types from "./types";
export * as examples from "./examples";
export {
  Types
};