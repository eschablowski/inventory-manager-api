export const search = {
  "application/json": {
    "Basic Search": JSON.stringify(require("./search.json"), undefined, 4),
  },
  "application/xml": {
    "Basic Search": require("!!raw-loader!./search.xml") as string,
  },
};
