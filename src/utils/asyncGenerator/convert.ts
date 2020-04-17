export default async function* convert<T, G, TReturn>(
  gen: AsyncGenerator<T, TReturn, T>,
  conversionFunction: (value: T) => G
): AsyncGenerator<G, TReturn, G> {
  let it: IteratorResult<T, TReturn> = await gen.next();
  while (!it.done) {
    yield conversionFunction((it.value as unknown) as T);
    it = await gen.next();
  }
  return it.value;
}
