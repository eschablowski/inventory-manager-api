const { src, dest, watch } = require("gulp");
const typedoc = require("gulp-typedoc");

function readMe() {
  return src(["src/**/*.ts"])
    .pipe(
      typedoc({
        readme: "README.md",
        out: "build/docs",
        plugins: ["typedoc-plugin-markdown"]
      })
    )
    .pipe(dest("build"));
}

exports.watch = () => watch(["src/**/*.ts", "README.md"], readMe);
exports.default = readMe;
