import { Readable } from "stream";
import xml from "xml";

import NodeCollection, { INodeCollection, INodes } from "./NodeCollection";
export interface ISearchResponse extends INodeCollection {
  count: number;
  lastPage: boolean;
}

export default class SearchResponse extends NodeCollection {
  constructor(searchResponse: ISearchResponse);
  constructor(nodes: INodes, count: number, lastPage: boolean);
  constructor(
    nodesOrSearchResponse: ISearchResponse | INodes,
    count?: number,
    lastPage?: boolean
  ) {
    if ("nodes" in nodesOrSearchResponse) {
      super(nodesOrSearchResponse.nodes);
    } else {
      super(nodesOrSearchResponse);
      this.count = count;
      this.lastPage = lastPage;
    }
  }
  count: number;
  lastPage: boolean;
  toJSON(pretty: string): Promise<string>;
  toJSON(pretty: string, stream: false): Promise<string>;
  toJSON(pretty: string, stream: true): Readable;
  toJSON(
    pretty: string = "",
    stream: boolean = false
  ): Readable | Promise<string> {
    if (stream) {
      async function* generator(
        this: SearchResponse
      ): AsyncGenerator<string, string, string> {
        yield `{${pretty}"count":${JSON.stringify(
          this.count
        )},${pretty}"lastPage": ${this.lastPage},${pretty}"nodes":[${pretty}`;
        for await (const node of this.nodes) {
          yield `${JSON.stringify(node, undefined, pretty)}${pretty}`;
        }
        return `]`;
      }
      return Readable.from(generator.bind(this)());
    } else {
      let str = ``;
      return new Promise((resolve, reject) => {
        this.toJSON(pretty, true)
          .on("data", (chunk: string) => {
            str += chunk;
          })
          .on("close", () => resolve(str))
          .on("error", (error: Error) => {
            reject(error);
          });
      });
    }
  }
  toXML(): ReturnType<typeof xml.Element> {
    const root = xml.Element({
      _attr: {
        lastPage: this.lastPage,
        count: this.count,
      },
    });
    (async () => {
      for await (let node of this.nodes) root.push({ Result: node.toXML() });
      root.close();
    })();
    return root;
  }
  static isSearchResponse(
    potentialSearch: any
  ): potentialSearch is SearchResponse {
    return (
      typeof potentialSearch === "object" &&
      "nodes" in potentialSearch &&
      "count" in potentialSearch &&
      "lastPage" in potentialSearch &&
      typeof potentialSearch.nodes === "number" &&
      typeof potentialSearch.count === "number" &&
      typeof potentialSearch.nodes === "object" &&
      Array.isArray(potentialSearch.nodes) &&
      NodeCollection.isNodeArray(potentialSearch.nodes)
    );
  }
}
