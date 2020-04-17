import { Node, SearchResponse, Types } from "./types";
import faker from "faker";
import { generateID } from ".";
import { asyncGenerator } from "../utils";
import { randomBytes } from "crypto";

export function node(
  type: Types = Types[
    faker.random.arrayElement(
      Object.values(Types).filter((val) => typeof val !== "number")
    )
  ]
): Node {
  return new Node({
    id: generateID(type, randomBytes(8), "00"),
    type: type,
  });
}
export function search(
  offset: boolean = false,
  max: number = 100,
  types?: Types[]
): SearchResponse {
  const last: boolean = faker.random.number(100) < 10;
  const count: number = last ? faker.random.number(max) : max;
  const nodes: Node[] = Array(count);
  for (let i: number = 0; i < count; i++) {
    nodes[i] = node(types ? faker.random.arrayElement(types) : undefined);
  }
  return new SearchResponse({
    nodes: asyncGenerator(nodes),
    count: offset && last ? count : faker.random.number(),
    lastPage: last,
  });
}
