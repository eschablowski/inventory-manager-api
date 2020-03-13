const path = require("path");
const { src, dest, parallel, series, watch } = require("gulp");
const gulpTs = require("gulp-typescript");
const jsonEditor = require("gulp-json-editor");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const tar = require("gulp-tar");
const gzip = require("gulp-gzip");
const source = require("vinyl-source-stream");
const { importSchema } = require("graphql-import");
const yargs = require("yargs");

const jsonSchemaBundle = require("./gulp.json-bundle");

async function graphql() {
  const stream = source("schema.gql");
  stream.end(
    await importSchema(path.resolve(__dirname, "src", "index.gql"), {
      cwd: __dirname,
      forceSchemaDefinition: true
    })
  );
  return stream.pipe(dest("build")).pipe(dest("dist"));
}

function json() {
  const { host } = yargs.option("host", {
    alias: "h",
    demandOption: false,
    default: "https://schemas.inventorymanager.com",
    describe: "The host to pair the shema ids with.",
    type: "string"
  }).argv;
  return src(["src/*/schema.json", "src/*/schema.*.json"])
    .pipe(jsonSchemaBundle())
    .pipe(replace(/{{\s*host\s*}}/, host))
    .pipe(dest("build"))
    .pipe(
      rename(p => {
        p.basename = p.basename.replace("schema", p.dirname);
        p.dirname = "/";
      })
    )
    .pipe(tar("schemas.tar"))
    .pipe(gzip())
    .pipe(dest("dist"));
}

function ts() {
  const tsProject = gulpTs.createProject("tsconfig.json", {
    declaration: true
  });
  return src(["index.ts", "src/**/*.ts", "src/**/*.json"], {
    sourcemaps: true
  })
    .pipe(tsProject())
    .pipe(dest("build"));
}

function packageJson() {
  return src(["package.json"])
    .pipe(
      jsonEditor(json => {
        delete json.devDependencies;
        json.private = false;
        return json;
      })
    )
    .pipe(dest("build"));
}

exports.ts = ts;
exports.watchTs = () =>
  watch(["src/**/.ts", "tsconfig.json", "package.json", "index.ts"], ts);

exports.json = json;
exports.watchJson = () => watch(["src/**/.json"], json);

exports.graphql = graphql;
exports.gql = graphql;
exports.watchGraphQL = () => watch(["src/**/.gql", "src/**/.graphql"], graphql);

exports.packageJson = packageJson;

exports.watch = parallel(
  exports.watchGraphQL,
  exports.watchJson,
  exports.watchTs
);
exports.default = parallel(graphql, json, ts, packageJson);
