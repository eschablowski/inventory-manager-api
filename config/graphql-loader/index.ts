import { loadSchema, loadTypedefs } from "@graphql-toolkit/core";
import * as webpack from "webpack";
import WebpackLoader from "./webpack-loader";
import { printSchema, GraphQLSchema, print } from "graphql";
import { dirname } from "path";
import { mergeTypeDefs } from "@graphql-toolkit/schema-merging";

export default async function (
  this: webpack.loader.LoaderContext,
  source: string
) {
  const callback = this.async();
  this.cacheable();
  try {
    const schema = await mergeTypeDefs((await loadTypedefs(this.resourcePath, {
      loaders: [new WebpackLoader(this)],
      cwd: dirname(this.resourcePath),
      assumeValid: true,
      assumeValidSDL: true,
      typeDefs: "scalar Upload",
    })).map(r => r.document));
    callback(null, print(schema));

    // try {
    //   const schema: GraphQLSchema = await loadSchema(source, {
    //     loaders: [new WebpackLoader(this)],
    //     cwd: dirname(this.resourcePath),
    //     assumeValid: true,
    //     assumeValidSDL: true,
    //     typeDefs: "scalar Upload"
    //   });
    //   console.log(schema);
    //   callback(null, printSchema(schema));
  } catch (error) {
    callback(error);
  }
}
