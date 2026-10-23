import { createError, defineEventHandler, readBody, setCookie } from 'h3';
import { createHmac } from 'node:crypto';

interface IAdminLoginBody {
  login: string;
  password: string;
}

function signAdminSession(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const body = await readBody<IAdminLoginBody>(event);

  const isValidLogin = body.login === config.adminLogin;
  const isValidPassword = body.password === config.adminPassword;

  if (!isValidLogin || !isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль',
    });
  }

  const payload = 'admin';
  const signature = signAdminSession(payload, config.adminSessionSecret);
  const sessionValue = `${payload}.${signature}`;

  setCookie(event, 'admin_session', sessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return {
    success: true,
  };
});
