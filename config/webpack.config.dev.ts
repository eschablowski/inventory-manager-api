import merge from "webpack-merge";
import common from "./webpack.config";

export default merge.smart(common, {
  mode: "development",
});
