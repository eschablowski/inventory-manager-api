const path = require("path");
const { src, dest, watch } = require("gulp");
const gulpTs = require("gulp-typescript");

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

exports.default = ts;
exports.watch = () =>
  watch(["src/**/.ts", "tsconfig.json", "package.json", "index.ts"], ts);
