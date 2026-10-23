import type { IncomingHttpHeaders } from 'node:http';

export function forwardClientIp(headers: IncomingHttpHeaders, peerIp: string | undefined) {
  delete headers.forwarded;
  delete headers['x-real-ip'];
  if (peerIp) {
headers['x-forwarded-for'] = peerIp;
} else {
delete headers['x-forwarded-for'];
}
}
