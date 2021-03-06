// Flags: --no-warnings
'use strict';

const common = require('../common');

const { ok, strictEqual } = require('assert');

{
  // Tests that abort is fired with the correct event type on AbortControllers
  const ac = new AbortController();
  ok(ac.signal);
  ac.signal.onabort = common.mustCall((event) => {
    ok(event);
    strictEqual(event.type, 'abort');
  });
  ac.signal.addEventListener('abort', common.mustCall((event) => {
    ok(event);
    strictEqual(event.type, 'abort');
  }), { once: true });
  ac.abort();
  ac.abort();
  ok(ac.signal.aborted);
}

{
  // Tests that abort events are trusted
  const ac = new AbortController();
  ac.signal.addEventListener('abort', common.mustCall((event) => {
    ok(event.isTrusted);
  }));
  ac.abort();
}

{
  // Tests that abort events have the same `isTrusted` reference
  const first = new AbortController();
  const second = new AbortController();
  let ev1, ev2;
  const ev3 = new Event('abort');
  first.signal.addEventListener('abort', common.mustCall((event) => {
    ev1 = event;
  }));
  second.signal.addEventListener('abort', common.mustCall((event) => {
    ev2 = event;
  }));
  first.abort();
  second.abort();
  const firstTrusted = Reflect.getOwnPropertyDescriptor(ev1, 'isTrusted').get;
  const secondTrusted = Reflect.getOwnPropertyDescriptor(ev2, 'isTrusted').get;
  const untrusted = Reflect.getOwnPropertyDescriptor(ev3, 'isTrusted').get;
  strictEqual(firstTrusted, secondTrusted);
  strictEqual(untrusted, firstTrusted);
}
