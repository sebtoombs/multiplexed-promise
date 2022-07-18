# Multiplexed Promise

Multiplexed promise is a tiny, zero-dependency library that allows you to create a promise that can be resolved by multiple consumers.

> Think of it like one promise, multiple awaiters.

**Common uses;**

- Firing a fetch request _once_ in response to two or more simultaneous events
- ??

## Get Started

```typescript
import MultiplexedPromise from "multiplexed-promise";

// Create a "promise generator" - a function that returns a promise
const fetcher = () => fetch(`https://pokeapi.co/api/v2/pokemon/ditto`);

// Create a multiplexed version - this should live in a "service" or "utility" file, where it can be shared by multiple components
const fetchThing = multiplexedPromise(fetcher);

// Create a handler to handle the result of the multiplexed promise - in the case of a fetch response, we need to clone it
const getThing = () => fetchThing().then((r) => r.clone().json());

// Use it

getThing(); // Will fire the promise generator (fetcher)
await getThing(); // Will subscribe to the response from the first call

getThing(); // Will fire the promise generator again, as the first promise has resolved.
```

## Installation

Install via NPM:

```shell
npm install multiplexed-promise
```

Or with Yarn:

```shell
yarn add multiplexed-promise
```
