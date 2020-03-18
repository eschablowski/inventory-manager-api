const { parallel} = require("gulp");
const openapi3 = require("./gulp/openapi");
const ts = require("./gulp/ts");
const graphql = require("./gulp/graphql");
const jsonSchema = require("./gulp/json-shema");
const docs = require("./gulp/docs");
const packageJson = require("./gulp/package");

exports.openapi = openapi3.default;
exports.watchOpenapi = openapi3.watch;

exports.ts = ts.default;
exports.watchTs = ts.watch;

exports.json = jsonSchema.default;
exports.watchJson = jsonSchema.watch;

exports.graphql = exports.gql = graphql.default;
exports.watchGraphQL = graphql.watch;

exports.packageJson = packageJson.default;
exports.watchPackageJson = packageJson.watch;

exports.readMe = exports.docs = docs.default;
exports.watchDocs = docs.watch;

exports.watch = parallel(
  exports.watchGraphQL,
  exports.watchJson,
  exports.watchTs,
  exports.watchOpenapi,
  exports.watchDocs,
  exports.watchPackageJson
);
exports.default = parallel(
  exports.graphql,
  exports.json,
  exports.ts,
  exports.openapi,
  exports.packageJson
);
