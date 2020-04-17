import Types from "./types";
import xml from "xml";
import { parse, generate } from "../id";

export interface INode {
  id: string;
  type: Types;
}

export class InvalidINodeError extends Error {
  constructor(public node: any) {
    super(`Invalid INode encountered, was ${node}`);
  }
}

export default class Node implements INode {
  #id: Buffer;
  constructor(id: string);
  constructor(node: INode);
  constructor(nodeOrId: string | INode) {
    if (typeof nodeOrId === "string") {
      const props = parse(nodeOrId);
      this.#id = props.id;
    } else if (
      typeof nodeOrId === "object" &&
      "id" in nodeOrId &&
      "type" in nodeOrId &&
      typeof nodeOrId.type === "number" &&
      typeof Types[nodeOrId.type] !== "undefined" &&
      Buffer.isBuffer(nodeOrId.id)
    ) {
      this.#id = nodeOrId.id;
      this._type = nodeOrId.type;
    } else if (Node.isINode(nodeOrId)) {
      this.#id = parse(nodeOrId.id).id;
      this._type = nodeOrId.type;
    } else {
      throw new InvalidINodeError(nodeOrId);
    }
  }
  protected _type: Types;
  public get __typename(): string {
    let typename = Types[this._type];
    return typename.split("_").map((part) => {
      return `${part[0].toUpperCase()}${part.substr(1).toLowerCase()}`;
    }).join("");
  }
  public get id(): string {
    return generate(this._type, this.#id);
  }
  protected setID(id: Buffer) {
    this.#id = Buffer.allocUnsafe(id.byteLength);
    id.copy(this.#id);
  }
  public get type(): Types {
    return this._type;
  }
  public toXML(): ReturnType<typeof xml.Element> {
    const elem = xml.Element([
      {
        _attr: {
          type: this.type.toString(),
        },
      },
      { id: this.id },
    ]);
    elem.close();
    return elem;
  }
  public toJSON(pretty: string = ""): string {
    return JSON.stringify(
      {
        id: this.id,
        type: this._type.toString(),
      },
      undefined,
      pretty
    );
  }
  public static isINode(potentialNode: any): potentialNode is INode {
    return (
      "id" in potentialNode &&
      "type" in potentialNode &&
      typeof potentialNode.id === "string" &&
      (typeof potentialNode.type === "string" ||
        typeof potentialNode.type === "number") &&
      typeof Types[potentialNode.type] !== "undefined"
    );
  }
}
