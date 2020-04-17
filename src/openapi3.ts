import type { OpenAPIV3 } from "openapi-types";
import { merge } from "lodash";
import yaml from "./openapi3.yml";

const openapi = readOpenapi(require(yaml)) as OpenAPIV3.Document;

function readOpenapi(openapi: object | any[]) {
  if (Array.isArray(openapi)) {
    let obj = {};
    openapi.forEach((element) => {
      merge(obj, readOpenapi(obj));
    });
    return obj;
  } else {
    return openapi;
  }
}

export default openapi;
