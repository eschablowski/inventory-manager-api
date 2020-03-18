const { src, dest, watch } = require("gulp");
const yaml = require("gulp-yaml");
const merge = require("gulp-merge-json");
const replace = require("gulp-replace");
const jsonEditor = require("gulp-json-editor");
const { smashStreams } = require("smash-streams");
const _ = require("lodash");

const yargs = require("yargs");
const jsonSchemaDeref = require("./utils/gulp.json-deref");

function openapi() {
  const { host } = yargs.option("host", {
    alias: "h",
    demandOption: false,
    default: "https://api.inventorymanager.com",
    describe: "The host to pair the shema ids with.",
    type: "string"
  }).argv;

  const openapi = src(["src/**/openapi3.yml"]).pipe(yaml({ safe: true }));
  const shema = src("src/**/schema.*.json")
    .pipe(jsonSchemaDeref())
    .pipe(
      jsonEditor(json => {
        return {
          components: {
            schemas: {
              [json.title]: json
            }
          }
        };
      })
    );

  return smashStreams(openapi, shema)
    .pipe(replace(/{{\s*host\s*}}/, host))
    .pipe(
      merge({
        fileName: "swagger.json",
        concatArrays: true
      })
    )
    .pipe(dest("build"));
}

exports.default = openapi;
exports.watch = () =>
  watch(
    ["src/**/openapi3.yml", "src/**/schema.*.json"],
    { ignoreInitial: false },
    openapi
  );
