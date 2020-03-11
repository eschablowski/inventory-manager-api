const path = require("path");
const { src, dest, parallel } = require("gulp");
const gulpTs = require("gulp-typescript");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const { importSchema } = require("graphql-import");

async function graphql() {
  const stream = source("schema.gql");
  stream.end(
    await importSchema(path.resolve(__dirname, "src", "index.gql"), {
      cwd: __dirname,
      forceSchemaDefinition: true
    })
  );
  return stream.pipe(dest("build"));
}

function json() {
  return src("src/*/schema.json")
    .pipe(
      rename(p => {
        p.basename = p.dirname;
        p.dirname = "/";
      })
    )
    .pipe(dest("build/json"));
}

function ts() {
  const tsProject = gulpTs.createProject("tsconfig.json", {
    declaration: true
  });
  return src(["src/index.ts", "src/**/*.ts", "src/**/*.json"], {
    sourcemaps: true
  })
    .pipe(tsProject())
    .pipe(dest("build/js", { sourcemaps: true }));
}

exports.ts = ts;
exports.json = json;
exports.graphql = graphql;
exports.gql = graphql;
exports.default = parallel(graphql, json, ts);
