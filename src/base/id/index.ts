import Types from "../types/types";
import * as gen0 from "./00";
import { IDGenerationUnimplementedError } from "./errors";

export interface INode {
  id: Buffer;
  type: Types;
}

export { Types };

export const latestGeneration = "00";

type encodings = "base64" | "hex" | "utf-8";
export function parse(id: string, encoding: encodings = "base64"): IProperties {
  const idBuffer = Buffer.from(id, encoding);
  let generationBuffer = Buffer.alloc(1);
  let offset = 0;
  do {
    if (offset >= generationBuffer.byteLength) {
      const temp = Buffer.alloc(generationBuffer.byteLength * 2);
      generationBuffer.copy(temp);
      generationBuffer = temp;
    }

    const genInt = idBuffer.readInt8(offset);
    generationBuffer.writeUInt8(Math.abs(genInt));
  } while (idBuffer.readInt8(offset++) < 0);
  return getGeneration(
    generationBuffer.subarray(0, offset).toString("hex")
  ).parse(idBuffer, offset);
}

export function generate(node: INode, generation?: string): string;
export function generate(type: Types, id: Buffer, generation?: string): string;
export function generate(type: any, id: any, generation?: string): string {
  if (typeof type === "object") {
    generation = id;
    id = (type as INode).id;
    type = (type as INode).type;
  }
  if (typeof generation !== "number") {
    generation = latestGeneration;
  }
  return getGeneration(generation).generate(type, id);
}

function getGeneration(generation: string) {
  switch (generation) {
    case "00":
      return gen0;
    default:
      throw new IDGenerationUnimplementedError(generation);
  }
}

export interface IProperties {
  type: Types;
  id: Buffer;
}

export * from "./errors";
