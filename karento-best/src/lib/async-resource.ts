/** Own asynchronous widget work without creating resources after unmount. */
export interface ResourceScope {
  readonly active: boolean;
  /** Register immediately after allocation, before awaiting further work. */
  onCleanup(dispose: () => void): void;
}
export interface ResourceEvents {
  ready?: () => void;
  error?: (error: unknown) => void;
  cleanupError?: (error: unknown) => void;
}
export function ownAsyncResource(
  initialize: (scope: ResourceScope) => Promise<void>,
  events: ResourceEvents = {},
): { destroy(): void; settled: Promise<void> } {
  let active = true;
  const cleanup: (() => void)[] = [];
  const dispose = (callback: () => void) => {
    try {
      callback();
    } catch (error: unknown) {
      events.cleanupError?.(error);
    }
  };
  const release = () => {
    for (const callback of cleanup.splice(0).reverse()) dispose(callback);
  };
  const scope: ResourceScope = {
    get active() {
      return active;
    },
    onCleanup(callback) {
      if (active) cleanup.push(callback);
      else dispose(callback);
    },
  };
  const settled = Promise.resolve()
    .then(async () => {
      if (!active) return;
      await initialize(scope);
      if (active) events.ready?.();
    })
    .catch((error: unknown) => {
      release();
      if (active) events.error?.(error);
    });
  return {
    settled,
    destroy() {
      if (!active) return;
      active = false;
      release();
    },
  };
}
