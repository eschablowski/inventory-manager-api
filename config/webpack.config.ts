import * as path from "path";
import * as webpack from "webpack";
import PnpWebpackPlugin from "pnp-webpack-plugin";
import nodeExternals from "webpack-node-externals";

const root = path.resolve(__dirname, "..");
function getSrc(...paths: string[]) {
  return path.resolve(root, "src", ...paths);
}

const config: webpack.Configuration = {
  target: "node",
  entry: {
    index: getSrc("index.ts"),
    graphql: getSrc("graphql.ts"),
    openapi3: getSrc("openapi3.ts"),
  },
  devtool: false,
  output: {
    path: path.resolve(root, "build"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
    library: "inventory-manager",
    chunkFilename: "[hash].[ext]",
  },
  module: {
    rules: [
      {
        include: /.tsx?$/,
        loader: require.resolve("ts-loader"),
        exclude: /node_modules/,
        options: {
          onlyCompileBundledFiles: true,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "graphql-tag/loader",
          },
          {
            loader: require.resolve("./graphql-loader"),
          },
        ],
      },
      {
        test: /.(xml)$/,
        loader: "raw-loader",
      },
      {
        test: /\.ya?ml$/,
        use: [
          {
            loader: "json-loader",
          },
          {
            // test: /openapi/,
            loader: require.resolve("./json-merge-loader"),
          },
          {
            loader: "yaml-import-loader",
            options: {
              importRoot: true,
              output: "json",
              parser: {
                types: [require("./schema-filter-type")],
              },
            },
          },
        ],
        include: getSrc(),
      },
      {
        test: /schema[\.\w]*\.json$/,
        use: [
          {
            loader: require.resolve("./json-schema-deref-loader.ts"),
          },
        ],
      },
    ],
  },
  resolve: {
    plugins: [PnpWebpackPlugin],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  plugins: [],
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  externals: [
    nodeExternals({
      modulesFromFile: true,
    }),
    {
      openapi3: "commonjs ./openapi3.json",
    },
  ],
  node: false,
};
export default config;
