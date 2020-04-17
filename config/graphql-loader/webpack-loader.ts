import {
  Source,
  UniversalLoader,
  DocumentPointerSingle,
  SchemaPointerSingle,
  parseGraphQLSDL,
  SingleFileOptions,
} from "@graphql-toolkit/common";

import { loader as webpackLoader } from "webpack";
import { promisify } from "util";
import { readFile } from "fs";

export default class WebpackLoader
  implements UniversalLoader<SingleFileOptions> {
  private webpack: webpackLoader.LoaderContext;
  private resolve: (context: string, request: string) => Promise<string>;
  private resolveSync: (context: string, request: string) => string;
  private loadModule: (request: string) => Promise<string>;
  private readFile = promisify(readFile);
  constructor(webpack: webpackLoader.LoaderContext) {
    this.webpack = webpack;
    this.resolve = promisify(webpack.resolve);
    this.loadModule = promisify(webpack.loadModule);
    this.resolveSync = webpack.resolveSync;
  }
  loaderId(): string {
    return "webpack";
  }

  async canLoad(
    pointer: SchemaPointerSingle | DocumentPointerSingle,
    options: SingleFileOptions
  ): Promise<boolean> {
    return !!(await this.resolve(options.cwd, pointer));
  }

  canLoadSync(
    pointer: SchemaPointerSingle | DocumentPointerSingle,
    options: SingleFileOptions
  ): boolean {
    return !!this.resolveSync(options.cwd, pointer);
  }

  async load(
    pointer: SchemaPointerSingle | DocumentPointerSingle,
    options: SingleFileOptions
  ): Promise<Source> {
    const normalizedFilePath = await this.resolve(options.cwd, pointer);
    this.webpack.addDependency(normalizedFilePath);
    const rawSDL = (await this.readFile(normalizedFilePath, "utf-8"))
      .toString()
      .trim();
    return parseGraphQLSDL(pointer, rawSDL, options);
  }
}
