const path = require("path");
const { src, dest, parallel, series, watch } = require("gulp");
const gulpTs = require("gulp-typescript");
const rename = require("gulp-rename");
const gulpMerge = require("gulp-merge");
const source = require("vinyl-source-stream");
const { importSchema } = require("graphql-import");

const jsonSchemaBundle = require("./gulp.json-bundle");

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
    .pipe(jsonSchemaBundle())
    .pipe(dest("build/js"))
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
    .pipe(dest("build/js"));
}

exports.ts = series(json, ts);
exports.watchTs = () =>
  watch(["src/**/.ts", "tsconfig.json", "package.json"], ts);

exports.json = json;
exports.watchJson = () => watch(["src/**/.json"], json);

exports.graphql = graphql;
exports.gql = graphql;
exports.watchGraphQL = () => watch(["src/**/.gql", "src/**/.graphql"], graphql);

exports.watch = parallel(
  exports.watchGraphQL,
  exports.watchJson,
  exports.watchTs
);
exports.default = parallel(graphql, json, exports.ts);
