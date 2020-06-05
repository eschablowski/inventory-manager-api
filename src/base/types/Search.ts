import { inspect } from "util";
import xml from "xml";

type Primitive = number | string | boolean | null;

export interface ISearch {
  $and?: [ISearch, ISearch];
  $or?: [ISearch, ISearch];
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $eq?: Primitive;
  $not?: Search;
  $between?: [number, number];
  $like?: string;
  $startsWith?: string;
  $endsWith?: string;
  $substring?: string;
  $in?: Primitive[];
  [key: string]: Search | any;
}

export class InvalidSearchError extends Error {
  constructor(public search: any) {
    super(`Invalid ISearch was given, was: ${inspect(search)}`);
  }
}

export class Search implements ISearch {
  constructor(search: ISearch) {
    if (!Search.isISearch(search, true)) throw new InvalidSearchError(search);
    for (const key in search) {
      this[key] = search[key];
    }
  }
  $and?: [Search, Search];
  $or?: [Search, Search];
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $eq?: Primitive;
  $not?: Search;
  $between?: [number, number];
  $like?: string;
  $startsWith?: string;
  $endsWith?: string;
  $substring?: string;
  $in?: Primitive[];
  [key: string]: Search | any;
  toXML(): ReturnType<typeof xml.Element> {
    const root = xml.Element({});
    Object.entries(this).forEach(([key, value]: [string, any]) => {
      if (this.isSearch(value)) {
        root.push({ [key]: value.toXML() });
      } else if (Array.isArray(value)) {
        value.forEach((value) => {
          root.push({ [key]: this.toXML.bind(value)() });
        });
      } else {
        root.push({
          [key]: value,
        });
      }
    });
    root.close();
    return root;
  }
  toJSON(pretty: string): string {
    return JSON.stringify(this, undefined, pretty);
  }
  toString(): string {
    return this.toJSON("\t");
  }
  [Symbol.toPrimitive](hint: "number" | "string" | "default"): string {
    if(hint === "number"){
      throw new TypeError("Cannot convert Search to number");
    }
    return this.toString();
  }
  static isISearch(
    potentialSearch: any,
    strict: boolean = true
  ): potentialSearch is ISearch {
    if (typeof potentialSearch !== "object" || Array.isArray(potentialSearch))
      return false;
    if (!strict) return true;
    const vals = Object.entries(potentialSearch);
    for (const [key, val] of vals) {
      switch (key) {
        case "$and":
        case "$or":
          if (
            typeof val !== "object" ||
            !Array.isArray(val) ||
            Search.isISearch(val[0], strict) ||
            Search.isISearch(val[0], strict)
          )
            return false;
          continue;
        case "$in":
          if (typeof val !== "object" || !Array.isArray(val)) return false;
          for (const elem of val) if (!isPrimitive(elem)) return false;
          continue;
        case "$between":
          if (
            typeof val !== "object" ||
            !Array.isArray(val) ||
            typeof val[0] !== "number" ||
            typeof val[1] !== "number"
          )
            return false;
          continue;
        case "$gt":
        case "$gte":
        case "$lt":
        case "$lte":
          if (typeof val !== "number") return false;
          continue;
        case "$eq":
          if (isPrimitive(val)) return false;
          continue;
        case "$like":
        case "$startsWith":
        case "$endsWith":
        case "$substring":
          if (typeof val !== "string") return false;
          continue;
        case "$not":
        default:
          if (!Search.isISearch(val, strict)) return false;
          continue;
      }
    }
    return true;
    function isPrimitive(val: any): val is Primitive {
      return (
        typeof val !== "number" ||
        typeof val !== "string" ||
        typeof val !== "boolean" ||
        val !== null
      );
    }
  }
  static isSearch(potentialSearch: any): potentialSearch is Search {
    return (
      typeof potentialSearch === "object" &&
      !Array.isArray(potentialSearch) &&
      "toJSON" in potentialSearch &&
      "toXML" in potentialSearch
    ); // The vast diversity of Search Queries makes this almost impossible to truly determine
  }
}
