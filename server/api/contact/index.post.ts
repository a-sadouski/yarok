import { createError, defineEventHandler, getRequestIP, readBody } from 'h3';
import nodemailer from 'nodemailer';

interface IContactBody {
  name: string;
  phone: string;
  comment: string;
  company?: string;
}

type IRequestLogItem = {
  timestamps: number[];
  lastRequestAt: number;
};

const requestLog = new Map<string, IRequestLogItem>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const MIN_INTERVAL_MS = 60 * 1000;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const existing = requestLog.get(ip);

  if (!existing) {
    requestLog.set(ip, {
      timestamps: [now],
      lastRequestAt: now,
    });
    return;
  }

  const freshTimestamps = existing.timestamps.filter(timestamp => now - timestamp < WINDOW_MS);

  if (now - existing.lastRequestAt < MIN_INTERVAL_MS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Слишком частые отправки. Попробуйте чуть позже.',
    });
  }

  if (freshTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Превышен лимит заявок. Попробуйте позже.',
    });
  }

  freshTimestamps.push(now);

  requestLog.set(ip, {
    timestamps: freshTimestamps,
    lastRequestAt: now,
  });
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const body = await readBody<IContactBody>(event);

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const comment = body.comment?.trim();
  const company = body.company?.trim();

  if (company) {
    return {
      success: true,
    };
  }

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите имя',
    });
  }

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите телефон',
    });
  }

  if (!comment) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите комментарий',
    });
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  checkRateLimit(ip);

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpSecure === 'true',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeComment = escapeHtml(comment).replace(/\n/g, '<br>');

  await transporter.sendMail({
    from: `"Ярок" <${config.smtpUser}>`,
    to: config.contactToEmail,
    subject: 'Новая заявка с сайта',
    text: [
      'Новая заявка с сайта',
      '',
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Комментарий: ${comment}`,
      `IP: ${ip}`,
    ].join('\n'),
    html: `
      <h2>Новая заявка с сайта</h2>
      <p><strong>Имя:</strong> ${safeName}</p>
      <p><strong>Телефон:</strong> ${safePhone}</p>
      <p><strong>Комментарий:</strong></p>
      <p>${safeComment}</p>
      <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
    `,
  });

  return {
    success: true,
  };
});
