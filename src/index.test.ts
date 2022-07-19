import MultiplexedPromise from "./index";

describe("multiplexedPromise", () => {
  test("Returns the same promise when there is a pending promise", async () => {
    const promiseGenerator = jest.fn(() => Promise.resolve({ key: Symbol() }));
    const multiplexedPromise = MultiplexedPromise(promiseGenerator);

    const promise1 = multiplexedPromise();
    const promise2 = multiplexedPromise();

    const result1 = await promise1;
    const result2 = await promise2;

    expect(result1).toEqual(result2);

    expect(promiseGenerator).toHaveBeenCalledTimes(1);
  });

  test("Returns a new promise when there is no pending promise", async () => {
    const promiseGenerator = jest.fn(() => Promise.resolve({ key: Symbol() }));
    const multiplexedPromise = MultiplexedPromise(promiseGenerator);

    const promise1 = multiplexedPromise();
    const result1 = await promise1;
    const promise2 = multiplexedPromise();
    const result2 = await promise2;

    expect(result1).not.toEqual(result2);

    expect(promiseGenerator).toHaveBeenCalledTimes(2);
  });

  describe("options.debug", () => {
    test("Does not log when debug is false", async () => {
      console.debug = jest.fn();

      const promiseGenerator = jest.fn(() =>
        Promise.resolve({ key: Symbol() })
      );
      const multiplexedPromise = MultiplexedPromise(promiseGenerator);

      const promise1 = multiplexedPromise();
      const promise2 = multiplexedPromise();

      const result1 = await promise1;
      const result2 = await promise2;

      expect(console.debug).not.toHaveBeenCalled();
    });
    test("Logs to console when debug is true", async () => {
      console.debug = jest.fn();

      const promiseGenerator = jest.fn(() =>
        Promise.resolve({ key: Symbol() })
      );
      const multiplexedPromise = MultiplexedPromise(promiseGenerator, {
        debug: true,
      });

      const promise1 = multiplexedPromise();
      const promise2 = multiplexedPromise();

      const result1 = await promise1;
      const result2 = await promise2;

      expect(console.debug).toHaveBeenCalledTimes(3);
      // @ts-ignore
      expect(console.debug.mock.calls[0][1]).toMatch(
        /no pendingPromise found, creating a new one/
      );
      // @ts-ignore
      expect(console.debug.mock.calls[1][1]).toMatch(
        /pendingPromise found, waiting for it to resolve/
      );
      // @ts-ignore
      expect(console.debug.mock.calls[2][1]).toMatch(
        /promise resolved, removing from cache/
      );
    });
  });
});
