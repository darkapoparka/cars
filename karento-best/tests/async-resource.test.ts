import assert from "node:assert/strict";
import { test } from "node:test";
import { ownAsyncResource } from "../src/lib/async-resource.ts";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
test("unmount before initialization allocates nothing", async () => {
  let allocated = false;
  const owner = ownAsyncResource(async () => {
    allocated = true;
  });
  owner.destroy();
  await owner.settled;
  assert.equal(allocated, false);
});
test("unmount during library loading prevents widget construction", async () => {
  const load = deferred();
  let allocated = false;
  const owner = ownAsyncResource(async (scope) => {
    await load.promise;
    if (!scope.active) return;
    allocated = true;
  });
  await Promise.resolve();
  owner.destroy();
  load.resolve();
  await owner.settled;
  assert.equal(allocated, false);
});
test("pending rendering is disposed immediately and exactly once", async () => {
  const render = deferred();
  let destroyed = 0;
  let ready = 0;
  const owner = ownAsyncResource(
    async (scope) => {
      scope.onCleanup(() => {
        destroyed++;
      });
      await render.promise;
    },
    {
      ready() {
        ready++;
      },
    },
  );
  await Promise.resolve();
  owner.destroy();
  assert.equal(destroyed, 1);
  render.resolve();
  await owner.settled;
  owner.destroy();
  assert.equal(destroyed, 1);
  assert.equal(ready, 0);
});
test("initialization failures release already allocated resources", async () => {
  let destroyed = 0;
  const errors: unknown[] = [];
  const failure = new Error("Failed to render");
  const owner = ownAsyncResource(
    async (scope) => {
      scope.onCleanup(() => {
        destroyed++;
      });
      throw failure;
    },
    {
      error(error) {
        errors.push(error);
      },
    },
  );
  await owner.settled;
  owner.destroy();
  assert.equal(destroyed, 1);
  assert.deepEqual(errors, [failure]);
});
test("cleanup is reverse-order, idempotent, and does not skip siblings", async () => {
  const order: number[] = [];
  const errors: unknown[] = [];
  const owner = ownAsyncResource(
    async (scope) => {
      scope.onCleanup(() => {
        order.push(1);
      });
      scope.onCleanup(() => {
        order.push(2);
        throw new Error("Cleanup failed");
      });
      scope.onCleanup(() => {
        order.push(3);
      });
    },
    {
      cleanupError(error) {
        errors.push(error);
      },
    },
  );
  await owner.settled;
  owner.destroy();
  owner.destroy();
  assert.deepEqual(order, [3, 2, 1]);
  assert.equal(errors.length, 1);
});
test("late cleanup registrations release immediately after unmount", async () => {
  const wait = deferred();
  let disposed = 0;
  const owner = ownAsyncResource(async (scope) => {
    await wait.promise;
    scope.onCleanup(() => {
      disposed++;
    });
  });
  await Promise.resolve();
  owner.destroy();
  wait.resolve();
  await owner.settled;
  assert.equal(disposed, 1);
});
