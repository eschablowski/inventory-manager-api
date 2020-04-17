const parser = require("json-schema-ref-parser");

module.exports = function (source: string) {
  const callback = this.async();
  this.cacheable();
  parser
    .bundle(this.resourcePath, {
      //@ts-ignore
      baseFolder: this.resourcePath,
    })
    .then((dereferenced) => {
      callback(null, JSON.stringify(dereferenced));
    })
    .catch((error) => {
      callback(error);
    });
};
