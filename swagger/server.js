const express = require("express");
const { initialize } = require("express-openapi");
const { default: apiDoc } = require("../build/openapi3.js");
const swaggerUi = require("swagger-ui-express");
const examples = require("./examples");
const openBrowser = require("open");

const app = express();

initialize({
  app,
  // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
  // apiDoc: './api-v1/api-doc.yml',
  apiDoc: apiDoc,
  operations: new Proxy(
    {},
    {
      get: (target, property) => {
        return property in target
          ? target[property]
          : (req, res) => res.send("");
      },
      has: () => true,
    }
  ),
  // validateApiDoc: false
});
app.use("/examples", examples);

app.use(
  "/",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    req.hostname = "localhost";
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(apiDoc, {
    swaggerOptions: {
      deepLinking: false,
    },
  })
);
app.listen(3000, () => {
  console.log("opening Browser");
  openBrowser(`http://localhost:${3000}/#`);
});
