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
});
