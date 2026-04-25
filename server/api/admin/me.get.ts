import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async event => {
  if (!hasAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return {
    authenticated: true,
  };
});
