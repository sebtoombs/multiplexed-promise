const promiseCache = new Map();

export interface Options {
  debug?: boolean;
}

const MultiplexedPromise = (
  promiseGenerator: (...args: any[]) => Promise<any>,
  // eslint-disable-next-line
  options?: Options
) => {
  const { debug = false } = options || {};

  const ts = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const _debug = (...args) =>
    !!debug &&
    // eslint-disable-next-line no-console
    console.debug.call(console, `[${ts()}] MultiplexedPromise:`, ...args);

  const key = Symbol("promise-key");

  return async (...args: any[]): Promise<any> => {
    const pendingPromise = promiseCache.get(key);
    if (pendingPromise) {
      _debug("pendingPromise found, waiting for it to resolve");
      return pendingPromise;
    }

    _debug("no pendingPromise found, creating a new one");
    const promise = promiseGenerator(...args);

    promiseCache.set(key, promise);

    return promise.then((r) => {
      _debug("promise resolved, removing from cache");
      promiseCache.delete(key);
      return r;
    });
  };
};

export default MultiplexedPromise;
