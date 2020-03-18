const path = require("path");
const { dest, watch } = require("gulp");
const source = require("vinyl-source-stream");
const { importSchema } = require("graphql-import");

async function graphql() {
  const stream = source("schema.gql");
  stream.end(
    await importSchema(path.resolve(__dirname, "..", "src", "index.gql"), {
      cwd: __dirname,
      forceSchemaDefinition: true
    })
  );
  return stream.pipe(dest("build")).pipe(dest("dist"));
}

exports.watch = () => watch(["src/**/.gql", "src/**/.graphql"], graphql);
exports.default = graphql;
