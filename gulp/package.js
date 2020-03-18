const { src, dest, watch } = require("gulp");
const jsonEditor = require("gulp-json-editor");



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

exports.watch = () => watch(["package.json"], packageJson);
exports.default = packageJson;
