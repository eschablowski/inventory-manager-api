const { src, dest, watch } = require("gulp");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const tar = require("gulp-tar");
const gzip = require("gulp-gzip");
const yargs = require("yargs");

const jsonSchemaBundle = require("./utils/gulp.json-bundle");


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

exports.watch = () => watch(["src/**/schema.*.json"], json);
exports.default = json;
