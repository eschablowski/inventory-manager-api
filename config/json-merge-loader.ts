import { merge } from "lodash";

module.exports = function (source: string) {
  function readOpenapi(openapi: object | any[]) {
    if (Array.isArray(openapi)) {
      let obj = {};
      openapi.forEach((element) => {
        merge(obj, readOpenapi(element));
      });
      return obj;
    } else {
      return openapi;
    }
  }
  // Return the processed JSON to be used by the next item in the loader chain.
  return JSON.stringify(readOpenapi(JSON.parse(source)));
};
