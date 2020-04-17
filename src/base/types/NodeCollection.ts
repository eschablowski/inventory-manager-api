import Node, { INode } from "./Node";
import { asyncGenerator } from "../../utils/index";

export type INodes =
  | Generator<INode>
  | AsyncGenerator<INode>
  | (INode | Promise<INode>)[];

export interface INodeCollection {
  nodes: INodes;
}

export class InvalidINodesError extends Error {
  constructor(public nodes: any) {
    super(`Invalid INodes object passed, was: ${nodes}`);
  }
}

export default class NodeCollection implements INodeCollection {
  constructor(nodes: INodes) {
    if (!NodeCollection.isINodes(nodes)) {
      throw new InvalidINodesError(nodes);
    }
    this.nodes = asyncGenerator.convert(asyncGenerator(nodes), (node) => {
      return new Node(node);
    });
  }
  nodes: AsyncGenerator<Node, number, Node>;
  static isINodes(potentialNodes: any) {
    return (
      typeof potentialNodes === "function" || this.isNodeArray(potentialNodes)
    );
  }
  static isINodeCollection(potentialNodeCollection) {
    return (
      typeof potentialNodeCollection === "object" &&
      "nodes" in potentialNodeCollection &&
      NodeCollection.isINodes(potentialNodeCollection.nodes)
    );
  }
  static isNodeArray(potentialNodeArray: any) {
    if (!Array.isArray(potentialNodeArray)) return false;
    for (const element in potentialNodeArray) {
      if (!Node.isINode(element)) return false;
    }
    return true;
  }
}
