import { getCookie } from 'h3';
import { createHmac } from 'node:crypto';

function signAdminSession(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function hasAdminSession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig();
  const session = getCookie(event, 'admin_session');

  if (!session) {
    return false;
  }

  const [payload, signature] = session.split('.');

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signAdminSession(payload, config.adminSessionSecret);

  return payload === 'admin' && signature === expectedSignature;
}
