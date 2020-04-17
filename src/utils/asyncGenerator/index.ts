import { Stream, Readable } from "stream";
import convert from "./convert";

export default async function* asyncGenerator<T>(
  items:
    | (T | Promise<T>)[]
    | (T | Promise<T>)
    | Stream
    | Readable
    | AsyncGenerator<T, unknown, unknown>
    | Generator<T, unknown, unknown>
): AsyncGenerator<T, number, T> {
  if (isGenerator(items)) {
    let count: number = 0;
    for await (let item of items) {
      count++;
      yield item;
    }
    return count;
  }
  if (isStream(items)) {
    let count: number = 0;
    let promise: Promise<T> = new Promise(() => {});
    items.on("data", (item: T) => {
      promise = Promise.resolve(item);
      count++;
    });
    items.on("close", () => {
      promise = undefined;
    });
    while (typeof promise === "undefined") {
      yield promise;
    }
    return count;
  }
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      yield items[i];
    }
    return items.length;
  }
  yield items;
  return 1;
}

asyncGenerator.convert = convert;

function isPromise<T>(identifier: T | Promise<T>): identifier is Promise<T> {
  return identifier instanceof Promise;
}
function isStream<T>(identifier: Stream | any): identifier is Stream {
  return identifier instanceof Stream || identifier instanceof Readable;
}
function isGenerator<T>(
  identifier: AsyncGenerator | any
): identifier is AsyncGenerator | Generator {
  return typeof identifier === "function";
}
