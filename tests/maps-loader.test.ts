import assert from 'node:assert/strict';
import test from 'node:test';
import { createYandexMapsLoader } from '../app/utils/yandex-maps-loader';

test('map loader shares requests, recovers after failure and times out', async () => {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const scripts: { onload: (() => void) | null; onerror: (() => void) | null; remove: () => void }[] = [];
  let removed = 0;
  const windowMock: { ymaps?: { ready: (callback: () => void) => void } } = {};
  Object.defineProperty(globalThis, 'window', { configurable: true, value: windowMock });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement: () => ({
        onload: null,
        onerror: null,
        remove: () => {
          removed++;
        },
      }),
      head: {
        appendChild: (script: (typeof scripts)[number]) => {
          scripts.push(script);
        },
      },
    },
  });
  try {
    await assert.rejects(createYandexMapsLoader('')(), /key is missing/);
    assert.equal(scripts.length, 0);
    const load = createYandexMapsLoader('test-key', 100);
    const first = load();
    assert.equal(load(), first);
    assert.equal(scripts.length, 1);
    scripts[0]!.onerror!();
    await assert.rejects(first, /Failed/);
    assert.equal(removed, 1);
    const retry = load();
    assert.equal(scripts.length, 2);
    windowMock.ymaps = { ready: callback => callback() };
    scripts[1]!.onload!();
    assert.equal(await retry, windowMock.ymaps);
    assert.equal(await load(), windowMock.ymaps);
    delete windowMock.ymaps;
    await assert.rejects(createYandexMapsLoader('test-key', 5)(), /timed out/);
    assert.equal(removed, 2);
  } finally {
    if (previousDocument) {
      Object.defineProperty(globalThis, 'document', previousDocument);
    } else {
      Reflect.deleteProperty(globalThis, 'document');
    }
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
});
