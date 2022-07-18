const promiseCache = new Map();

export interface Options {}

const MultiplexedPromise = (
  promiseGenerator: (...args: any[]) => Promise<any>,
  // eslint-disable-next-line
  options?: Options
) => {
  const key = Symbol("promise-key");

  return async (...args: any[]): Promise<any> => {
    const pendingPromise = promiseCache.get(key);
    if (pendingPromise) {
      return pendingPromise;
    }

    const promise = promiseGenerator(...args);

    promiseCache.set(key, promise);

    return promise.then((r) => {
      promiseCache.delete(key);
      return r;
    });
  };
};

export default MultiplexedPromise;
