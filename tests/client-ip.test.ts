import assert from 'node:assert/strict';
import test from 'node:test';
import type { IncomingHttpHeaders } from 'node:http';
import { forwardClientIp } from '../server/utils/client-ip';

test('API proxy replaces spoofed forwarded IP with socket peer', () => {
  const headers: IncomingHttpHeaders = {
    'x-forwarded-for': 'spoofed',
    forwarded: 'for=spoofed',
    'x-real-ip': 'spoofed',
    cookie: 'admin_session=test',
  };
  forwardClientIp(headers, '127.0.0.1');
  assert.equal(headers['x-forwarded-for'], '127.0.0.1');
  assert.equal(headers.forwarded, undefined);
  assert.equal(headers['x-real-ip'], undefined);
  assert.equal(headers.cookie, 'admin_session=test');
  forwardClientIp(headers, undefined);
  assert.equal(headers['x-forwarded-for'], undefined);
});
