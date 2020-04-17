/**
 * Author: Elias Schablowski
 * Date: March 27, 2020
 * Contains functions to convert JSON Schemas to valid OpenAPI spec schemas.
 */

import * as path from "path";
import { get, set } from "lodash";

import parser from "json-schema-ref-parser";
import { readFile } from "fs";
import { promisify } from "util";
import { Type } from "js-yaml";

/**
 * Filters invalid
 * @param json The JSON Schema.
 * @param id
 * @param definitionRewriter
 * @param path
 */
function filterSchema(
  json: any,
  id: string,
  definitionRewriter?: IDefinitionRewriter,
  path?: string
) {
  if (definitionRewriter === undefined) {
    definitionRewriter = definitionRewriterFactory(Object.assign({}, json));
  }
  if (path === undefined) {
    path = "";
  }
  if (typeof json !== "object") {
    return json;
  }
  delete json.definitions;
  delete json.$schema;
  delete json.$id;
  delete json.$comment;
  if (json.$ref && Object.keys(json).length !== 1) {
    json = Object.assign(
      json,
      filterSchema(
        definitionRewriter.get(json.$ref),
        id,
        definitionRewriter,
        path
      )
    );
    delete json.$ref;
  }
  if (typeof json.$ref === "string") {
    if (/^#\/definitions/.test(json.$ref))
      json = definitionRewriter(json.$ref, path, id);
    else if (json.$ref.indexOf(id) !== 0) {
      json.$ref = `${id}${json.$ref.slice(1)}`;
    }
  }
  Object.keys(json).map((key) => {
    let val = json[key];
    if (Array.isArray(val)) {
      val = val.filter((item, pos, self) => self.indexOf(item) === pos);
      json[key] = val.map((elem: any) =>
        filterSchema(elem, id, definitionRewriter, `${path}/${key}`)
      );
    } else if (typeof val === "object") {
      json[key] = filterSchema(val, id, definitionRewriter, `${path}/${key}`);
    }
  });
  return Object.assign({}, json);
}

interface IDefinitionRewriter {
  (definitionPath: string, path: string, id: string): any;
  get: (definitionPath: string) => any;
}
/**
 * Creates a function to rewrite references to the next one listed
 * @param ds The Schema
 */
function definitionRewriterFactory(ds: object) {
  const defs = JSON.parse(JSON.stringify(ds));
  let definitions = Object.assign({}, ds);

  let definitionRewriter: any = (
    definitionPath: string,
    path: string,
    id: string
  ) => {
    definitionPath = definitionPath.replace("#/", "").replace(/\//g, ".");
    const def = get(definitions, definitionPath);
    if (typeof def === "string") {
      return { $ref: `${id}${def.substr(1)}` };
    }
    set(definitions, definitionPath, `#${path}`);
    return def;
  };
  definitionRewriter.get = (definitionPath: string) => {
    definitionPath = definitionPath.replace("#/", "").replace(/\//g, ".");
    return get(defs, definitionPath);
  };
  return definitionRewriter as IDefinitionRewriter;
}

module.exports = (ctx: { directory: string; resolveAsync: boolean }) =>
  new Type("!import-schema", {
    kind: "mapping",
    resolve: (data) => {
      return (
        data !== null &&
        typeof data.loc === "string" &&
        typeof data.file === "string"
      );
    },
    construct: (data: { file: string; loc: string }) => {
      ctx.resolveAsync = true;
      return (async () => {
        const file = await resolve(ctx.directory, data.file);
        let openapi = JSON.parse(file.data.toString());
        if (typeof openapi === "object") {
          // @ts-ignore
          const derefed = await parser.bundle(file.file, {
            //@ts-ignore
            baseFolder: path.dirname(file.file),
          });
          openapi = filterSchema(derefed, `#/components/schemas/${data.loc}`);
        }
        return openapi;
      })();
    },
    instanceOf: Object,
  });
async function resolve(dir: string, file: string) {
  let location = file.startsWith(".")
    ? path.join(dir, file)
    : require.resolve(file);

  let data = await promisify(readFile)(location);
  return { file: location, data };
}
